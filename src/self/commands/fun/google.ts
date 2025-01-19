import type { SelfCommandType } from "../../../../types/self_commands.d.ts";
export const command: SelfCommandType = {
  name: "go",
  description: "Make a Google search",
  category: "fun",
  aliases: ["google"],
  callback: async (client, message, args) => {
    let query = args.join(" ");

    client.send(message, {
      content: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    });
  },
};
