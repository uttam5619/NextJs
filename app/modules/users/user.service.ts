import { userRepository } from "./user.repository";
import { User, Role, Prisma } from "@prisma/client";
import {
    BadRequestError,
    NotFoundError,
    ConflictError,
} from "@/app/lib/errors/error.lib";


export type CreateUserInput = {
    email: string;
    name?: string | null;
    password: string;
    role?: Role;
};


export type UpdateUserInput = {
    email?: string;
    name?: string | null;
    password?: string;
    role?: Role;
};

export type SafeUser = Omit<User, "password">;


export function toSafeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
}


export class UserService {

    async getAllUsers(query?: string): Promise<SafeUser[]> {
        const users = await userRepository.findAll(query);
        return users.map(toSafeUser);
    }


    async getUserById(id: string): Promise<SafeUser> {
        if (!id) {
            throw new BadRequestError("User ID is required");
        }

        const user = await userRepository.findById(id);
        if (!user) {
            throw new NotFoundError(`User with ID "${id}" not found`);
        }

        return toSafeUser(user);
    }


    async createUser(data: CreateUserInput): Promise<SafeUser> {
        if (!data || !data.email || !data.password) {
            throw new BadRequestError("Email and password are required fields");
        }

        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictError(`User with email "${data.email}" already exists`);
        }

        const newUser = await userRepository.create({
            email: data.email,
            name: data.name ?? null,
            password: data.password,
            role: data.role,
        });

        return toSafeUser(newUser);
    }


    async updateUser(id: string, data: UpdateUserInput): Promise<SafeUser> {
        if (!id) {
            throw new BadRequestError("User ID is required");
        }

        const existingUser = await userRepository.findById(id);
        if (!existingUser) {
            throw new NotFoundError(`User with ID "${id}" not found`);
        }

        if (data.email && data.email !== existingUser.email) {
            const emailInUse = await userRepository.findByEmail(data.email);
            if (emailInUse && emailInUse.id !== id) {
                throw new ConflictError(`Email "${data.email}" is already taken`);
            }
        }

        const updatedUser = await userRepository.update(id, data);
        return toSafeUser(updatedUser);
    }

    
    async deleteUser(id: string): Promise<{ id: string; message: string }> {
        if (!id) {
            throw new BadRequestError("User ID is required");
        }

        const existingUser = await userRepository.findById(id);
        if (!existingUser) {
            throw new NotFoundError(`User with ID "${id}" not found`);
        }

        await userRepository.delete(id);
        return { id, message: `User "${id}" deleted successfully` };
    }

    async updateAllUsers(
        data: Prisma.UserUpdateManyMutationInput
    ): Promise<{ count: number; message: string }> {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError("Update payload cannot be empty");
        }

        const result = await userRepository.updateMany(data);
        return {
            count: result.count,
            message: `${result.count} users updated successfully`,
        };
    }
}

export const userService = new UserService();
