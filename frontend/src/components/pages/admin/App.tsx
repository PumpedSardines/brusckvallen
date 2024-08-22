import React, { useState } from "react";
import Login from "./Login";
import { useQuery } from "@tanstack/react-query";
import api from "@/scripts/api";

import styles from "./App.module.scss";
import { cx } from "@/scripts/cx";
import Weeks from "./Weeks";

function App(): JSX.Element {
  const [view, setView] = useState<"weeks">("weeks");
  const {
    data: isLoggedIn,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["is-logged-in"],
    queryFn: async () => {
      const res = await api().me();
      return res.ok;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  if (!isLoggedIn) {
    return (
      <div>
        <Login />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <nav className={styles.nav}>
        <button
          className={cx(view === "weeks" && styles.active)}
          onClick={() => {
            setView("weeks");
          }}
        >
          Weeks
        </button>
        <button
          onClick={async () => {
            await api().logout();
            window.location.reload();
          }}
        >
          Logout
        </button>
      </nav>
      <main className={styles.main}>
        {(() => {
          switch (view) {
            case "weeks":
              return <Weeks />;
          }
        })()}
      </main>
    </div>
  );
}

export default React.memo(App);
