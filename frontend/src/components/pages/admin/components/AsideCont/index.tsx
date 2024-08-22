import React from "react";

import styles from "./AsideCont.module.scss";

type AsideContProps = {
  children?: React.ReactNode;
};

function AsideCont(props: AsideContProps) {
  return <aside className={styles.aside}>{props.children}</aside>;
}

export default React.memo(AsideCont);
