import { iHorizonTimeCalculator } from "ihorizon-tools";
import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

const timeParser = new iHorizonTimeCalculator();

export const command: SelfCommandType = {
    name: "timer",
    description: "Create a timer",
    category: "utils",
    callback: (client, message, args) => {
        if (!args[0]) {
            client.send(message, {
                content: "Please provide a time!",
            });
            return;
        }

        let amount = timeParser.to_ms(args[0])!;

        if (isNaN(amount)) {
            client.send(message, {
                content: "Please provide a valid time for the timer!",
            });
            return;
        }

        client.send(message, {
            content: `Timer set for ${args[0]}`,
        });

        setTimeout(() => {
            client.send2(message.channel, {
                content: `Timer ended for ${args[0]}\n**Reminder:** ${args.slice(1).join(" ")}`,
            }).then(msg => {
                msg?.markUnread();
            })
        
        }, amount);
        
    },
};
