import { axios } from "ihorizon-tools";
import type { SelfCommandType } from "../../../../types/self_commands.d.ts";
import { MessageAttachment } from "discord.js-selfbot-v13";

export const command: SelfCommandType = {
  name: "thigh",
  description: "Show a thigh image",
  category: "nsfw",
  callback: async (client, message, args) => {
    try {
      const apiResponse = await axios.get(
        "https://nekobot.xyz/api/image?type=thigh",
      );
      if (!apiResponse.data || !apiResponse.data.message) {
        return client.send(
          message,
          "Failed to retrieve an image. Please try again later.",
        );
      }

      const imageResponse = await axios.get(apiResponse.data.message, {
        responseType: "arrayBuffer",
      });

      const attachment = new MessageAttachment(
        Buffer.from(imageResponse.data),
        "thigh.png",
      );

      client.send(message, {
        content: null,
        files: [attachment],
      });
    } catch (error) {
      return client.send(
        message,
        "An error occurred while fetching the image. Please try again later.",
      );
    }
  },
};
