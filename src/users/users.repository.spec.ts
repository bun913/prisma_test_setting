import { getPrismaClient } from "../../dbClient";
import { UsersRepository } from "./users.repository";

const userRepository = new UsersRepository(getPrismaClient());

describe("UsersRepository", () => {
  describe("createUser", () => {
    it("should return a user", async () => {
      const userInput = {
        name: "test",
        email: "test@example.com",
      };
      const result = await userRepository.createUser(userInput)
      expect(result.email).toEqual(userInput.email);
    });
  });
});
