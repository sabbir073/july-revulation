-- CreateTable
CREATE TABLE "Visitor" (
    "id" SERIAL NOT NULL,
    "ip_address" TEXT NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "visit_count" INTEGER NOT NULL DEFAULT 1,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);
