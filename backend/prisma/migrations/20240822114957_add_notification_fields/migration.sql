-- AlterTable
ALTER TABLE "users" ADD COLUMN     "notification_new_booking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notification_new_question" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notification_question_summary" BOOLEAN NOT NULL DEFAULT false;
