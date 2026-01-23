/*
  Warnings:

  - Added the required column `pembeli_id` to the `keranjang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `keranjang` ADD COLUMN `pembeli_id` BIGINT NOT NULL;
