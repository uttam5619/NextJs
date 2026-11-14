import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "info", "warn", "error"]
                : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

/**
 * Explicitly connects to the database and verifies connectivity.
 */
export async function connectDatabase(): Promise<void> {
    try {
        await prisma.$connect();
        console.log("Database connection established successfully via Prisma.");
    } catch (error) {
        console.error("Failed to connect to the database via Prisma:", error);
        throw error;
    }
}

/**
 * Gracefully disconnects from the database.
 */
export async function disconnectDatabase(): Promise<void> {
    try {
        await prisma.$disconnect();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error while disconnecting from the database:", error);
    }
}

export default prisma;
