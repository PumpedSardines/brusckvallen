import React, { useState } from "react";
import Login from "./Login";
import { useQuery } from "@tanstack/react-query";
import api from "@/scripts/api";

import styles from "./App.module.scss";
import { cx } from "@/scripts/cx";
import Weeks from "./Weeks";
import Settings from "./Settings";

function App(): JSX.Element {
  const [view, setView] = useState<"weeks" | "settings">("weeks");
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api().me.get();

      return res.payload;
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

  if (!user) {
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
          className={cx(view === "settings" && styles.active)}
          onClick={() => {
            setView("settings");
          }}
        >
          Settings
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
            case "settings":
              return <Settings user={user} />;
          }
        })()}
      </main>
    </div>
  );
}

export default React.memo(App);
