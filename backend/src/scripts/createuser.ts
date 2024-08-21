import { PrismaClient } from "@prisma/client";
import * as prompt from "prompt";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

(async () => {
  const data = await prompt.get(["username", "password"]);

  const username = data["username"] as string;
  const password = data["password"] as string;

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      passwordHash,
    },
  });
})();
