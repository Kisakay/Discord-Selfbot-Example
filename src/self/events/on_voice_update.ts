import type { Message, VoiceState } from "discord.js-selfbot-v13";
import type { Self } from "../self";
import type { SelfEventType } from "../../../types/self_event.d.ts";

export const event: SelfEventType = {
  name: "voiceStateUpdate",
  once: false,
  callback: (client: Self, oldVoice: VoiceState, newVoice: VoiceState) => {
    if (client.db.get(`stalk.${newVoice.member?.id}`)) {
      if (newVoice.channel) {
        client.broadcast(
          `${newVoice.member?.toString()} joined voice channel ${newVoice.channel.toString()}`,
        );
      } else {
        client.broadcast(
          `${newVoice.member?.toString()} left voice channel ${oldVoice.channel?.toString()}`,
        );
      }
    }
  },
};
