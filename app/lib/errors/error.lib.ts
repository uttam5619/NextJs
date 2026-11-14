export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = "Bad Request") {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = "Authentication required") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Access forbidden") {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "Resource not found") {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = "Resource conflict") {
        super(message, 409);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = "Internal Server Error") {
        super(message, 500, false);
    }
}

export class ServiceUnavaliableError extends AppError {
    constructor(message: string = "Service Unavailable") {
        super(message, 503);
    }
}

export class TimeoutError extends AppError {
    constructor(message: string = "Request timed out", statusCode: number = 504) {
        super(message, statusCode);
    }
}