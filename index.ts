import { Self } from "./src/self/self";

const client = new Self();

process.on("uncaughtException", (err) => {
    client.logger.err(err.message);
});

process.on("unhandledRejection", (err) => {
    client.logger.err(err as any);
});