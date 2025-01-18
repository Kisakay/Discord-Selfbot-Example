import type { Message } from "discord.js-selfbot-v13";
import type { Self } from "../self";
import type { SelfEventType } from "../../../types/self_event.d.ts";

export const event: SelfEventType = {
    name: 'messageDelete',
    once: false,
    callback: (client: Self, oldMessage: Message) => {
        client.db.set(`SNIPE.${oldMessage.channelId}`, {
            author: oldMessage.author.id,
            content: oldMessage.content,
            timestamp: Date.now(),
            
        })
    }
}