ALTER TABLE "Professional" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
ALTER TABLE "Professional" ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP;
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP;
