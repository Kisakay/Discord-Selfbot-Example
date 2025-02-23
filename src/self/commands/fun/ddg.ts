import type { SelfCommandType } from "../../../../types/self_commands.d.ts";
export const command: SelfCommandType = {
  name: "ddg",
  description: "Make a DuckDuckGo search",
  category: "fun",
  async callback(client, message, args) {
    let query = args.join(" ");

    client.send(message, {
      content: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
    });
  },
};
