-- CreateTable
CREATE TABLE `transaksi` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `kode_billing` VARCHAR(255) NOT NULL,
    `pembeli_id` BIGINT NOT NULL,
    `total_harga` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('BELUM_DIBAYAR', 'SUDAH_DIBAYAR') NOT NULL DEFAULT 'BELUM_DIBAYAR',
    `expired_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `transaksi_kode_billing_key`(`kode_billing`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `keranjang` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `transaksi_id` BIGINT NULL,
    `produk_id` BIGINT NOT NULL,
    `harga` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `keranjang` ADD CONSTRAINT `keranjang_transaksi_id_fkey` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
