import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "joinvc",
  description: "Join voice channel",
  category: "gestion",
  callback: (client, message, args) => {
    let channel =
      message.mentions.channels.first() || client?.channels.cache.get(args[0]);

    if (!channel) {
      client.send(message, "😵 The channel doesn't exist");
      return;
    }

    if (!channel.isVoice()) {
      client.send(message, "😵 The channel is not a voice channel");
      return;
    }

    client.db.set("joinvc", channel.id);

    client.send(message, {
      content: `✅ Voice channel set to **${channel.name}**`,
    });

    client.voice.joinChannel(channel.id, {
      selfDeaf: true,
      selfMute: true,
      selfVideo: true,
    });
  },
};
