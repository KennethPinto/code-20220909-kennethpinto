import * as http from "http";
import App from './src/middleware/middleware';
import { Logger } from "./src/utils/logger";

const port = 3000;

App.set("port", port);
const server = http.createServer(App);
server.listen(port);

const logger = new Logger();

server.on('listening', function(): void {
    const addr = server.address();
    const bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`Running server on port: ${bind}`);
 });

module.exports = App;