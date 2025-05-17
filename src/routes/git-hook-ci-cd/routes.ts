import { Router } from 'express';
import { VerifyGitHook } from '../../middlewares/git-hook-ci-cd/verifyGitHook';
import { UpdateMain, UpdateRepos, UpdateLibAngular } from '../../controllers/git-hook-ci-cd/Controller';

const routes = Router();

routes.post('/app',VerifyGitHook,UpdateRepos);
routes.post('/main',VerifyGitHook,UpdateMain);
routes.post('/lib-angular',VerifyGitHook,UpdateLibAngular);

export default routes;