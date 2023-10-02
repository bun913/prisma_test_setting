/*
  Warnings:

  - A unique constraint covering the columns `[title,authorId]` on the table `posts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `posts_title_authorId_key` ON `posts`(`title`, `authorId`);
