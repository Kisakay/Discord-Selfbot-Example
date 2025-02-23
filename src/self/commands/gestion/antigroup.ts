import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
    name: 'antigroup',
    description: 'Toggles the antigroup function',
    category: "gestion",
    async callback(client, message, args) {
        let states = await client.db.get("antigroup");

        await client.db.set("antigroup", !states);

        client.send(message, {
            content: `Antigroup is now ${!states ? "enabled" : "disabled"}`
        })
    }
}