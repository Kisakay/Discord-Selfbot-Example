import type { RateLimitData } from "discord.js-selfbot-v13-kisakay-patch";
import type { Self } from "../self";
import type { SelfEventType } from "../../../types/self_event.d.ts";

export const event: SelfEventType = {
    name: "rateLimit",
    once: false,
    async callback(client: Self, rateLimitInfo: RateLimitData) {
        client.logger.warn(` Rate Limit !`.red + `
Timeout: ${rateLimitInfo.timeout}
Limit: ${rateLimitInfo.limit}
Route: ${rateLimitInfo.route}
Method: ${rateLimitInfo.method}
Path: ${rateLimitInfo.path}
Global: ${rateLimitInfo.global}`)
    },
};
