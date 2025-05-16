
import { Response } from 'express';
import { GenericResponseOptions } from '../interface/generic-response-options.interface';
import { GenericResponse } from '../interface/generic-response.interfase';

export const sendResponse = <T>(
    res: Response, 
    statusCode: number, 
    options: GenericResponseOptions<T>
): Response => {
    return res.status(statusCode).json({
        success: statusCode < 400, // Determina éxito basado en el código HTTP
        message: options.message,
        data: options.data,
        error: options.error,
        statusCode
    } as GenericResponse<T>);
};


/**
 * 200 OK - Respuesta exitosa con datos opcionales.
 */
export const successResponse = <T>(res: Response, message: string, data?: T): Response => {
    return sendResponse(res, 200, { message, data });
};

/**
 * 400 Bad Request - Error de validación u otros problemas del cliente.
 */
export const badRequestResponse = (res: Response, message: string, error?: string): Response => {
    return sendResponse(res, 400, { message, error });
};

/**
 * 401 Unauthorized - No autenticado.
 */
export const unauthorizedResponse = (res: Response, message: string): Response => {
    return sendResponse(res, 401, { message });
};

/**
 * 403 Forbidden - No autorizado para acceder.
 */
export const forbiddenResponse = (res: Response, message: string): Response => {
    return sendResponse(res, 403, { message });
};

/**
 * 404 Not Found - Recurso no encontrado.
 */
export const notFoundResponse = (res: Response, message: string, error?: string): Response => {
    return sendResponse(res, 404, { message, error });
};

/**
 * 500 Internal Server Error - Fallo en el servidor.
 */
export const handleServerErrorResponse = (res: Response, message: string, error?: string): Response => {
    return sendResponse(res, 500, { message, error });
};

/**
 * Manejo centralizado de errores en controladores
 */
export const serverErrorResponse = (res: Response, error: unknown, customMessage: string = 'Error interno del servidor') => {
    let errorMessage = 'Ocurrió un error inesperado';

    if (error instanceof Error) {
        errorMessage = error.message; // Extraer mensaje si es una instancia de Error
    } else if (typeof error === 'string') {
        errorMessage = error; // Si el error es un string, úsalo directamente
    }

    return handleServerErrorResponse(res, customMessage, errorMessage);
};