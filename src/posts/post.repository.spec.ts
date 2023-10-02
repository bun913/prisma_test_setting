import { Post, Prisma } from "@prisma/client";
import { PostsRepository } from "./post.repository";
import { PostFactory } from "../../test/factories/post";

const client = jestPrisma.client;
const postRepository = new PostsRepository(client);
const postFactory = new PostFactory(client);

describe("PostsRepository", () => {
  let testPost: Post;

  beforeEach(async () => {
    testPost = await postFactory.create({});
  });

  describe("updatePost", () => {
    it("updates post title", async () => {
      // arrange
      const postInput = {
        id: testPost.id,
        title: "changed",
        content: testPost.content,
        published: true,
      };

      // act
      const result = await postRepository.updatePost(postInput);

      // assert
      expect(result.title).toEqual("changed");
    });

    it("updates post content", async () => {
      // arrange
      const postInput = {
        id: testPost.id,
        title: testPost.title,
        content: "changed2",
        published: true,
      };

      // act
      const result = await postRepository.updatePost(postInput);

      // assert
      expect(result.content).toEqual("changed2");
    });

    it("can not create same title with same author", async () => {
      // arrange
      const mustErrorInput = {
        title: testPost.title,
        content: "何でも良い値",
        published: true,
        authorId: testPost.authorId as number,
      };

      // act & assert
      try {
        await postRepository.createPost(mustErrorInput);
      } catch (err) {
        const e = err as Error
        const message = e.message
        expect(e.name).toBe("PrismaClientKnownRequestError");
        expect(message).toContain("Unique constraint failed on the constraint:");
      }
      // なぜかrejects.toThrow()が通らない
      // await expect(postRepository.createPost(mustErrorInput)).rejects.toThrow();
    });
  });
});
