import type { SelfCommandType } from "../../../../types/self_commands.d.ts";

export const command: SelfCommandType = {
    name: 'tokeninfo',
    description: 'get token info',
    category: "utils",
    callback: async (client, message, args: string[]) => {
        var token = args[0];
        if (!token) return client.send(message, `\`\`\`ini
        [ Token Information - KisakaySelf ]
       
        Invalid token\`\`\``)
        var tokeninfo = await fetch('https://discord.com/api/v8/users/@me', {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        }).then(res => res.json())
        client.send(message, `\`\`\`ini
[ Token Information - HephaistosSB ]

[ User Information ]
- Username: ${tokeninfo.username}#${tokeninfo.discriminator}
- ID: ${tokeninfo.id}
- Email: ${tokeninfo.email}
- Phone: ${tokeninfo.phone}
- Verified: ${tokeninfo.verified}
- MFA: ${tokeninfo.mfa_enabled}
- Flags: ${tokeninfo.flags}
- Locale: ${tokeninfo.locale}
- NSFW: ${tokeninfo.nsfw_allowed}\`\`\``)
    }
}