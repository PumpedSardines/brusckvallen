import resForger from "@/utils/resForge";
import { PrismaClient, User } from "@prisma/client";
import * as express from "express";
import * as dayjs from "dayjs";
import * as weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);

async function weeksGetHandler(req: express.Request, res: express.Response) {
  const prisma = res.locals["prisma"] as PrismaClient;
  const forge = resForger(res);
  const allData = req.query["allData"] === "true";

  const user = res.locals["user"] as User | undefined;

  if (allData && !user) {
    return forge.unauthorized();
  }

  const now = dayjs();
  const week = now.week();
  const year = now.year();

  const weeks = allData
    ? await getAllWeeks(prisma)
    : await getLimitedWeeks(prisma, year, week);

  return forge.ok(weeks);
}

async function getAllWeeks(prisma: PrismaClient) {
  return await prisma.week.findMany({
    orderBy: [
      {
        year: "asc",
      },
      {
        week: "asc",
      },
    ],
  });
}

async function getLimitedWeeks(
  prisma: PrismaClient,
  year: number,
  week: number,
) {
  return await prisma.week.findMany({
    select: {
      week: true,
      year: true,
      price: true,
      booked: true,
    },
    where: {
      hidden: false,
      OR: [
        {
          year: {
            gt: year,
          },
        },
        {
          AND: [
            {
              year: year,
            },
            {
              week: {
                gt: week,
              },
            },
          ],
        },
      ],
    },
    orderBy: [
      {
        year: "asc",
      },
      {
        week: "asc",
      },
    ],
  });
}

export default weeksGetHandler;
