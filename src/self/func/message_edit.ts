import { sleep } from "bun";
import type { Channel, DMChannel, GroupDMChannel, Message, MessageEditOptions, NewsChannel, PartialDMChannel, ReplyMessageOptions, StageChannel, TextChannel, ThreadChannel, VoiceChannel } from "discord.js-selfbot-v13";

let max = 15_000;

export async function messageEdit(message: Message, body: string | MessageEditOptions, timeout?: number): Promise<Message | undefined> {
    try {
        const editedMessage = await message.edit(body);

        setTimeout(() => {
            if (editedMessage.deletable) editedMessage.delete().catch(() => { });
        }, timeout || max);

        return editedMessage;
    } catch (error) {
        return undefined;
    }
}

export async function messageSend(channel: DMChannel | PartialDMChannel | GroupDMChannel | NewsChannel | StageChannel | TextChannel | ThreadChannel | VoiceChannel, body: string | ReplyMessageOptions, timeout?: number): Promise<Message | undefined> {
    try {
        const sentMessage = await channel.send(body);

        setTimeout(() => {
            if (sentMessage.deletable) sentMessage.delete().catch(() => { });
        }, timeout || max);

        return sentMessage;
    } catch (error) {
        return undefined;
    }
}