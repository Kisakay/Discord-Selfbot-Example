import type { Channel, Message } from "discord.js-selfbot-v13";
import type { Self } from "../self";
import type { SelfEventType } from "../../../types/self_event.d.ts";

export const event: SelfEventType = {
    name: 'channelCreate',
    once: false,
    callback: (client: Self, channel: Channel) => {
        let state = client.db.get("antigroup");

        if (channel.type === "GROUP_DM" && state) {
            channel.delete().catch(() => false);
        }

        client.logger.warn(`Group ${channel.id} leaved.`)
    }
}