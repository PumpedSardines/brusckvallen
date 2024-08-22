import type { Api } from "@/scripts/api";
import Layout from "@admin/components/Layout";
import React from "react";
import styles from "./Settings.module.scss";
import CheckBoxCont from "@admin/components/CheckBoxCont";
import usePutMe from "@admin/mutations/usePutMe";
import { toast } from "react-toastify";

type SettingsProps = {
  user: Api.SanitizedUser;
};

function Settings(props: SettingsProps) {
  const mePutMutation = usePutMe();

  return <Layout title="Settings">
    <form className={styles.form} onSubmit={e => {
      e.preventDefault();

      const data = new FormData(e.target as HTMLFormElement);
      const rawEmail = data.get("email") as string;
      const email = rawEmail.trim() === "" ? null : rawEmail.trim();
      const notificationNewQuestion = data.get("notification-new-question") === "on";
      const notificationNewBooking = data.get("notification-new-booking") === "on";
      const notificationQuestionSummary = data.get("notification-question-summary") === "on";

      const user: Api.UpdateUser = {
        email,
        notificationNewQuestion,
        notificationNewBooking,
        notificationQuestionSummary,
      }

      mePutMutation.mutate(user, {
        onSuccess: () => {
          toast.success("Updated user")
        },
      });
    }}>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" disabled={true} name="username" defaultValue={props.user.username} />
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" defaultValue={props.user.email ?? ""} />
      <CheckBoxCont label="Notification on new question" name="notification-new-question" defaultChecked={props.user.notificationNewQuestion} />
      <CheckBoxCont label="Notification on new booking" name="notification-new-booking" defaultChecked={props.user.notificationNewBooking} />
      <CheckBoxCont label="Notification on question summary" name="notification-question-summary" defaultChecked={props.user.notificationQuestionSummary} />
      <button className="button" type="submit">Save</button>
    </form>
  </Layout>;
}

export default React.memo(Settings);
