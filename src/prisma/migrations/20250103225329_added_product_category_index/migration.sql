-- DropIndex
DROP INDEX `Product_area_idx` ON `Product`;

-- CreateIndex
CREATE INDEX `Product_area_category_idx` ON `Product`(`area`, `category`);
