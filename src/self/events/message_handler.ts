import type { Message } from "discord.js-selfbot-v13-kisakay-patch";
import type { Self } from "../self";
import type { SelfEventType } from "../../../types/self_event.d.ts";

export const event: SelfEventType = {
  name: "messageCreate",
  once: false,
  callback: (client: Self, message: Message) => {
    if (message.author.id !== client.user?.id) return;

    const self_prefix =
      client.db.get("prefix") || client.config?.selfbot_prefix!;
    if (!message.content.startsWith(self_prefix)) return;

    const args = message.content
      .slice(client.config?.selfbot_prefix.length)
      .trim()
      .split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = client.commands.get(
      client.aliases.get(commandName) || commandName,
    );
    if (!command) return;

    command.callback(client, message, args);

    client.logger.log(
      `Command ${commandName} executed by ${message.author.tag}`,
    );
  },
};
