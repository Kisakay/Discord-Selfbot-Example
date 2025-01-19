import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "notihrz",
  description: "Toggles the no ihrz function",
  category: "ihrz",
  callback: (client, message, args) => {
    let states = client.db.get("notihrz");

    client.db.set("notihrz", !states);

    client.send(message, {
      content: `Not ihrz is now ${!states ? "enabled" : "disabled"}`,
    });
  },
};
