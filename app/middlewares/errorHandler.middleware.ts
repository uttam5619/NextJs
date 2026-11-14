import { NextResponse } from "next/server";
import { AppError } from "@/app/lib/errors/error.lib";

/**
 * Global Error Handler Middleware
 *
 * Can be used in two ways:
 * 1. Directly handling an error inside a catch block:
 *    try { ... } catch (error) {
 *        return errorHandlerMiddleware(error);
 *    }
 *
 * 2. Wrapping an async operation:
 *    return await errorHandlerMiddleware(async () => {
 *        return await getAllUsers(req);
 *    });
 */
export function errorHandlerMiddleware(error: unknown): NextResponse;

export function errorHandlerMiddleware<T extends Response = Response>(
    operation: () => Promise<T>
): Promise<T | NextResponse>;


export function errorHandlerMiddleware<T extends Response = Response>(
    operationOrError: (() => Promise<T>) | unknown
): Promise<T | NextResponse> | NextResponse {
    // If an error is passed directly
    if (typeof operationOrError !== "function") {
        return formatGlobalError(operationOrError);
    }

    // If an async operation callback is passed
    return (async () => {
        try {
            return await (operationOrError as () => Promise<T>)();
        } catch (error: unknown) {
            return formatGlobalError(error);
        }
    })();
}

/**
 * Formats caught errors into a standardized NextResponse JSON.
 */
export function formatGlobalError(error: unknown): NextResponse {
    console.error("[Global Error Middleware Caught]:", error);

    if (error instanceof AppError) {
        return NextResponse.json(
            {
                success: false,
                error: error.name,
                message: error.message,
                statusCode: error.statusCode,
            },
            { status: error.statusCode }
        );
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
        {
            success: false,
            error: "InternalServerError",
            message,
            statusCode: 500,
        },
        { status: 500 }
    );
}

/**
 * Higher-order function helper to wrap an entire route handler function.
 */
export function withErrorHandler<TArgs extends unknown[]>(
    handler: (...args: TArgs) => Promise<Response | NextResponse> | Response | NextResponse
) {
    return async (...args: TArgs): Promise<Response | NextResponse> => {
        try {
            return await handler(...args);
        } catch (error: unknown) {
            return formatGlobalError(error);
        }
    };
}
