import type { Guild, GuildMember } from "discord.js-selfbot-v13-kisakay-patch";
import type { Self } from "../self";
import type { SelfEventType } from "../../../types/self_event.d.ts";

export const event: SelfEventType = {
  name: "guildMemberRemove",
  once: false,
  callback: (client: Self, member: GuildMember) => {
    if (client.user!.id === client.config?.ihorizon_owner_id) {
      let state = client.db.get("notihrz");

      let iHorizon_was_in_server =
        member.user.id === client.config.ihorizon_bot_id;

      if (iHorizon_was_in_server && state) {
        member.guild.leave();
      }
    }
  },
};
