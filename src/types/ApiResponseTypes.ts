export interface ApiResponseParams<T> {
    statusCode: number;
    data: T;
    message?: string;
}