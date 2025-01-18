import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
    name: 'avatar',
    description: 'Shows the user avatar',
    category: "info",
    callback: async (client, message, args) => {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]);

        if (!user && args[0]) {
            try {
                user = await client.users.fetch(args[0]);
            } catch (error) {
                await client.send(message, '> ❌ **User not found or invalid ID**');
                return;
            }
        }

        if (!user) {
            user = message.author;
        }

        client.send(message, `> ⚡ **${user}'s avatar**\n${user.displayAvatarURL({ dynamic: true, size: 4096 })}`);
    }
};