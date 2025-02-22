import type { SelfCommandType } from "../../../../types/self_commands";
import { time } from "discord.js";

export const command: SelfCommandType = {
  name: "whopingme",
  description: "Get the member who pinged you",
  category: "utils",
  callback: (client, message, args) => {
    let snipeData = client.db.get(`GHOST_PING.${message.channelId}`);

    if (!snipeData) {
      client.send(message, { content: "Nothing to snipe here!" });
      return;
    }

    client.send(message, {
      content: `⭐ __**Who Pinged Me**__ \n**Author**: <@${snipeData.author}>\n**When**:${time(new Date(snipeData.timestamp), "R")}\n**Content**: ${(snipeData.content as string).substring(0, 1900)}`,
    });
  },
};
