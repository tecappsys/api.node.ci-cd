import winston from "winston";
import path from "path";
import { GenericLog } from "../interface/generic-log.interface";

// Configuración de formatos de logs
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// Configuración de `winston` con múltiples transportes
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        logFormat
    ),
    transports: [
        new winston.transports.Console(), // Log en consola
        // new winston.transports.File({ filename: path.join(__dirname, "../../logs/server.log") }), // Log en archivo
        // new winston.transports.Http({ host: "logserver.com", path: "/logs", port: 3000 }) // Log en un servidor remoto
    ]
});

// Función auxiliar para logs estructurados
export const log = {
    info: (genericLog:GenericLog) => logger.info(`📢 ${genericLog.title} - ${genericLog.description}`),
    warn: (genericLog:GenericLog) => logger.warn(`⚠️ ${genericLog.title} - ${genericLog.description}`),
    error: (genericLog:GenericLog) => logger.error(`🚫 ${genericLog.title} - ${genericLog.description}`),
    debug: (genericLog:GenericLog) => logger.debug(`🪲 ${genericLog.title} - ${genericLog.description}`)
};

export default logger;
