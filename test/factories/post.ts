import { faker } from "@faker-js/faker";
import { Prisma, Post, PrismaClient } from "@prisma/client";
import { userDefaultAttributes } from "./user";

// 関連テーブルがある場合は親テーブル側のDefaultAttributesをimportして利用できます
export const postDefaultAttributes: Prisma.PostCreateInput = {
  title: faker.animal.dog(),
  content: faker.music.songName(),
  published: true,
  author: {
    create: {...userDefaultAttributes, ...{email: faker.internet.email()}}
  }
};

// こちらを参考にFactoryクラスを作成してください
// ある程度自由にカスタマイズして構いません
export class PostFactory {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(attributes: 
    Partial<Prisma.PostCreateInput> = {}
  ): Promise<Post> {
    return await this.prisma.post.create({
      data: {
        ...postDefaultAttributes,
        ...attributes,
      },
    });
  }

}
