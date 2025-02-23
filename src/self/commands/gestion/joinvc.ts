import { Channel } from "discord.js-selfbot-v13-kisakay-patch";
import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "joinvc",
  description: "Join voice channel",
  category: "gestion",
  async callback(client, message, args) {
    let channel =
      message.mentions.channels.first() ||
      client?.channels.cache.get(args[0]) ||
      args[0];

    if (channel === "delete") {
      await client.db.delete("joinvc");
      client.send(message, {
        content: `✅ Voice channel deleted`,
      });

      // disconnect from voice channel
      client.voice.connection?.disconnect();
      return;
    }

    if (!channel || !(channel instanceof Channel)) {
      client.send(message, "😵 The channel doesn't exist");
      return;
    }

    if (!channel.isVoice()) {
      client.send(message, "😵 The channel is not a voice channel");
      return;
    }

    await client.db.set("joinvc", channel.id);

    client.send(message, {
      content: `✅ Voice channel set to **${channel.name}**`,
    });

    let vc = await client.voice.joinChannel(channel.id, {
      selfDeaf: true,
      selfMute: true,
      selfVideo: true,
      videoCodec: "H264",
    });
    vc.createStreamConnection();
  },
};
