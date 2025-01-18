import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
    name: 'delfriends',
    description: 'Deleting all friends',
    category: "utils",
    callback: (client, message, args) => {
        client.user?.deleteRelationship();
        message.edit("Deleted all friends!");
    }
}