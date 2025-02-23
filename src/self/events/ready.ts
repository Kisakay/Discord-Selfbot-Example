import type { SelfEventType } from "../../../types/self_event";
import type { Self } from "../self";
import { updatePresenceLoop } from "../func/ihorizon_owner_status";

export const event: SelfEventType = {
  once: true,
  name: "ready",
  async callback(client: Self) {
    client.logger.log(`Logged in as ${client.user!.tag}`);
    client.logger.legacy(
      `    __ __ _            __              _          _____      ________          __
   / //_/(_)________ _/ /______ ___  _( )_____   / ___/___  / / __/ /_  ____  / /_
  / ,<  / / ___/ __ \`/ //_/ __ \`/ / / /// ___/   \\__ \\/ _ \\/ / /_/ __ \\/ __ \\/ __/
 / /| |/ (__  ) /_/ / ,< / /_/ / /_/ / (__  )   ___/ /  __/ / __/ /_/ / /_/ / /_
/_/ |_/_/____/\\__,_/_/|_|\\__,_/\\__, / /____/   /____/\\___/_/_/ /_.___/\\____/\\__/
                              /____/                                              `
        .red,
    );
    client.logger.log(`Prefix: ${client.prefix()}`);

    await updatePresenceLoop(client);

    let joinvc = await client.db.get("joinvc");

    if (joinvc) {
      let channel = client.channels.cache.get(joinvc);
      if (channel) {
        let vc = (await client.voice.joinChannel(channel.id, {
          selfDeaf: true,
          selfMute: true,
          selfVideo: true,
          videoCodec: "H264",
        }));
        vc.createStreamConnection();
      }
    }
  },
};
