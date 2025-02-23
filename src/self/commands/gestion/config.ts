import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "config",
  description: "Get all the config data",
  category: "gestion",
  async callback(client, message, args) {
    const config_data = await client.db.all();
    const lowercaseConfigs = config_data.filter(
      (item) => item.id === item.id.toLowerCase(),
    );

    const maxIdLength = Math.max(
      ...lowercaseConfigs.map((item) => item.id.length),
    );

    const formatValue = (value: any) => {
      if (typeof value === "boolean") return value ? "true" : "false";
      if (typeof value === "string") return value;
      if (typeof value === "object" && value !== null) {
        return Object.entries(value)
          .map(([key, val]) => `${key}: '${String(val)}'`)
          .join(", ");
      }
      return String(value);
    };

    const maxValueLength = Math.max(
      ...lowercaseConfigs.map((item) => formatValue(item.value).length),
    );

    const totalWidth = maxIdLength + maxValueLength + 7;

    const borderLine = "═".repeat(totalWidth);
    const topBorder = `╔${borderLine}╗`;
    const bottomBorder = `╚${borderLine}╝`;

    const formattedLines = lowercaseConfigs.map((item) => {
      const id = item.id.padEnd(maxIdLength);
      const value = formatValue(item.value).padEnd(maxValueLength);
      return `║ • ${id} │ ${value} ║`;
    });

    const formattedMessage = `\`\`\`js\n${topBorder}
${formattedLines.join("\n")}
${bottomBorder}\`\`\``;

    client.send(message, formattedMessage);
  },
};
