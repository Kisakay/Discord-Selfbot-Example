import { axios } from "ihorizon-tools";
import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "ipinfo",
  description: "Get information about an IP",
  category: "fun",
  callback: async (client, message, args) => {
    let ip = args[0];

    if (!ip) {
      return client.send(message, {
        content: `Command malformed 😵\n${client.prefix()}${command.name} **[ip]**`,
      });
    }

    let data = (await axios.get(`http://ip-api.com/json/${ip}`))?.data;

    if (data.status === "fail") {
      return client.send(message, {
        content: `❌ **Invalid IP**`,
      });
    }

    let formatedMessage = `> ⚡ **IP information for ${data.query}**\n
> **Country**: ${data.country}\n
> **Region**: ${data.regionName}\n
> **City**: ${data.city}\n
> **ZIP**: ${data.zip}\n
> **ISP**: ${data.isp}\n

> **Organization**: ${data.org}\n
> **AS**: ${data.as}\n
> **Timezone**: ${data.timezone}\n
> **Lat/Lon**: ${data.lat}, ${data.lon}
`;
    client.send(message, formatedMessage);
  },
};
