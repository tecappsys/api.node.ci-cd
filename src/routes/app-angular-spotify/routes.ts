import { Router } from 'express';
import { SpotifyToken } from '../../controllers/app-angular-spotify.ts/Controller';

const routes = Router();

routes.get('/token',SpotifyToken);


export default routes;