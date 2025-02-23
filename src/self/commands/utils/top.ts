import type { SelfCommandType } from "../../../../types/self_commands";

export const command: SelfCommandType = {
  name: "top",
  description: "Get the link of the first message in the channel",
  category: "utils",
  async callback(client, message, args) {
    let channel = message.channel;
    channel.messages.fetch({ after: "0", limit: 1 }).then((messages) => {
      let firstMessage = messages.first();
      let link = "";
      if (channel.type === "GUILD_TEXT") {
        link = `https://discord.com/channels/${message.guild?.id}/${channel.id}`;
      } else if (channel.type === "DM" || channel.type === "GROUP_DM") {
        link = `https://discord.com/channels/@me/${channel.id}`;
      }

      if (firstMessage) {
        client.send(
          message,
          `The first message in this channel is [here](${link}/${firstMessage.id})`,
        );
      } else {
        client.send(message, "No messages found in this channel");
      }
    });
  },
};
