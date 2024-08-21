import resForger from "@/utils/resForge";
import { PrismaClient } from "@prisma/client";
import * as express from "express";
import * as dayjs from "dayjs";
import * as weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);

async function weeksGetHandler(_: express.Request, res: express.Response) {
  const prisma = res.locals["prisma"] as PrismaClient;
  const forge = resForger(res);

  const now = dayjs();
  const week = now.week();
  const year = now.year();

  const weeks = await prisma.week.findMany({
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

  return forge.ok(weeks);
}

export default weeksGetHandler;
