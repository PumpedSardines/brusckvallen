import resForger from "@/utils/resForge";
import { PrismaClient, User } from "@prisma/client";
import Ajv, { JSONSchemaType } from "ajv";
import * as express from "express";

const ajv = new Ajv();
type Body = {
  week: number;
  year: number;
  hidden: boolean;
  price: number;
  booked: boolean;
};

const schema: JSONSchemaType<Body> = {
  type: "object",
  properties: {
    week: { type: "number" },
    year: { type: "number" },
    hidden: { type: "boolean" },
    price: { type: "number" },
    booked: { type: "boolean" },
  },
  required: ["week", "year", "price", "booked"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

async function weeksPutHandler(req: express.Request, res: express.Response) {
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

  await prisma.week.upsert({
    where: {
      week_year: {
        week: body.week,
        year: body.year,
      },
    },
    update: {
      price: body.price,
      booked: body.booked,
      hidden: body.hidden,
    },
    create: {
      hidden: body.hidden,
      week: body.week,
      year: body.year,
      price: body.price,
      booked: body.booked,
    },
  });

  return forge.ok();
}

export default weeksPutHandler;
