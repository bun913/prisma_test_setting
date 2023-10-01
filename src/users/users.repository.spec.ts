import { User } from "@prisma/client";
import { UsersRepository } from "./users.repository";
import { UserFactory } from "../../test/factories/user";

const userRepository = new UsersRepository(jestPrisma.client);

describe("UsersRepository", () => {
  describe("createUser", () => {
    it("should return a user", async () => {
      const userInput = {
        name: "test",
        email: "test@example.com",
      };
      const result = await userRepository.createUser(userInput);
      expect(result.email).toEqual(userInput.email);
    });

    it("should return a user2", async () => {
      const userInput = {
        name: "test",
        email: "test@example.com",
      };
      const result = await userRepository.createUser(userInput);
      expect(result.email).toEqual(userInput.email);
    });
  });

  describe("updateUser", () => {
    let testUser: User

    beforeEach(async () => {
      testUser = await UserFactory.create({})
      // testUser = await userRepository.createUser({
      //   name: "test",
      //   email: "test@example.com",
      // });
    });

    it("updates user name", async () => {
      // arrange
      const userInput = {
        id: testUser.id,
        name: "changed",
      };

      // act
      const result = await userRepository.updateuser(userInput);

      // assert
      expect(result.name).toEqual(userInput.name);
    });

    it("updates user name", async () => {
      // この時点では当然変更されていない
      expect(testUser.name).toEqual("test");
      // arrange
      const userInput = {
        id: testUser.id,
        name: "changed2",
      };

      // act
      const result = await userRepository.updateuser(userInput);

      // assert
      // ここではちゃんと変更されている
      expect(result.name).toEqual(userInput.name);
    });
  });
});
