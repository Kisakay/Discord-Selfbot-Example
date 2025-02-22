import type { Message } from "discord.js-selfbot-v13-kisakay-patch";
import type { Self } from "../self";
import type { SelfEventType } from "../../../types/self_event.d.ts";

export const event: SelfEventType = {
  name: "messageDelete",
  once: false,
  callback: (client: Self, oldMessage: Message) => {
    if (!oldMessage.author) return;
    if (oldMessage.author.id === client.user?.id) return;

    client.db.set(`SNIPE.${oldMessage.channelId}`, {
      author: oldMessage.author.id,
      content: oldMessage.content,
      timestamp: Date.now(),
    });

    if (oldMessage.mentions.users.get(client.user?.id!)) {
      client.db.set(`GHOST_PING.${oldMessage.channelId}`, {
        author: oldMessage.author.id,
        content: oldMessage.content,
        timestamp: Date.now(),
      });
    }
  },
};
