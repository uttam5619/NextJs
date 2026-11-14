import { NextRequest, NextResponse } from "next/server";
import { getUser, updateUser, deleteUser } from "@/app/modules/users/user.controller";
import { errorHandlerMiddleware } from "@/app/middlewares/errorHandler.middleware";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext): Promise<NextResponse | Response> {
    try {
        return await getUser(req, context);
    } catch (error) {
        return errorHandlerMiddleware(error);
    }
}

export async function PATCH(req: NextRequest, context: RouteContext): Promise<NextResponse | Response> {
    try {
        return await updateUser(req, context);
    } catch (error) {
        return errorHandlerMiddleware(error);
    }
}

export async function DELETE(req: NextRequest, context: RouteContext): Promise<NextResponse | Response> {
    try {
        return await deleteUser(req, context);
    } catch (error) {
        return errorHandlerMiddleware(error);
    }
}
