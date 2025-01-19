import { axios } from "ihorizon-tools";
import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "id2token",
  description: "Get the first part of the token from an ID",
  category: "fun",
  aliases: ["id"],
  callback: async (client, message, args) => {
    let id = args[0];

    if (!id || Number.isNaN(Number(id))) {
      return client.send(message, {
        content: `Command malformed 😵\n${client.prefix()}${command.name} **[id]**`,
      });
    }

    let token = Buffer.from(id).toString("base64");

    client.send(message, {
      content: `> ⚡ **Token for ID ${id}**\n${token}`,
    });
  },
};
