import { SanitizedUser } from "@/types";
import { User } from "@prisma/client";

export function user(user: User): SanitizedUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    notificationNewBooking: user.notificationNewBooking,
    notificationNewQuestion: user.notificationNewQuestion,
    notificationQuestionSummary: user.notificationQuestionSummary,
  };
}
