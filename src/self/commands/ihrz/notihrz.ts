import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "notihrz",
  description: "Toggles the no ihrz function",
  category: "ihrz",
  async callback(client, message, args) {
    let states = await client.db.get("notihrz");

    await client.db.set("notihrz", !states);

    client.send(message, {
      content: `Not ihrz is now ${!states ? "enabled" : "disabled"}`,
    });
  },
};
