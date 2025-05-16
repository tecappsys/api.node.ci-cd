import { Router } from 'express';
import { VerifyGitHook } from '../../middlewares/git-hook-ci-cd/verifyGitHook';
import { UpdateNodeMain, UpdateRepos, UpdateLibAngular } from '../../controllers/git-hook-ci-cd/Controller';

const routes = Router();

routes.post('/app',VerifyGitHook,UpdateRepos);
routes.post('/node-main',VerifyGitHook,UpdateNodeMain);
routes.post('/lib-angular',VerifyGitHook,UpdateLibAngular);

export default routes;