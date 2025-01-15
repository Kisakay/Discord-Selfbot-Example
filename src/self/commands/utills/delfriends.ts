import type { Message } from "discord.js-selfbot-v13";
import type { Self } from "../../self";
import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
    name: 'delfriends',
    description: 'Deleting all friends',
    callback: (client: Self, message: Message, args: string[]) => {
        client.user?.deleteRelationship();
        message.edit("Deleted all friends!");
    }
}