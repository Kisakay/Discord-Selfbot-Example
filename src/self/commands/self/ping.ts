import type { SelfCommandType } from "../../../../types/self_commands";

export const command: SelfCommandType = {
  name: "ping",
  description: "show ping",
  category: "bot",
  aliases: ["speed"],

  callback: async (client, message, args: string[]) => {
    client.send(message, {
        content: `⭐ __**Speed**__ \n**WS**: \`${client.ws.ping}\`\n`
    })
  },
};
