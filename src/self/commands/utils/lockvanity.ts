import type { SelfCommandType } from "../../../../types/self_commands";

export const command: SelfCommandType = {
    name: 'lockvanity',
    description: 'Lock a vanity URL',
    category: "utils",
    async callback(client, message, args) {
        let option = args[0];

        if (option === "unlock") {
            await client.db.delete(`lockvanity.${message.guildId}`);

            client.send(message, "Vanity URL has been unlocked");
        } else if (option === "lock") {
            if (!message.guild?.vanityURLCode) {
                return client.send(message, "This server does not have a vanity URL.");
            }

            client.send(message, `The vanity URL \`${message.guild?.vanityURLCode}\` has been locked. When a user tries to change the vanity URL to a another one, they will be banned. And Vanity URL \`${message.guild?.vanityURLCode}\` is locked.`);
            await client.db.set(`lockvanity.${message.guildId}`, message.guild?.vanityURLCode);
        } else {
            client.send(message, {
                content: `Command malformed 😵\n${await client.prefix()}${command.name} **[unlock/lock]**`,
            });
        }
    }
}