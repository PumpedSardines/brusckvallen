import React from "react";

import styles from "./Layout.module.scss";

type LayoutProps = {
  title: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
};

function Layout(props: LayoutProps) {
  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <h1>{props.title}</h1>
        {props.aside && <aside className={styles.aside}>{props.aside}</aside>}
        <div className={styles.main}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Layout);
