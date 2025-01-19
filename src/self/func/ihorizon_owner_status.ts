import { CustomStatus } from "discord.js-selfbot-v13";
import { axios } from "ihorizon-tools";
import type { Self } from "../self";

async function updatePresenceLoop(client: Self) {
  if (client.user?.id !== client.config?.ihorizon_owner_id) return;

  let info = await axios.get("https://gateway.ihorizon.me/api/ihorizon/v1/bot");
  let array = [
    `iHorizon's Servers: ${info.data.info.servers}`,
    `Members: ${info.data.info.members}`,
    `discord.gg/ihorizon`,
    `bot with ${info.data.content.commands} commands => discord.gg/ihorizon`,
    `iHorizon is on ${info.data.info.shards} shard(s) !`,
    `Kisakay :p`,
  ];

  const updatePresence = async () => {
    try {
      info = await axios.get("https://gateway.ihorizon.me/api/ihorizon/v1/bot");

      array = [
        `iHorizon's Servers: ${info.data.info.servers}`,
        `Members: ${info.data.info.members}`,
        `discord.gg/ihorizon`,
        `bot with ${info.data.content.commands} commands => discord.gg/ihorizon`,
        `iHorizon is on ${info.data.info.shards} shard(s) !`,
        `Kisakay :p`,
      ];

      const randomText = array[Math.floor(Math.random() * array.length)];

      client.user?.setPresence({
        activities: [
          new CustomStatus(client).setEmoji("⚡").setState(randomText),
        ],
      });
    } catch (error) {
      console.error("Failed to update presence:", error);
    }
  };

  // Initial update
  await updatePresence();

  // Setup interval for updates every 10 seconds
  const intervalId = setInterval(updatePresence, 10000);

  // Return cleanup function
  return () => clearInterval(intervalId);
}

export { updatePresenceLoop };
