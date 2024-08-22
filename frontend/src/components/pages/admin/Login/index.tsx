import React from "react";

import styles from "./Login.module.scss";

function Login() {
  return <div className={styles.root}>
    <form
      className={styles.form}
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <h1>Login</h1>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </div>
}

export default React.memo(Login);
