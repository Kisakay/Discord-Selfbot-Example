import { Client } from "discord.js-selfbot-v13-kisakay-patch";
import type { ConfigType } from "../../types/config";
import { readdir } from "fs/promises";
import { join } from "path";
import type { SelfCommandType } from "../../types/self_commands";
import { TOML } from "bun";
import { logger } from "ihorizon-tools";
import { existsSync, readFileSync } from "fs";
import { messageEdit, messageSend } from "./func/message_edit";
import { createBroadcast } from "./func/broadcast_message";
import { JSONDriver, QuickDB } from "quick.db";

export class Self extends Client {
  config: ConfigType | null = null;
  commands: Map<string, SelfCommandType> = new Map();
  aliases: Map<string, string> = new Map();
  mfaToken: Record<string, string> = {};

  logger: typeof logger;
  db = new QuickDB({ driver: new JSONDriver(), filePath: "./db.json" });
  send = messageEdit;
  send2 = messageSend;

  constructor() {
    super({
      TOTPKey: process.env.TOTPKEY?.split(" ").join("").replace(/\s+/g, "").toUpperCase() || "",
    });
    let path = process.cwd() + "/config.toml";

    if (!existsSync(path)) {
      logger.err("Config file not found.");
      logger.err("Please create a config.toml file in the root directory.");
      process.exit(1);
    }

    this.config = TOML.parse(
      readFileSync(process.cwd() + "/config.toml", "utf-8"),
    ) as ConfigType;

    this.logger = logger;
    this.run();
  }

  private async start() {
    await this.login(this.config?.user_token).catch((err) => {
      console.clear();
      this.logger.err(err);
      this.logger.legacy(`
INVALID TOKEN
Please check your token in the config.toml file.

To get discord account token:

1- Open Discord in your browser. (login if you are not)
2- Press F12 to open Developer Tools.
3- Go to the console tab.
4- Type "allow pasting" and press enter.
5- Paste this code and press enter:
`.red
        +
        `(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`.gray
        +
        `  
6- You will see your token in the console.
7- Copy and paste it in the config.toml file.`.red);
    })
  }

  public async broadcast(msg: string) {
    let broadcast = await this.db.get("broadcast");
    let broadcastChannel = this.channels.cache.get(broadcast);

    if (
      !broadcast ||
      !broadcastChannel ||
      broadcastChannel.type !== "GROUP_DM"
    ) {
      await createBroadcast(this);
    }

    let channel = await this.channels.fetch(await this.db.get("broadcast") || "");

    if (channel?.type === "GROUP_DM") {
      channel.send(msg).then((msg) => {
        msg.markUnread();
      });
    }
  }

  public async prefix() {
    return await this.db.get("prefix") || this.config!.selfbot_prefix;
  }

  private async loadEvents() {
    const files = await readdir(join(__dirname, "events"));
    let i = 0;
    for (const file of files) {
      const { event } = await import(`./events/${file}`);
      if (event.once) {
        this.once(event.name, event.callback.bind(null, this));
        i++;
      } else {
        this.on(event.name, event.callback.bind(null, this));
        i++;
      }
    }

    this.logger.log(`Loaded ${i} events`);
  }

  private async loadCommands() {
    const dir = await readdir(join(__dirname, "commands"));

    for (const category of dir) {
      const files = await readdir(join(__dirname, "commands", category));
      for (const file of files) {
        const { command } = (await import(
          `./commands/${category}/${file}`
        )) as { command: SelfCommandType };

        if (!command) continue;

        this.commands.set(command.name, command);

        if (command.aliases) {
          command.aliases.forEach((alias) => {
            this.aliases.set(alias, command.name);
          });
        }
      }
    }

    this.logger.log(`Loaded ${this.commands.size} commands`);
  }

  private async loadWsEvents() {
    const files = await readdir(join(__dirname, "ws_events"));
    let i = 0;
    for (const file of files) {
      const { event } = await import(`./ws_events/${file}`);
      this.ws.on(event.name, event.callback.bind(null, this));
      i++;
    }

    this.logger.log(`Loaded ${i} ws events`);
  }

  private async load() {
    await this.loadEvents();
    await this.loadCommands();
    await this.loadWsEvents();
  }

  private async run() {
    await this.load();
    await this.start();
  }

  public async stop() {
    this.destroy();
  }
}
