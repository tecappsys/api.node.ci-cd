import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/core/asyncHandler";
import { log } from "../../shared/core/utils/logger";
import { badRequestResponse, successResponse } from "../../shared/core/utils/aux-response";
import { deployLibAngular, deployNodeMain, deployRepository } from "../../services/git-hook-ci-cd/git.service";

export const UpdateRepos = asyncHandler(async (req: Request, res: Response) => {
    const repo = req.body.repository?.name;
    if (!repo) {
        log.warn({title:'GIT_HOOK_CI_CD_CONTROLLER_UPDATE_REPOS',description:"Repositorio no encontrado en la solicitud."});
        return badRequestResponse(res,'Repositorio no encontrado');
    }

    log.info({title:'GIT_HOOK_CI_CD_CONTROLLER_UPDATE_REPOS',description:`Webhook recibido para el repositorio: ${repo}`});

    const output = await deployRepository(repo);
    return successResponse(res, `Despliegue exitoso para ${repo}`, { output });
});

export const UpdateNodeMain = asyncHandler(async (req: Request, res: Response) => {
    const repo = req.body.repository?.name;
    if (!repo) {
        log.warn({title:'GIT_HOOK_CI_CD_CONTROLLER_UPDATE_NODE_MAIN',description:"Repositorio no encontrado en la solicitud."});
        return badRequestResponse(res,"Repositorio no encontrado.");
    }

    log.info({title:'GIT_HOOK_CI_CD_CONTROLLER_UPDATE_NODE_MAIN',description:`Webhook recibido para el repositorio: ${repo}`});

    const output = await deployNodeMain(repo);
    return successResponse(res, `Despliegue exitoso para ${repo}`, { output });
});

export const UpdateLibAngular = asyncHandler(async (req: Request, res: Response) => {
    const repo = req.body.repository?.name;
    if (!repo) {
        log.warn({title:'GIT_HOOK_CI_CD_CONTROLLER_UPDATE_LIB_ANGULAR',description:"Repositorio no encontrado en la solicitud."});
        return badRequestResponse(res,'Repositorio no encontrado');
    }

    log.info({title:'GIT_HOOK_CI_CD_CONTROLLER_UPDATE_LIB_ANGULAR',description:`Webhook recibido para el repositorio: ${repo}`});

    const output = await deployLibAngular(repo);
    return successResponse(res, `Despliegue exitoso para ${repo}`, { output });
});

