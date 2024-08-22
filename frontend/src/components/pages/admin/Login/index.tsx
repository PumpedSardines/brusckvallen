import React from "react";

import styles from "./Login.module.scss";
import api from "@/scripts/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function Login() {
  const queryClient = useQueryClient();

  return (
    <div className={styles.root}>
      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.target as HTMLFormElement);
          const username = data.get("username") as string;
          const password = data.get("password") as string;

          const res = await api().login(username, password);
          if (res.ok) {
            window.location.reload();
          } else {
            toast.error("Invalid username or password");
          }
        }}
      >
        <h1>Login</h1>
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <button className="button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default React.memo(Login);
