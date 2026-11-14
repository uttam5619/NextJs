import { NextRequest, NextResponse } from "next/server";
import { userService } from "./user.service";

export const getAllUsers = async (request: NextRequest): Promise<NextResponse> => {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || undefined;
    const users = await userService.getAllUsers(query);
    return NextResponse.json({ success: true, count: users.length, data: users }, { status: 200 });
};

export const createUser = async (request: NextRequest): Promise<NextResponse> => {
    const body = await request.json().catch(() => null);
    const newUser = await userService.createUser(body);
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
};

export const updateAllUsers = async (request: NextRequest): Promise<NextResponse> => {
    const body = await request.json().catch(() => ({}));
    const result = await userService.updateAllUsers(body);
    return NextResponse.json({ success: true, ...result }, { status: 200 });
};

export const getUser = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
    const { id } = await context.params;
    const user = await userService.getUserById(id);
    return NextResponse.json({ success: true, data: user }, { status: 200 });
};

export const updateUser = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const updatedUser = await userService.updateUser(id, body);
    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
};

export const deleteUser = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
    const { id } = await context.params;
    const result = await userService.deleteUser(id);
    return NextResponse.json({ success: true, ...result }, { status: 200 });
};
