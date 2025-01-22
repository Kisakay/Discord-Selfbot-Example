import type { GroupDMChannel } from "discord.js-selfbot-v13";
import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "lockgroup",
  description: "Lock the group to prevent users from joining or leaving",
  category: "gestion",
  aliases: ["lg"],
  callback: async (client, message, args) => {
    let states = client.db.get("lockgroup");

    client.db.set("lockgroup", !states);

    client.send(message, {
      content: `Lockgroup is now ${!states ? "enabled" : "disabled"}`,
    });
  },
};
