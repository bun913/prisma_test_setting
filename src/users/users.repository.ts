import { PrismaClient, User } from "@prisma/client";

interface UserCreateInput {
  name: string;
  email: string;
}

export class UsersRepository {
  private readonly client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client
  }

  async getAllUsers(): Promise<User[]> {
    return await this.client.user.findMany();
  }

  async createUser(user: UserCreateInput): Promise<User> {
    return await this.client.user.create({
      data: user,
    });
  }
}
