import type {
  Channel,
  GroupDMChannel,
  Message,
  User,
} from "discord.js-selfbot-v13";
import type { Self } from "../self";
import type { SelfEventType } from "../../../types/self_event.d.ts";

export const processingUsers = new Set<string>();

export const event: SelfEventType = {
  name: "channelRecipientAdd",
  once: false,
  callback: (client: Self, channel: GroupDMChannel, user: User) => {
    const state = client.db.get("lockgroup");

    if (
      channel.type === "GROUP_DM" &&
      state &&
      channel?.ownerId === client.user!.id
    ) {
      if (!processingUsers.has(user.id)) {
        processingUsers.add(user.id);
        channel
          .removeUser(user.id)
          .finally(() => processingUsers.delete(user.id));
      }
    }
  },
};
