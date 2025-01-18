import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
    name: 'banner',
    description: 'Shows the user banner',
    category: "info",
    callback: async (client, message, args) => {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]);

        if (!user && args[0]) {
            try {
                user = await client.users.fetch(args[0], { force: true });
            } catch (error) {
                client.send(message, '> ❌ **User not found or invalid ID**');
                return;
            }
        } else if (user) {
            try {
                user = await client.users.fetch(user.id, { force: true });
            } catch (error) {
                client.send(message, '> ❌ **Failed to fetch user data**');
                return;
            }
        } else {
            try {
                user = await client.users.fetch(message.author.id, { force: true });
            } catch (error) {
                client.send(message, '> ❌ **Failed to fetch your data**');
                return;
            }
        }

        if (!user.banner) {
            client.send(message, { content: "☠️ This user doesn't have a banner" });
            return;
        }

        client.send(message, `> ⚡ **${user}'s banner**\n${user.bannerURL({ dynamic: true, size: 4096 })}`);
    }
};