import { sleep } from "bun";
import type {
  DMChannel,
  PartialDMChannel,
  GroupDMChannel,
  NewsChannel,
  StageChannel,
  TextChannel,
  ThreadChannel,
  VoiceChannel,
  Collection,
  Snowflake,
  Message
} from "discord.js-selfbot-v13";
import type { SelfCommandType } from "../../../../types/self_commands";
import { logger } from "ihorizon-tools";


/*
 This function was take (and modified for this project) from:
 https://github.com/1Tsubasa/Discord-Clear-DM/blob/main/index.js

 MIT License
*/
async function deleteMessages(channel: DMChannel | PartialDMChannel | GroupDMChannel | NewsChannel | StageChannel | TextChannel | ThreadChannel | VoiceChannel) {
  let fetched: Collection<Snowflake, Message>;
  let messagesToDelete: Collection<string, Message<boolean>>;

  do {
    fetched = await channel.messages.fetch({ limit: 100 });
    messagesToDelete = fetched.filter(m =>
      (m.author.id === channel.client.user!.id)
      &&
      (!m.system)
    );

    let messageCount = 0;
    for (const message of messagesToDelete.values()) {
      await sleep(1000);
      await message.delete()
        .then(() => {
          messageCount++;
          logger.log(`[${channel.id}] Deleted Message : ${message.id} - [${messageCount}/${messagesToDelete.size}]`);
        })
        .catch(e => console.error('Error deleting message', e.message));
    }
  }
  while (messagesToDelete.size >= 1);
}

export const command: SelfCommandType = {
  name: "clean",
  description: "Clear all messages in a channel",
  category: "utils",
  callback: (client, message, args) => {
    client.send(message, {
      content: "200",
    }, 400);
    deleteMessages(message.channel);
  },
};
