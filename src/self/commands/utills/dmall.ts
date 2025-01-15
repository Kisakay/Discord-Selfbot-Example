import type { Message } from "discord.js-selfbot-v13";
import type { Self } from "../../self";
import type { SelfCommandType } from "../../../../types/self_commands.d.ts";
import { wait } from "ihorizon-tools";

export const command: SelfCommandType = {
    name: 'dmall',
    description: 'Sending message to all users in your friend list and direct messages',
    callback: async (client: Self, message: Message, args: string[]) => {

        let msg = args.join(" ");

        if (!msg) return message.channel.send("Please provide a message to send!");

        const relationships = client.relationships.cache.entries();

        for (const user of relationships.map((x) => x)) {
            try {
                client.users.createDM(user[0]).then((dm) => {
                    dm.send({ content: msg });
                });
                client.logger.log(`Sent message to ${user[0]}`);
            } catch (err) {
                client.logger.err(`Failed to send message to ${user[0]}`);
            }
            await wait(2000)
        }
    }
}