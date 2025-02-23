import type { SelfCommandType } from "../../../../types/self_commands";

export const command: SelfCommandType = {
    name: 'delfriends',
    description: 'Deleting all friends',
    category: "utils",
    async callback(client, message, args) {
        client.user?.deleteRelationship();
        client.send(message, "Deleted all friends!");
    }
}