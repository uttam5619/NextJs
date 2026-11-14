import { NextRequest, NextResponse } from "next/server";
import { AppError, BadRequestError, NotFoundError } from "@/app/lib/errors/error.lib";

export const getAllUsers = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("query") || "";
        return NextResponse.json({ success: true, query, data: [] }, { status: 200 });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to fetch users", 500);
    }
};

export const createUser = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const body = await request.json().catch(() => null);
        if (!body || Object.keys(body).length === 0) {
            throw new BadRequestError("Request body cannot be empty");
        }
        return NextResponse.json({ success: true, data: body }, { status: 201 });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to create user", 500);
    }
};

export const updateAllUsers = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const body = await request.json().catch(() => ({}));
        return NextResponse.json({ success: true, message: "Users updated successfully", data: body }, { status: 200 });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to update users", 500);
    }
};

export const getUser = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
    try {
        const { id } = await context.params;
        if (!id) {
            throw new BadRequestError("User ID is required");
        }
        if (id === "0") {
            throw new NotFoundError(`User with ID ${id} not found`);
        }

        return NextResponse.json({ success: true, data: { id } }, { status: 200 });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to retrieve user", 500);
    }
};

export const updateUser = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
    try {
        const { id } = await context.params;
        if (!id) {
            throw new BadRequestError("User ID is required");
        }
        const body = await request.json().catch(() => null);
        if (!body) {
            throw new BadRequestError("Request body cannot be empty");
        }
        return NextResponse.json({ success: true, data: { id, ...body } }, { status: 200 });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to update user", 500);
    }
};

export const deleteUser = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
    try {
        const { id } = await context.params;
        if (!id) {
            throw new BadRequestError("User ID is required");
        }
        return NextResponse.json({ success: true, message: `User ${id} deleted successfully` }, { status: 200 });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to delete user", 500);
    }
};
