import type { Client } from "discord.js-selfbot-v13-kisakay-patch";

export interface SelfEventType {
    once: boolean;
    name: string;
    async callback(client: Client, args1: any, args2: any): Promise<any>;
}