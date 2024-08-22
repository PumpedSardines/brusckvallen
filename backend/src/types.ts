export type SanitizedUser = {
  id: number;
  username: string;
  email: string | null;
  notificationNewBooking: boolean;
  notificationNewQuestion: boolean;
  notificationQuestionSummary: boolean;
};
