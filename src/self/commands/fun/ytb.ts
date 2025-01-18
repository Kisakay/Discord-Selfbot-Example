import type { SelfCommandType } from "../../../../types/self_commands.d.ts";
export const command: SelfCommandType = {
  name: "ytb",
  description: "Make a youtube search",
  category: "fun",
  callback: async (client, message, args) => {
    let query = args.join(" ");

    client.send(message, {
      content: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    });
  },
};
