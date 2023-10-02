import { PrismaClient, Post } from "@prisma/client";

interface PostCreateInput {
  title: string;
  content: string;
  authorId: number;
  published: boolean;
}

interface PostUpdateInput {
  id: number;
  title: string;
  content: string;
  published: boolean;
}

export class PostsRepository {
  private readonly client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.client.post.findMany();
  }

  async createPost(post: PostCreateInput): Promise<Post> {
    return await this.client.post.create({
      data: {
        title: post.title,
        content: post.content,
        published: post.published,
        author: {
          connect: {
            id: post.authorId,
          },
        },
      },
    });
  }

  async updatePost(post: PostUpdateInput): Promise<Post> {
    return await this.client.post.update({
      where: { id: post.id },
      data: { title: post.title, content: post.content },
    });
  }
}
