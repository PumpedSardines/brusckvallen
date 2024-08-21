import { Response } from "express";

interface Forger<T = unknown> {
  (status: number, data: { msg: string; payload?: T }): void;
  ok: (payload?: T) => void;
}

function resForger<T = unknown>(res: Response) {
  const forger: Forger<T> = (
    status: number,
    data: { msg: string; payload?: T },
  ) => {
    res.status(status).send({
      ok: status < 400,
      status: status,
      msg: data.msg,
      payload: data.payload ?? null,
    });
  };

  forger.ok = (payload?: T) => {
    res.status(200).send({
      ok: true,
      status: 200,
      msg: "ok",
      payload: payload ?? null,
    });
  };

  return forger;
}

export default resForger;
