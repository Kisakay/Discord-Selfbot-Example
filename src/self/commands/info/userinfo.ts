import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
    name: 'userinfo',
    description: 'Shows the user information',
    category: "info",
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

        client.send(message, `> ⚡ **${user}'s informations**\n\`\`\`yaml
ID: ${user.id}
Username: ${user.username}
Tag: ${user.tag}
Created At: ${user.createdAt}

Common Server: ${client.guilds.cache.filter((g) => g.members.cache.has(user.id)).map((g) => g.name).join(', ') || 'None'}
Bot: ${user.bot ? 'Yes' : 'No'}

Display Avatar: ${user.displayAvatarURL({ dynamic: true })}

Clan: ${user.clan?.tag || 'None'}

\`\`\``);
    }
};