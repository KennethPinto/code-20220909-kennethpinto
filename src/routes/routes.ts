import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Logger } from '../utils/logger';
import BMIRoute from './bmiroutes';

class Routes {

    public express: express.Application;
    public logger: Logger;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.logger = new Logger();
    }

    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        this.express.use('/', BMIRoute);
    }
}

export default new Routes().express;