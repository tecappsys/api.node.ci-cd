import express, { Application } from 'express';
import expressConfig from '../config/expressConfig';

class Server {

    private app: Application;
    private port: number;
    private internalIp:string

    constructor() {
        this.app  = express();
        this.port = parseInt(process.env.PORT);     
        this.internalIp = process.env.INTERNAL_IP  
        this.middlewares();
        const expressApp = new expressConfig(this.app);
        expressApp;
    }

    middlewares() {
        this.app.use(express.json());
    }

    listen() {
        this.app.listen( this.port, this.internalIp, () => {
            console.log(`SERVIDOR CORRIENDO EN PUERTO ${this.port}`);
        })
    }

}

export default Server;