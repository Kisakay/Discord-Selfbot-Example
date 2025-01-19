import type { Self } from "../self";

export function createBroadcast(client: Self) {
  // create a group dm
  client.channels.createGroupDM([]).then(async (group) => {
    await group.setName("KisakaySelf");
    await group.setIcon(client.user!.avatarURL({ dynamic: false, size: 4096 }));
    await group
      .send(
        `\`\`\`ini
[ Panel - KisakaySelf ]

* Welcome to KisakaySelf broadcast panel.
* When a specific event occurs, KisakaySelf will send a message to this group.
* You can use this panel to see the broadcasted messages.
\`\`\``,
      )
      .then(async (msg) => {
        await msg.pin();
        await msg.markUnread();
      });
    client.db.set("broadcast", group.id);
  });
}
