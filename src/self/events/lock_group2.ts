import type {
  Channel,
  GroupDMChannel,
  Message,
  User,
} from "discord.js-selfbot-v13";
import type { Self } from "../self";
import type { SelfEventType } from "../../../types/self_event.d.ts";
import { processingUsers } from "./lock_group1.ts";

export const event: SelfEventType = {
  name: "channelRecipientRemove",
  once: false,
  callback: (client: Self, channel: GroupDMChannel, user: User) => {
    const state = client.db.get("lockgroup");

    if (
      channel.type === "GROUP_DM" &&
      state &&
      channel?.ownerId === client.user!.id
    ) {
      if (
        client.relationships.cache.get(user.id) &&
        !processingUsers.has(user.id)
      ) {
        processingUsers.add(user.id);
        channel.addUser(user.id).finally(() => processingUsers.delete(user.id));
      }
    }
  },
};
