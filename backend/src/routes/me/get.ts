import resForger from "@/utils/resForge";
import { User } from "@prisma/client";
import * as express from "express";
import * as dayjs from "dayjs";
import * as weekOfYear from "dayjs/plugin/weekOfYear";
import * as sanitize from "@/utils/sanitize";
dayjs.extend(weekOfYear);

async function meGetHandler(_: express.Request, res: express.Response) {
  const forge = resForger(res);
  const user = res.locals["user"] as User | undefined;

  if (!user) {
    return forge.unauthorized();
  }

  return forge.ok(sanitize.user(user));
}

export default meGetHandler;
