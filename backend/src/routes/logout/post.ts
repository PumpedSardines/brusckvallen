import resForger from "@/utils/resForge";
import { PrismaClient } from "@prisma/client";
import * as express from "express";

async function logoutPostHandler(_: express.Request, res: express.Response) {
  const prisma = res.locals["prisma"] as PrismaClient;
  const forge = resForger(res);

  const token = res.locals["token"] as string | undefined;

  if (token == null) {
    return forge.ok();
  }

  await prisma.userSession.delete({
    where: {
      token,
    },
  });

  res.cookie("token", token, {
    maxAge: 0,
    secure: true,
    httpOnly: true,
  });
  return forge.ok();
}

export default logoutPostHandler;
