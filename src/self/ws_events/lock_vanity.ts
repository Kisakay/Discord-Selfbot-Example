import { GuildAuditLogs } from "discord.js-selfbot-v13-kisakay-patch";
import type { Self } from "../self";
import { logger } from "ihorizon-tools";

export const event = {
    name: "GUILD_UPDATE",
    once: false,
    async callback(client: Self, data: any) {
        let _ = Date.now();
        let locked = false;

        // Early return if no guild ID
        if (!data?.id) {
            console.log("[LockVanity] Missing guild ID in update event");
            return;
        }

        const lockVanity = await client.db.get(`lockvanity.${data.id}`);
        if (!lockVanity || !client.options.TOTPKey) return;

        if (data.vanity_url_code !== lockVanity) {
            try {
                let e = await (client as any).api.guilds(data.id, "vanity-url").patch({
                    data: {
                        code: lockVanity,
                    },
                });

                _ = Date.now() - _;
                locked = e.code === lockVanity;
            } catch (error) {
                console.error("[LockVanity] Failed to update vanity URL:", error);
                _ = Date.now() - _;
                locked = false;
            }
        }

        try {
            let guild = await client.guilds.fetch(data.id);
            if (!guild) {
                console.log("[LockVanity] Could not fetch guild:", data.id);
                return;
            }

            const fetchedLogs = await guild.fetchAuditLogs({ type: GuildAuditLogs.Actions.GUILD_UPDATE });

            let filteredLog = fetchedLogs.entries
                .filter(x => x.changes?.find(y => y.key === "vanity_url_code"))
                .filter(x => x.changes?.find(y => y.new === data.vanity_url_code))
                .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
                .filter(x => x.executor?.id !== client.user?.id)
                .filter(x => x.executor?.id !== guild.ownerId)
                .filter(x => x.createdTimestamp > Date.now() - 5000)
                .first();

            // Handle case where no valid log entry is found
            if (!filteredLog?.executor?.id) {
                console.log("[LockVanity] No valid audit log entry found for vanity URL change");
                return;
            }

            const author = await guild.members.fetch(filteredLog.executor.id).catch(() => null);
            if (!author) {
                console.log(`[LockVanity] Could not fetch member for ID: ${filteredLog.executor.id}`);
                return;
            }

            // Skip if author is owner
            if (author.id === guild.ownerId) return;

            logger.warn(`[LockVanity] ${author.id} have tried to change the vanity url of the guild ${guild.name} (${guild.id})`);
            let action = "";

            // Handle punishments with proper error handling
            try {
                if (author.bannable) {
                    await author.ban({ reason: "[LockVanity] Have tried to change the vanity url !" });
                    action = "banned";
                } else if (author.kickable) {
                    await author.kick("[LockVanity] Have tried to change the vanity url !");
                    action = "kicked";
                } else {
                    // Safely handle role removal
                    const roles = author.roles.cache.filter(x =>
                        !x.managed &&
                        x.position < (guild.members.me?.roles.highest.position ?? 0) &&
                        x.id !== guild.roles.everyone.id
                    );

                    for (const [_, role] of roles) {
                        await author.roles.remove(role.id, "[LockVanity] Have tried to change the vanity url !")
                            .catch(err => console.error(`Failed to remove role ${role.id}:`, err));
                    }
                    action = "stripped of roles";
                }

                // Handle admin permission case
                if (guild.members.cache.get(author.id) && author.permissions.has("ADMINISTRATOR")) {
                    logger.err("[LockVanity] Failed to remove admin role");
                    action = "cannot punish";
                }
            } catch (error) {
                console.error("[LockVanity] Failed to apply punishment:", error);
                action = "cannot punish";
            }

            // Notify owner with proper error handling
            try {
                const owner = await guild.members.fetch(guild.ownerId);
                if (owner) {
                    await owner.send(`${author.toString()} have tried to change the vanity url of the guild. They have been **${action}** for this action.`)
                        .catch(() => console.log("[LockVanity] Could not DM owner"));

                    let veryBigAlert = "";

                    if (action === 'cannot punish') {
                        veryBigAlert += `# 🚨🚨🚨🚨🚨🚨\n# CANNOT MANAGED THE SNIPE`;
                        await owner.send(`I can't punish ${author.toString()}, they have higher permissions than me.\nTrying to lock the vanity URL to ${lockVanity}!`)
                            .catch(() => console.log("[LockVanity] Could not send follow-up DM to owner"));
                    }

                    if (locked) {
                        veryBigAlert += `# 💥💥💥💥💥💥\n# VANITY URL GOT SNIPED`;
                        await owner.send(`The vanity URL of the guild has been sniped by ${author.toString()}!\nI'm sorry...`)
                            .catch(() => console.log("[LockVanity] Could not send snipe alert to owner"));
                    }

                    // Broadcast final status
                    client.broadcast(
                        `# VANITY URL SNIPE ALERT\n${veryBigAlert}\n` +
                        `**Guild:** ${guild.name} (${guild.id})\n` +
                        `**Author:** ${author.toString()} (${author.id})\n` +
                        `**Action:** ${action}\n` +
                        `**Vanity URL:** ${data.vanity_url_code}\n` +
                        `**Lock Vanity URL:** ${lockVanity}\n` +
                        `**Time:** ${_}ms`
                    );
                }
            } catch (error) {
                console.error("[LockVanity] Failed to handle owner notifications:", error);
            }

        } catch (error) {
            console.error("[LockVanity] Major error in handling guild update:", error);
        }
    },
};