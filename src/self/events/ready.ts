import type { SelfEventType } from "../../../types/self_event";
import type { Self } from "../self";

export const event: SelfEventType = {
    once: true,
    name: 'ready',
    callback: (client: Self) => {
        client.logger.log(`Logged in as ${client.user!.tag}`);
        client.logger.legacy(
            `    __ __ _            __              _          _____      ________          __ 
   / //_/(_)________ _/ /______ ___  _( )_____   / ___/___  / / __/ /_  ____  / /_
  / ,<  / / ___/ __ \`/ //_/ __ \`/ / / /// ___/   \\__ \\/ _ \\/ / /_/ __ \\/ __ \\/ __/
 / /| |/ (__  ) /_/ / ,< / /_/ / /_/ / (__  )   ___/ /  __/ / __/ /_/ / /_/ / /_  
/_/ |_/_/____/\\__,_/_/|_|\\__,_/\\__, / /____/   /____/\\___/_/_/ /_.___/\\____/\\__/  
                              /____/                                              `.red);
        client.logger.log(`Prefix: ${client.prefix}`);
    }
}