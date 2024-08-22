import randId from "@/utils/randId";
import resForger from "@/utils/resForge";
import { PrismaClient } from "@prisma/client";
import Ajv, { JSONSchemaType } from "ajv";
import * as bcrypt from "bcrypt";
import * as express from "express";

const ajv = new Ajv();
type Body = {
  username: string;
  password: string;
};

const schema: JSONSchemaType<Body> = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  required: ["username", "password"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

async function loginPostHandler(req: express.Request, res: express.Response) {
  const prisma = res.locals["prisma"] as PrismaClient;
  const forge = resForger(res);

  const body = req.body;

  if (!validate(body)) {
    return forge.badRequest();
  }

  const user = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });

  if (!user) {
    return forge.unauthorized("Username and password didn't match");
  }

  const passwordMatch = await bcrypt.compare(body.password, user.passwordHash);

  if (!passwordMatch) {
    return forge.unauthorized("Username and password didn't match");
  }

  const token = randId(256);

  await prisma.userSession.create({
    data: {
      userId: user.id,
      token,
    },
  });

  res.cookie("token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 5, // 1 year
    secure: true,
    httpOnly: true,
  });
  return forge.ok();
}

export default loginPostHandler;
