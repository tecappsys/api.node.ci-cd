import crypto from "crypto";
import { exec } from "child_process";
import util from "util";
import path from "path";
import { log } from "../../shared/core/utils/logger";

const execPromise = util.promisify(exec);
const GIT_HOOK_SECRET = process.env.GIT_HOOK_SECRET!;
const REPO_SCRIPTS_PATH = path.join(__dirname, "../../../../scripts/");

/**
 * Verifica la firma del GitHub Hook
 */
export const verifySignature = (body: any, signature: string | undefined): boolean => {
    if (!signature) return false;
    
    const computedSig = `sha256=${crypto
        .createHmac("sha256", GIT_HOOK_SECRET)
        .update(JSON.stringify(body))
        .digest("hex")}`;
    log.warn({title:'computedSig',description:`${computedSig}`});
    log.warn({title:'signature',description:`${signature}`});
    return signature === computedSig;
};

/**
 * Ejecuta el script de despliegue de un repositorio
 */
export const deployRepository = async (repo: string): Promise<string> => {
    const deployCommand = `${REPO_SCRIPTS_PATH}repoToWebSite.sh ${repo} ${process.env[repo]} ${process.env.REPOS_PATH + repo} ${process.env.NODE_LOG_FILE}`;

    try {
        log.info({title:'GIT_HOOK_CI_CD_SERVICE_DEPLOY_REPOSITORY',description:`Iniciando despliegue para ${repo}...`});
        const { stdout } = await execPromise(deployCommand);
        log.info({title:'GIT_HOOK_CI_CD_SERVICE_DEPLOY_REPOSITORY',description:`Despliegue exitoso para ${repo}: ${stdout}`});
        return stdout;
    } catch (error: any) {
        log.error({title:'GIT_HOOK_CI_CD_SERVICE_DEPLOY_REPOSITORY',description:`Error en despliegue de ${repo}: ${error.message}`});
        throw new Error("Error durante el despliegue.");
    }
};

/**
 * Ejecuta el script de despliegue del repositorio Node Main
 */
export const deployMain = async (repo: string): Promise<string> => {
    const deployCommand = `${REPO_SCRIPTS_PATH}restartServer.sh ${repo} ${process.env[repo]} ${process.env.NODE_LOG_FILE}`;

    try {
        log.info({title:'GIT_HOOK_CI_CD_SERVICE_DEPLOY_NODE_MAIN',description:`Iniciando despliegue para ${repo}...`});
        const { stdout } = await execPromise(deployCommand);
        log.info({title:'GIT_HOOK_CI_CD_SERVICE_DEPLOY_NODE_MAIN',description:`Despliegue exitoso para ${repo}: ${stdout}`});
        return stdout;
    } catch (error: any) {
        log.error({title:'GIT_HOOK_CI_CD_SERVICE_DEPLOY_NODE_MAIN',description:`Error en despliegue de ${repo}: ${error.message}`});
        throw new Error("Error durante el despliegue.");
    }
};

/**
 * Ejecuta el script de despliegue de la libreria de componentes Angular
 */
export const deployLibAngular = async (repo: string): Promise<string> => {
    // const deployCommand = `${REPO_SCRIPTS_PATH}restartServer.sh ${repo} ${process.env[repo]} ${process.env.NODE_LOG_FILE}`;

    try {
        // log.info({title:'GIT_HOOK_CI_CD_SERVICE_DEPLOY_NODE_MAIN',description:`Iniciando despliegue para ${repo}...`});
        // const { stdout } = await execPromise(deployCommand);
        // log.info({title:'GIT_HOOK_CI_CD_SERVICE_DEPLOY_NODE_MAIN',description:`Despliegue exitoso para ${repo}: ${stdout}`});
        return //stdout;
    } catch (error: any) {
        log.error({title:'GIT_HOOK_CI_CD_SERVICE_DEPLOY_NODE_MAIN',description:`Error en despliegue de ${repo}: ${error.message}`});
        throw new Error("Error durante el despliegue.");
    }
};

