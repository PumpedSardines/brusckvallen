import React from "react";

import styles from "./CheckBoxCont.module.scss";

type CheckBoxContProps = {
  label: string;
  name: string;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function CheckBoxCont(props: CheckBoxContProps) {

  return <div className={styles.checkboxCont}>
    <input type="checkbox" name={props.name} defaultChecked={props.defaultChecked} onChange={props.onChange} />
    <label htmlFor={props.name}>{props.label}</label>
  </div>
}

export default React.memo(CheckBoxCont);
