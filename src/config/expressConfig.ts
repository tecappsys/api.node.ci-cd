import express, { Application } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { errorHandler } from '../middlewares/core/errorHandler';

import APP_ANGULAR_SPOTIFY_ROUTES  from '../routes/app-angular-spotify/routes';
import GIT_HOOK_CI_CD_ROUTES from '../routes/git-hook/routes';

class expressConfig{
    constructor(server:Application){
        const app = server;

        // ✔ SI usas Express detrás de un proxy inverso (NGINX, Heroku, AWS, Cloudflare).
        app.set('trust proxy', 1);

        // Limiter to all requests
        app.use(
            rateLimit({
                windowMs: 15 * 60 * 1000, // 15 minutes
                max: 100 // limit each IP to 100 requests per windowMs
            })
        );
    
        // ✔ Elimina el encabezado X-Powered-By: Express
        app.disable('x-powered-by');

        // CORS
        app.use( cors() );

        // Sin esto, req.body sería undefined en solicitudes con Content-Type: application/json
        app.use( express.json() );

        // ROUTES
        app.use('/app-angular-spotify', APP_ANGULAR_SPOTIFY_ROUTES);
        app.use('/git-hook', GIT_HOOK_CI_CD_ROUTES);

        // Middleware global de manejo de errores
        app.use(errorHandler); 
    }
}

export default expressConfig;