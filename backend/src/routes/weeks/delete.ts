import resForger from "@/utils/resForge";
import { PrismaClient, User } from "@prisma/client";
import Ajv, { JSONSchemaType } from "ajv";
import * as express from "express";

const ajv = new Ajv();
type Body = {
  week: number;
  year: number;
};

const schema: JSONSchemaType<Body> = {
  type: "object",
  properties: {
    week: { type: "number" },
    year: { type: "number" },
  },
  required: ["week", "year"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

async function weeksDeleteHandler(req: express.Request, res: express.Response) {
  const prisma = res.locals["prisma"] as PrismaClient;
  const user = res.locals["user"] as User | undefined;
  const forge = resForger(res);

  const body = req.body;

  if (user == null) {
    return forge.unauthorized();
  }

  if (!validate(body)) {
    return forge.badRequest();
  }

  const week = await prisma.week.findUnique({
    where: {
      week_year: {
        week: body.week,
        year: body.year,
      },
    },
  });

  if (week == null) {
    return forge.notFound();
  }

  await prisma.week.delete({
    where: {
      week_year: {
        week: body.week,
        year: body.year,
      },
    },
  });

  return forge.ok();
}

export default weeksDeleteHandler;
