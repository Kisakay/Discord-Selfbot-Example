import type { SelfEventType } from "../../../types/self_event";
import type { Self } from "../self";

export const event: SelfEventType = {
    once: true,
    name: 'ready',
    callback: (client: Self) => {
        client.logger.log(`Logged in as ${client.user!.tag}`);
    }
}