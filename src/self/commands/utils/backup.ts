import type { SelfCommandType } from "../../../../types/self_commands";

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { sleep } from "bun";
import { time } from "discord.js";

interface friend {
  since: Date;
  nickname: string | null;
  note: string | null;
}

interface server {
  name: string;
  vanityUrl: string | null;
  since: Date;
  customInviteCode: string | null;
}

const FRIENDS_BACKUP_FOLDER = path.join(process.cwd(), "backups", "friends");
const GUILDS_BACKUP_FOLDER = path.join(process.cwd(), "backups", "servers");

export const command: SelfCommandType = {
  name: "backup",
  description: "Create a backup of your account",
  category: "utils",
  callback: async (client, message, args) => {
    let option = args[0];

    // console.log(client.relationships.)

    if (!option) {
      return client.send(message, {
        content: `Command malformed 😵\n${client.prefix()}${command.name} **[friend/server/list]**`,
      });
    }

    if (option.includes("friend")) {
      let bodyAllFriends: Record<string, friend> = {};
      let fileName = Date.now() + ".json";
      let filePath = path.join(FRIENDS_BACKUP_FOLDER, fileName);

      for (let friend01 of client.relationships.friendCache.values()) {
        if (!friend01 || !friend01.id) continue;
        bodyAllFriends[friend01.id] = {
          since: client.relationships.sinceCache.get(friend01.id) || new Date(),
          nickname:
            client.relationships.friendNicknames.get(friend01.id) || null,
          note: null,
        };
      }
      mkdirSync(FRIENDS_BACKUP_FOLDER, { recursive: true });
      writeFileSync(filePath, JSON.stringify(bodyAllFriends, null, 2), "utf-8");

      client.send(message, {
        content: `✅ Saved **${Object.entries(bodyAllFriends).length}** friends in the file: **\`${filePath}\`** !`,
      });
    } else if (option.includes("server")) {
      let bodyAllGuilds: Record<string, server> = {};
      let fileName = Date.now() + ".json";
      let filePath = path.join(GUILDS_BACKUP_FOLDER, fileName);

      for (let guild01 of client.guilds.cache.values()) {
        if (!guild01 || !guild01.id) continue;

        let availableChannel = guild01.channels.cache
          .filter((x) => x.type === "GUILD_TEXT")
          .first();
        let customInviteCode: string | null = null;

        if (availableChannel) {
          try {
            client.logger.log(
              "[Backup] Create guild invite for " + guild01.name,
            );
            let invite = await guild01.invites.create(availableChannel, {
              maxAge: 0,
            });

            customInviteCode = invite.code;
          } catch { }
        }

        bodyAllGuilds[guild01.id] = {
          name: guild01.name,
          since: new Date(),
          vanityUrl: guild01.vanityURLCode,
          customInviteCode,
        };

        await sleep(1900);
      }

      mkdirSync(GUILDS_BACKUP_FOLDER, { recursive: true });
      writeFileSync(filePath, JSON.stringify(bodyAllGuilds, null, 2), "utf-8");

      client.send(message, {
        content: `✅ Saved **${Object.entries(bodyAllGuilds).length}** servers in the file: **\`${filePath}\`** !`,
      });
    } else if (option.includes("list")) {
      let resultMessage = "";

      let friends_file = readdirSync(FRIENDS_BACKUP_FOLDER).filter((file) => file.endsWith(".json"));
      let guilds_file = readdirSync(GUILDS_BACKUP_FOLDER).filter((file) => file.endsWith(".json"));

      for (let file of friends_file) {
        // Load the files
        let data = JSON.parse(
          readFileSync(path.join(FRIENDS_BACKUP_FOLDER, file), "utf-8"),
        );

        const friendCount = data ? Object.keys(data || {}).length : 0;

        resultMessage += `・ 👫 **${file}**
  ┖  (${friendCount} friends)
  ┖  ${time(new Date(Number(file.split(".")[0])), "R")}
`;
      }

      for (let file of guilds_file) {
        // Load the files
        let data = JSON.parse(
          readFileSync(path.join(GUILDS_BACKUP_FOLDER, file), "utf-8"),
        );

        const guildCount = data ? Object.keys(data || {}).length : 0;

        resultMessage += `・ 🏰 **${file}**
  ┖  (${guildCount} servers)
  ┖  ${time(new Date(Number(file.split(".")[0])), "R")} 
`;
      }


      client.send(message, {
        content: `**List of backups :**\n\n${resultMessage}`,
      });
    } else {
      client.send(message, {
        content: `Command malformed 😵\n${client.prefix()}${command.name} **[friend/server/list]**`,
      }, 30_000);
    }
  },
};
