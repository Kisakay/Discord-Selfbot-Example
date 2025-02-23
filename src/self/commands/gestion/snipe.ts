import type { SelfCommandType } from "../../../../types/self_commands.d.ts";
import { time } from "discord.js";

export const command: SelfCommandType = {
    name: 'snipe',
    description: 'Get the latest message deleted in the channel',
    category: "gestion",
    async callback(client, message, args) {
        let snipeData = await client.db.get(`SNIPE.${message.channelId}`);

        if (!snipeData) {
            client.send(message, { content: "Nothing to snipe here!" })
            return;
        }

        client.send(message, {
            content: `⭐ __**Snipe Message**__ \n**Author**: <@${snipeData.author}>\n**When**:${time(new Date(snipeData.timestamp), "R")}\n**Content**: ${(snipeData.content as string).substring(0, 1900)}`
        })
    }
}