import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Logger } from '../utils/logger';
import Routes from '../routes/routes';

class App {

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

        this.express.get('/actuator', (req, res) => {
            res.send("App Works!");
        });
        
        this.express.use('/', Routes);

        this.express.use('*', (req, res, next) => { 
            res.send("Make sure the URL is correct!"); 
        });
    }
}

export default new App().express;