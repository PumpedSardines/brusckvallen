import resForger from "@/utils/resForge";
import { PrismaClient, User } from "@prisma/client";
import Ajv, { JSONSchemaType } from "ajv";
import * as express from "express";
import * as sanitize from "@/utils/sanitize";

const ajv = new Ajv();
type Body = {
  email?: string | null;
  notificationNewBooking: boolean;
  notificationNewQuestion: boolean;
  notificationQuestionSummary: boolean;
};

const schema: JSONSchemaType<Body> = {
  type: "object",
  properties: {
    email: {
      type: "string",
      minLength: 1,
      maxLength: 255,
      nullable: true,
    },
    notificationNewBooking: { type: "boolean" },
    notificationNewQuestion: { type: "boolean" },
    notificationQuestionSummary: { type: "boolean" },
  },
  required: [],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

async function mePutHandler(req: express.Request, res: express.Response) {
  const forge = resForger(res);

  const prisma = res.locals["prisma"] as PrismaClient;
  const user = res.locals["user"] as User | undefined;
  const body = req.body;

  if (!user) {
    return forge.unauthorized();
  }

  if (!validate(body)) {
    return forge.badRequest();
  }

  const newUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      email: body.email ?? null,
      notificationNewBooking: body.notificationNewBooking,
      notificationNewQuestion: body.notificationNewQuestion,
      notificationQuestionSummary: body.notificationQuestionSummary,
    },
  });

  return forge.ok(sanitize.user(newUser));
}

export default mePutHandler;
