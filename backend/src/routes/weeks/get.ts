import resForger from "@/utils/resForge";
import { PrismaClient } from "@prisma/client";
import * as express from "express";

async function weeksGetHandler(_: express.Request, res: express.Response) {
  const prisma = res.locals["prisma"] as PrismaClient;
  const forge = resForger(res);

  const weeks = await prisma.week.findMany({});

  return forge.ok(weeks);
}

export default weeksGetHandler;
