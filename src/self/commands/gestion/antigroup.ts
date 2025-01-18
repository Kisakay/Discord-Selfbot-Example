import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
    name: 'antigroup',
    description: 'Toggle the antigroup function',
    category: "gestion",
    callback: (client, message, args) => {
        let states = client.db.get("antigroup");
        
        client.db.set("antigroup", !states);

        message.edit({
            content: `Antigroup is now ${!states ? "enable" : "disable"}`
        })
    }
}