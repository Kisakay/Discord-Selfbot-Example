import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
  name: "stalk",
  description: "Add an user to the stalk list",
  category: "info",
  async callback(client, message, args) {
    let user =
      message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user && args[0]) {
      try {
        user = await client.users.fetch(args[0]);
      } catch (error) {
        client.send(message, "> ❌ **User not found or invalid ID**");
        return;
      }
    }

    if (!user || !user === null) {
      client.send(
        message,
        "> ❌ **You need to mention a user or provide an ID**",
      );
      return;
    }

    if ((await client.db.get("stalk"))?.[user.id]) {
      await client.db.delete(`stalk.${user.id}`);
      client.send(
        message,
        `> ⚡ **${user.tag}** has been removed from the stalk list`,
      );
      return;
    }

    client.send(
      message,
      `> ⚡ **${user.tag}** has been added to the stalk list`,
    );
    await client.db.set(`stalk.${user.id}`, true);
  },
};
