-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "paymentIntentId" TEXT,
ADD COLUMN     "paymentStatus" TEXT;
