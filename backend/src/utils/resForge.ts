import { Response } from "express";

interface Forger<T = unknown> {
  (status: number, data: { msg: string; payload?: T }): void;
  ok: (payload?: T) => void;
  badRequest: (msg?: string) => void;
  notFound: (msg?: string) => void;
  unauthorized: (msg?: string) => void;
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

  forger.badRequest = (msg?: string) => {
    res.status(400).send({
      ok: false,
      status: 400,
      msg: msg ?? "Bad Request",
      payload: null,
    });
  };

  forger.unauthorized = (msg?: string) => {
    res.status(401).send({
      ok: false,
      status: 401,
      msg: msg ?? "Unauthorized",
      payload: null,
    });
  };

  forger.notFound = (msg?: string) => {
    res.status(404).send({
      ok: false,
      status: 404,
      msg: msg ?? "Not Found",
      payload: null,
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
