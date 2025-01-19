import type { Message } from "discord.js-selfbot-v13";
import type { Self } from "../src/self/self";

export interface SelfCommandType {
    name: string;
    description: string;

    options?: Option[];
    async callback(client: Self, message: Message, args: string[]),
    category: string;
    aliases?: string[];
}

export interface Option {
    name: string;
    description: string;
    type: number;
    required: boolean;
}

export enum OptionType {
    STRING = 1,
    INTEGER = 2,
    BOOLEAN = 3,
    USER = 4,
    CHANNEL = 5,
    ROLE = 6
}
