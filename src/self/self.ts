import { Client } from "discord.js-selfbot-v13";
import type { ConfigType } from "../../types/config";
import { readdir } from "fs/promises";
import { join } from "path";
import type { SelfCommandType } from "../../types/self_commands";
import { TOML } from "bun";
import { logger } from "ihorizon-tools";
import { readFileSync } from "fs";
import { SteganoDB } from "stegano.db";

export class Self extends Client {
    config: ConfigType | null = null;
    commands: Map<string, SelfCommandType> = new Map();
    logger: typeof logger;
    db = new SteganoDB({ driver: "json", filePath: "./db.json" });

    constructor() {
        super();

        this.config = (TOML.parse(readFileSync(process.cwd() + "/config.toml", "utf-8")) as ConfigType);

        this.logger = logger;

        this.run();
        this.start();
    }

    async start() {
        await this.login(this.config?.user_token);
    }

    async loadEvents() {
        const files = await readdir(join(__dirname, "events"));
        let i = 0;
        for (const file of files) {
            const { event } = await import(`./events/${file}`);
            if (event.once) {
                this.once(event.name, event.callback.bind(null, this)); i++;
            } else {
                this.on(event.name, event.callback.bind(null, this)); i++;
            }
        }

        this.logger.log(`Loaded ${i} events`);
    }

    async loadCommands() {
        const dir = await readdir(join(__dirname, "commands"));

        for (const category of dir) {
            const files = await readdir(join(__dirname, "commands", category));
            for (const file of files) {
                const { command } = await import(`./commands/${category}/${file}`);
                this.commands.set(command.name, command);
            }
        }

        this.logger.log(`Loaded ${this.commands.size} commands`);
    }

    async load() {
        await this.loadEvents();
        await this.loadCommands();
    }

    async run() {
        await this.load();
        await this.start();
    }

    async stop() {
        this.destroy();
    }
}