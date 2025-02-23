import { Guild, GuildAuditLogs, GuildMember } from "discord.js-selfbot-v13-kisakay-patch";
import type { Self } from "../self";
import { logger } from "ihorizon-tools";

export const event = {
    name: "GUILD_UPDATE",
    once: false,
    async callback(client: Self, data: any) {
        const start = performance.now();
        let restored = false;

        const lockVanity = await client.db.get(`lockvanity.${data.id}`);
        if (!lockVanity || !client.options.TOTPKey) return;
        if (data.vanity_url_code === lockVanity) return;

        try {
            const response = await (client as any).api.guilds(data.id, "vanity-url").patch({
                data: { code: lockVanity },
                timeout: 2000
            });

            restored = response.code === lockVanity;
        } catch (error) {
            console.error("[LockVanity] Failed to update vanity URL:", error);
            restored = false;
        }

        const executionTime = performance.now() - start;

        const guild = await client.guilds.fetch(data.id).catch(err => {
            console.error("[LockVanity] Could not fetch guild:", data.id, err);
            return null;
        });

        if (!guild) return;

        try {
            await handleAuditLogs(client, data, guild, restored, executionTime);
        } catch (error) {
            console.error("[LockVanity] Failed to handle audit logs:", error);
        }

        try {
            await notifyOwner(
                client,
                guild,
                data.vanity_url_code,
                lockVanity,
                restored,
                executionTime
            );
        } catch (error) {
            console.error("[LockVanity] Failed to notify owner:", error);
        }

        return restored;
    },
};

async function handleAuditLogs(client: Self, data: any, guild: Guild, restored: boolean, executionTime: number) {
    try {
        const fetchedLogs = await guild.fetchAuditLogs({
            type: GuildAuditLogs.Actions.GUILD_UPDATE,
            limit: 20
        });

        const filteredLog = fetchedLogs.entries
            .find(x =>
                x.changes?.some(y => y.key === "vanity_url_code" && y.new === data.vanity_url_code) &&
                x.executor?.id !== client.user?.id &&
                x.executor?.id !== guild.ownerId &&
                x.createdTimestamp > Date.now() - 5000
            );

        if (!filteredLog?.executor?.id) {
            console.log("[LockVanity] No valid audit log entry found");
            return null;
        }

        const author = await guild.members.fetch(filteredLog.executor.id).catch(() => null);
        if (!author || author.id === guild.ownerId) return null;

        logger.warn(`[LockVanity] ${author.id} attempted to change vanity URL of ${guild.name} (${guild.id})`);

        let action = await applyPunishment(guild, author);

        return {
            author,
            action,
            executionTime
        };

    } catch (error) {
        console.error("[LockVanity] Error in audit logs handling:", error);
        return null;
    }
}

async function applyPunishment(guild: Guild, author: GuildMember): Promise<string> {
    try {
        if (author.bannable) {
            await author.ban({ reason: "[LockVanity] Attempted to change vanity URL!" });
            return "banned";
        }

        if (author.kickable) {
            await author.kick("[LockVanity] Attempted to change vanity URL!");
            return "kicked";
        }

        const roles = author.roles.cache.filter((x) =>
            !x.managed &&
            x.position < (guild.members.me?.roles.highest.position ?? 0) &&
            x.id !== guild.roles.everyone.id
        );

        await Promise.all(
            Array.from(roles.values()).map((role) =>
                author.roles.remove(role.id, "[LockVanity] Attempted to change vanity URL!")
                    .catch(err => console.error(`Failed to remove role ${role.id}:`, err))
            )
        );

        return author.permissions.has("ADMINISTRATOR") ? "cannot punish" : "stripped of roles";
    } catch (error) {
        console.error("[LockVanity] Punishment application failed:", error);
        return "cannot punish";
    }
}

async function notifyOwner(client: Self, guild: Guild, currentVanity: string, lockVanity: string, restored: boolean, executionTime: number) {
    try {
        const owner = await guild.members.fetch(guild.ownerId);
        if (!owner) return;

        const auditInfo = await handleAuditLogs(client, { vanity_url_code: currentVanity }, guild, restored, executionTime);
        if (!auditInfo) return;

        const { author, action } = auditInfo;

        let messages = [
            `${author.toString()} attempted to change the vanity URL. They have been **${action}** for this action.`
        ];

        if (action === 'cannot punish') {
            messages.push(`I can't punish ${author.toString()}, they have higher permissions than me.\nTrying to lock vanity URL to ${lockVanity}!`);
        }

        if (!restored) {
            messages.push(`⚠️ The vanity URL has been sniped by ${author.toString()}!\nI apologize for not preventing this.`);
        }

        await Promise.all(messages.map(msg =>
            owner.send(msg).catch(() => console.log("[LockVanity] Failed to send owner message"))
        ));

        const alertStatus = [
            action === 'cannot punish' ? '🚨 CANNOT MANAGE THE SNIPE' : '',
            !restored ? '💥 VANITY URL GOT SNIPED' : '✅ VANITY PROTECTED'
        ].filter(Boolean).join('\n');

        client.broadcast(
            `# VANITY URL SNIPE ALERT\n${alertStatus}\n` +
            `**Guild:** ${guild.name} (${guild.id})\n` +
            `**Author:** ${author.toString()} (${author.id})\n` +
            `**Action:** ${action}\n` +
            `**Current Vanity:** ${currentVanity}\n` +
            `**Lock Vanity:** ${lockVanity}\n` +
            `**Time:** ${executionTime.toFixed(2)}ms`
        );

    } catch (error) {
        console.error("[LockVanity] Owner notification failed:", error);
    }
}