-- CreateTable
CREATE TABLE "SharedNote" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "shared_with_user_id" TEXT NOT NULL,

    CONSTRAINT "SharedNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedNote_noteId_shared_with_user_id_key" ON "SharedNote"("noteId", "shared_with_user_id");

-- AddForeignKey
ALTER TABLE "SharedNote" ADD CONSTRAINT "SharedNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedNote" ADD CONSTRAINT "SharedNote_shared_with_user_id_fkey" FOREIGN KEY ("shared_with_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
