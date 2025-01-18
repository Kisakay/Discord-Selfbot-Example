import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "b64",
  description: "Encode/Decode base64",
  category: "fun",
  callback: async (client, message, args) => {
    let option = args[0];
    let text = args.slice(1).join(" ");

    if (!option || !text) {
      return client.send(message, {
        content: `Command malformed 😵\n${client.prefix}${command.name} **[encode/decode] [text]**`,
      });
    }

    switch (option) {
      case "encode":
        client.send(message, {
          content: `> ⚡ **Base64 encoded**\n${Buffer.from(text).toString("base64")}`,
        });
        break;
      case "decode":
        client.send(message, {
          content: `> ⚡ **Base64 decoded**\n${Buffer.from(text, "base64").toString("utf-8")}`,
        });
        break;
      default:
        return client.send(message, {
          content: `Command malformed 😵\n${client.prefix}${command.name} **[encode/decode] [text]**`,
        });
    }
  },
};
