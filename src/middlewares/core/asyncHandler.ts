import { Request, Response, NextFunction } from "express";

/**
 * Middleware para manejar errores en funciones async sin necesidad de `try/catch`.
 * 
 * El error capturado por catch(next); será manejado por el middleware global de errores (errorMiddleware.ts)
 */

export const asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
};