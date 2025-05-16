export interface GenericResponseOptions<T> {
    message: string;
    data?: T;
    error?: string;
}