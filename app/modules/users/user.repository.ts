import { prisma } from "@/app/config/database.config";
import { Prisma, User } from "@prisma/client";

export class UserRepository {
    async findAll(search?: string): Promise<User[]> {
        const where: Prisma.UserWhereInput = search
            ? {
                  OR: [
                      { email: { contains: search } },
                      { name: { contains: search } },
                  ],
              }
            : {};

        return prisma.user.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data,
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    }

    async updateMany(
        data: Prisma.UserUpdateManyMutationInput,
        where?: Prisma.UserWhereInput
    ): Promise<Prisma.BatchPayload> {
        return prisma.user.updateMany({
            where,
            data,
        });
    }
}

export const userRepository = new UserRepository();
