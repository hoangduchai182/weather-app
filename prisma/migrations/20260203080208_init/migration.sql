-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL,
    "searchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Favorites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL,
    "notes" TEXT,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "SearchHistory_searchedAt_idx" ON "SearchHistory"("searchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_city_key" ON "Favorites"("city");

-- CreateIndex
CREATE INDEX "Favorites_city_idx" ON "Favorites"("city");
