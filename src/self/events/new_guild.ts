import type { Guild } from "discord.js-selfbot-v13-kisakay-patch";
import type { Self } from "../self";
import type { SelfEventType } from "../../../types/self_event.d.ts";

export const event: SelfEventType = {
  name: "guildCreate",
  once: false,
  async callback(client: Self, guild: Guild) {
    if (client.user!.id === client.config?.ihorizon_owner_id) {
      let state = await client.db.get("notihrz");

      let iHorizon_in_server = guild.members.cache.get(
        client.config.ihorizon_bot_id,
      );

      if (!iHorizon_in_server && state) {
        guild.leave();
      }
    }
  },
};
