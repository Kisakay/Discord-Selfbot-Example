import type { Channel, GroupDMChannel, Message } from "discord.js-selfbot-v13-kisakay-patch";
import type { Self } from "../self";
import type { SelfEventType } from "../../../types/self_event.d.ts";

export const event: SelfEventType = {
  name: "channelCreate",
  once: false,
  async callback(client: Self, channel: Channel) {
    let state = await client.db.get("antigroup");

    if (
      channel.type === "GROUP_DM" &&
      state &&
      (channel as GroupDMChannel)?.ownerId !== client.user!.id
    ) {
      client.logger.warn(`Group ${channel.id} leaved.`);
      channel.delete().catch(() => false);
    }
  },
};
