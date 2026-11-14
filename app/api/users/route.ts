import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, createUser, updateAllUsers } from "@/app/modules/users/user.controller";
import { errorHandlerMiddleware } from "@/app/middlewares/errorHandler.middleware";

export async function GET(req: NextRequest): Promise<NextResponse | Response> {
    try {
        return await getAllUsers(req);
    } catch (error) {
        return errorHandlerMiddleware(error);
    }
}

export async function POST(req: NextRequest): Promise<NextResponse | Response> {
    try {
        return await createUser(req);
    } catch (error) {
        return errorHandlerMiddleware(error);
    }
}

export async function PATCH(req: NextRequest): Promise<NextResponse | Response> {
    try {
        return await updateAllUsers(req);
    } catch (error) {
        return errorHandlerMiddleware(error);
    }
}
