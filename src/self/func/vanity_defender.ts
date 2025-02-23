import { logger } from "ihorizon-tools";
import type { Self } from "../self";
import { TOTP } from "discord.js-selfbot-v13-kisakay-patch";

export async function vanity_defender(client: Self) {
    try {
        if (client.options.TOTPKey) {
            let locks = await client.db.get("lockvanity");
            if (!locks || Object.entries(locks).length === 0) return;

            for (let [id, code] of Object.entries(locks)) {
                const getTicket = await fetch(`https://discord.com/api/v9/guilds/${id}/vanity-url`, {
                    method: "PATCH",
                    headers: {
                        "Authorization": client.token!,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                });

                const ticketResponse = await getTicket.json();

                if (ticketResponse.code === 60003) {
                    const { otp } = await TOTP.generate(client.options.TOTPKey);

                    const getMfa = await (client as any).api.mfa.finish.post({
                        data: {
                            ticket: ticketResponse.mfa.ticket,
                            data: otp,
                            mfa_type: 'totp',
                        },
                    })

                    client.mfaToken = getMfa.token;

                    logger.log(`[VanityDefender] MFA Token refreshed. (${(getMfa.token as string).substring(0, 20)}-------------XXXX)`.green);
                } else {
                    console.log("Failed to get ticket:", ticketResponse);
                }
            }
        }
    } catch (error) {
        console.error("API ERROR\nFailed to refresh MFA token:", error);
    }
}