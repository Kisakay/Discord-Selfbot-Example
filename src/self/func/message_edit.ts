import { sleep } from "bun";
import type { Message, MessageEditOptions, ReplyMessageOptions } from "discord.js-selfbot-v13";


export function messageEdit(message: Message, body: string | MessageEditOptions) {
    message.edit(body)
        .then(async x => {
            await sleep(15_000);
            if (x.deletable) x.delete();
        })
        .catch(() => false)
}

export function messageSend(message: Message, body: string | ReplyMessageOptions) {
    message.reply(body)
        .then(async x => {
            await sleep(15_000);
            if (x.deletable) x.delete();
        })
        .catch(() => false)
}