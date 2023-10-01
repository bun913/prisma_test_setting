import { faker } from "@faker-js/faker";
import { createFactory } from ".";
import { Prisma, PrismaClient, User } from "@prisma/client";

export const UserDefaultAttributes: Prisma.UserCreateInput = {
  email: faker.internet.email(),
  name: faker.person.fullName()
};

// TODO: ここの改良から始める
export const UserFactory = async (prisma: PrismaClient, attrubutes: Partial<Prisma.UserCreateInput>) => {
  return await prisma.user.create({
    data: UserDefaultAttributes
  })
}
