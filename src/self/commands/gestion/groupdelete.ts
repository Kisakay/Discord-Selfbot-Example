import type { GroupDMChannel } from "discord.js-selfbot-v13-kisakay-patch";
import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "groupdelete",
  description: "Remove all members from the group",
  category: "gestion",
  aliases: ["gd"],
  callback: async (client, message, args) => {
    // check if the message is in a group
    if (message.channel.type === "GROUP_DM") {
      // check if the user is the owner of the group
      if ((message.channel as GroupDMChannel).ownerId !== client.user!.id) {
        return client.send(message, "You are not the owner of the group");
      }

      // get all the users in the group
      let users = message.channel.recipients.values();
      // remove all the users from the group
      for (let user of users) {
        if (user.id !== client.user!.id) {
          (message.channel as GroupDMChannel).removeUser(user);
        }
      }

      // send a message to confirm that all users have been removed from the group
      client.send(message, "✅ All users have been removed from the group");
    } else {
      // if the message is not in a group, send an error message
      client.send(message, "This command can only be used in a group");
    }
  },
};
