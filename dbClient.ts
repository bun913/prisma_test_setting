import { PrismaClient } from "@prisma/client";

export const getPrismaClient = (): PrismaClient => {
    const prisma = new PrismaClient();
    return prisma;
}
