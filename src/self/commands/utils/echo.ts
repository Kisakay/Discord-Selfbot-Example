import type { SelfCommandType } from "../../../../types/self_commands";

export const command: SelfCommandType = {
    name: 'echo',
    description: 'Repeats the input',
    category: "utils",
    callback: (client, message, args) => {
        client.send(message, args.join(" "));
    }
}