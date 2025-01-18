import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "rpc",
  description: "A very customisable rpc on discord lmao",
  category: "rpc",
  callback: async (client, message, args: string[]) => {
    let command_usage = `**\`${client.prefix}${command.name} [set/reset] [playing/streaming] [rpc_string]\`**`;
    let option1 = args[0];

    if (!option1) {
      return client.send(message, {
        content: `Command malformed 😵\n${command_usage}`,
      });
    }

    switch (option1) {
      case "set":
        let option2 = args[1];
        let option3 = args.slice(2).join(" ");

        if (!option2 || !option3) {
          return client.send(message, {
            content: `Command malformed 😵\n${command_usage}`,
          });
        }

        client.db.set("presence", {
          type: option2,
          rpc: option3,
        });

        client.send(message, {
          content: `RPC set to **${option2}** with **${option3}**`,
        });

        break;
      case "reset":
        client.db.set("presence", {});

        client.send(message, {
          content: `RPC reseted.`,
        });

        break;
      default:
        return client.send(message, {
          content: `Command malformed 😵\n${command_usage}`,
        });
    }
  },
};
