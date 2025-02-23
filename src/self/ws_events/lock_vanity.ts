import { Guild, GuildAuditLogs, GuildMember } from "discord.js-selfbot-v13-kisakay-patch";
import type { Self } from "../self";
import { logger } from "ihorizon-tools";

export const event = {
    name: "GUILD_UPDATE",
    once: false,
    async callback(client: Self, data: any) {
        const start = performance.now();
        let executionTime;
        let restored = false;

        const lockVanity = await client.db.get(`lockvanity.${data.id}`);
        if (!lockVanity || !client.options.TOTPKey) return;
        if (data.vanity_url_code === lockVanity) return;

        try {
            const req = await fetch(`https://discord.com/api/v9/guilds/${data.id}/vanity-url`, {
                method: "PATCH",
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-US",
                    "sec-ch-ua": "\"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-debug-options": "bugReporterEnabled",
                    "x-discord-locale": "en-US",
                    "x-discord-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                    "x-super-properties": Buffer.from(JSON.stringify(client.options.ws!.properties), 'ascii').toString('base64'),
                    "referer": "https://discord.com/channels/@me",
                    "origin": "https://discord.com",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Electron/33.0.0 Safari/537.36",
                    "priority": "u=1, i",
                    "Authorization": client.token!,
                    "X-Discord-Mfa-Authorization": client.mfaToken[data.id],
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: lockVanity }),
                redirect: "follow",
                credentials: "include",
            });

            executionTime = performance.now() - start;

            let response = await req.json();

            restored = response.code === lockVanity;
        } catch (error) {
            executionTime = performance.now() - start;
            console.error("[LockVanity] Failed to update vanity URL:", error);
            restored = false;
        }

        try {
            const guild = client.guilds.cache.get(data.id);
            if (!guild) return;

            await notifyMe(
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

async function notifyMe(client: Self, guild: Guild, currentVanity: string, lockVanity: string, restored: boolean, executionTime: number) {
    try {
        const owner = await guild.members.fetch(guild.ownerId);
        if (!owner) return;

        const auditInfo = await handleAuditLogs(client, { vanity_url_code: currentVanity }, guild, restored, executionTime);
        if (!auditInfo) return;

        const { author, action } = auditInfo;

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