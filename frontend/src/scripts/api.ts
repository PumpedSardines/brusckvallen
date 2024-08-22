import { API_URL } from "@/config";

export type Response<T = null> =
  | {
      ok: true;
      status: number;
      msg: string;
      payload: T;
    }
  | {
      ok: false;
      status: number;
      msg: string;
      payload: null;
    };

export namespace Api {
  export type Week = {
    week: number;
    year: number;
    hidden: boolean;
    price: number;
    booked: boolean;
  };
}

async function req<T>(
  path: string,
  method: "GET" | "POST" | "DELETE" | "PUT",
  body: unknown = undefined,
): Promise<Response<T>> {
  const url = `${API_URL}${path}`;

  const fetchOptions: Record<string, unknown> = {
    method,
  };

  if (body != null) {
    fetchOptions.headers = {
      "Content-Type": "application/json",
    };
    fetchOptions.body = JSON.stringify(body);
  }

  return await fetch(url, fetchOptions).then((v) => v.json());
}

function api() {
  return {
    login: async (username: string, password: string) => {
      return await req("/login", "POST", { username, password });
    },
    weeks: {
      getAll: async () => {
        return await req<Api.Week[]>("/weeks", "GET");
      },
      put: async (week: Api.Week) => {
        return await req<Api.Week>(`/weeks`, "PUT", week);
      },
    },
  };
}

export default api;
