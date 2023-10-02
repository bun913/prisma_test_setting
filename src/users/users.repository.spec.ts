import { User } from "@prisma/client";
import { UsersRepository } from "./users.repository";
import { UserFactory } from "../../test/factories/user";

const userRepository = new UsersRepository(jestPrisma.client);
const userFactory = new UserFactory(jestPrisma.client);

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
      testUser = await userFactory.create({})
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
      // arrange
      const targetUser = await userFactory.create({email: "test@example.com"})
      const userInput = {
        id: targetUser.id,
        name: "changed2",
      };

      // act
      const result = await userRepository.updateuser(userInput);

      // assert
      expect(result.name).toEqual(userInput.name);
    });
  });
});
