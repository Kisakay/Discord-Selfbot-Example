import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
    name: 'iq',
    description: 'how much the discord user have IQ',
    category: "fun",
    callback: async (client, message, args) => {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]);

        if (!user && args[0]) {
            try {
                user = await client.users.fetch(args[0]);
            } catch (error) {
                client.send(message, '> ❌ **User not found or invalid ID**');
                return;
            }
        }

        if (!user) {
            user = message.author;
        }

        // Random number between 0 and 210
        let value = Math.floor(Math.random() * 210);

        client.send(message, `> ⚡ **${user.username}** have **${value}IQ**`);
    }
};