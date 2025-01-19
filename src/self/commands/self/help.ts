import type { SelfCommandType } from "../../../../types/self_commands";

export const command: SelfCommandType = {
  name: "help",
  description: "See all commands",
  category: "bot",
  aliases: ["h"],

  callback: async (client, message, args: string[]) => {
    const commands = client.commands;
    let helpMessage = `= 📜 Help Message =\n`;

    const categories: Record<string, SelfCommandType[]> = {};

    commands.forEach((command) => {
      const category = command.category || "Uncategorized";
      if (!categories[category]) categories[category] = [];
      categories[category].push(command);
    });

    for (const [category, commands] of Object.entries(categories)) {
      helpMessage += `\n== 📂 ${category} ==\n`;
      commands.forEach((command) => {
        helpMessage += `* \`${client.prefix()}${command.name}\`: ${command.description || "No description provided"}\n`;
        if (command.aliases) {
          helpMessage += `  * Aliases: ${command.aliases.join(", ")}\n\n`;
        }
      });
    }

    helpMessage = `\`\`\`asciidoc\n${helpMessage}\n\`\`\``;

    const splitMessageWithCodeBlocks = (message: string, maxLength: number) => {
      const messages = [];
      let currentIndex = 0;

      while (currentIndex < message.length) {
        let endIndex = Math.min(message.length, currentIndex + maxLength - 8); // -8 pour les balises de code

        if (
          endIndex < message.length &&
          message.slice(endIndex, endIndex + 8) === "\`\`\`\n"
        ) {
          endIndex -= 8;
        }

        messages.push(message.slice(currentIndex, endIndex));
        currentIndex = endIndex;
      }

      return messages;
    };

    const MAX_MESSAGE_LENGTH = 2000;

    const messageParts = splitMessageWithCodeBlocks(
      helpMessage,
      MAX_MESSAGE_LENGTH,
    );

    if (messageParts.length > 1) {
      for (const part of messageParts) {
        client.send(message, part);
      }
    } else {
      client.send(message, helpMessage);
    }
  },
};
