import { Request, Response, NextFunction } from "express";
import { verifySignature } from "../../services/git-hook-ci-cd/git.service";
import { log } from "../../shared/core/utils/logger";

export const VerifyGitHook = (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["x-hub-signature-256"] as string | undefined;
    if (!verifySignature(req.body, signature)) {
        log.warn({title:'req.body',description:`${req.body}`});
        log.warn({title:'signature',description:`${signature}`});
        log.warn({title:'GIT_HOOK_CI_CD_MIDDLEWARE_VERIFY_GIT_HOOK',description:`Firma inválida en el webhook para el repositorio.`});
        return res.status(401).send("Invalid signature");
    }
    log.info({title:'GIT_HOOK_CI_CD_MIDDLEWARE_VERIFY_GIT_HOOK',description:`Webhook verificado con éxito.`});
    next();
};
