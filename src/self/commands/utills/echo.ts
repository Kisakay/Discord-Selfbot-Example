import type { Message } from "discord.js-selfbot-v13";
import type { Self } from "../../self";
import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
    name: 'echo',
    description: 'Repeats the input',
    callback: (client: Self, message: Message, args: string[]) => {
        message.edit(args.join(" "));
    }
}