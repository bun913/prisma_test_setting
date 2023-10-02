import { faker } from "@faker-js/faker";
import { Prisma, User, PrismaClient } from "@prisma/client";

// 関連テーブルがある場合は親テーブル側のDefaultAttributesをimportして利用できます
export const userDefaultAttributes: Prisma.UserCreateInput = {
  email: faker.internet.email(),
  name: faker.person.lastName()
};

// こちらを参考にFactoryクラスを作成してください
// ある程度自由にカスタマイズして構いません
export class UserFactory {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(attributes: 
    Partial<Prisma.UserCreateInput> = {}
  ): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...userDefaultAttributes,
        ...attributes,
      },
    });
  }
}
