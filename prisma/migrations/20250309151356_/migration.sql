-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(36) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(15) NULL,
    `openid` VARCHAR(36) NULL,
    `nickname` VARCHAR(20) NULL,
    `avatar` VARCHAR(255) NULL,
    `status` BOOLEAN NULL DEFAULT true,
    `createtime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatetime` DATETIME(3) NOT NULL,
    `deletetime` BIGINT NOT NULL DEFAULT 0,
    `creator` CHAR(36) NULL,
    `updater` CHAR(36) NULL,

    INDEX `users_deletetime_idx`(`deletetime`),
    UNIQUE INDEX `users_email_deletetime_key`(`email`, `deletetime`),
    UNIQUE INDEX `users_openid_deletetime_key`(`openid`, `deletetime`),
    UNIQUE INDEX `users_phone_deletetime_key`(`phone`, `deletetime`),
    UNIQUE INDEX `users_username_deletetime_key`(`username`, `deletetime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(36) NOT NULL,
    `value` VARCHAR(36) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createtime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatetime` DATETIME(3) NOT NULL,
    `deletetime` BIGINT NOT NULL DEFAULT 0,
    `creator` CHAR(36) NULL,
    `updater` CHAR(36) NULL,

    INDEX `roles_deletetime_idx`(`deletetime`),
    UNIQUE INDEX `roles_value_deletetime_key`(`value`, `deletetime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(36) NOT NULL,
    `value` VARCHAR(36) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createtime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatetime` DATETIME(3) NOT NULL,
    `deletetime` BIGINT NOT NULL DEFAULT 0,
    `creator` CHAR(36) NULL,
    `updater` CHAR(36) NULL,

    INDEX `permission_deletetime_idx`(`deletetime`),
    UNIQUE INDEX `permission_value_deletetime_key`(`value`, `deletetime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(50) NOT NULL,
    `value` VARCHAR(50) NOT NULL,
    `path` VARCHAR(100) NULL,
    `name` VARCHAR(100) NULL,
    `component` VARCHAR(100) NULL,
    `redirect` VARCHAR(100) NULL,
    `meta` JSON NULL,
    `icon` VARCHAR(50) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `hidden` BOOLEAN NOT NULL DEFAULT false,
    `parent_id` VARCHAR(191) NULL,
    `createtime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatetime` DATETIME(3) NOT NULL,
    `deletetime` BIGINT NOT NULL DEFAULT 0,
    `creator` CHAR(36) NULL,
    `updater` CHAR(36) NULL,

    INDEX `menu_parent_id_deletetime_idx`(`parent_id`, `deletetime`),
    UNIQUE INDEX `menu_value_deletetime_key`(`value`, `deletetime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buttons` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `value` VARCHAR(50) NOT NULL,
    `code` VARCHAR(50) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `menu_id` VARCHAR(191) NOT NULL,
    `createtime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatetime` DATETIME(3) NOT NULL,
    `deletetime` BIGINT NOT NULL DEFAULT 0,
    `creator` CHAR(36) NULL,
    `updater` CHAR(36) NULL,

    INDEX `buttons_menu_id_deletetime_idx`(`menu_id`, `deletetime`),
    UNIQUE INDEX `buttons_code_menu_id_deletetime_key`(`code`, `menu_id`, `deletetime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dict` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `name_en` VARCHAR(50) NULL,
    `code` VARCHAR(50) NOT NULL,
    `value` VARCHAR(50) NOT NULL,
    `label` VARCHAR(50) NOT NULL,
    `label_en` VARCHAR(50) NULL,
    `type` VARCHAR(20) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 1,
    `parent_id` VARCHAR(191) NULL,
    `remark` VARCHAR(255) NULL,
    `remark_en` VARCHAR(255) NULL,
    `color` VARCHAR(20) NULL,
    `css_class` VARCHAR(100) NULL,
    `list_class` VARCHAR(100) NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `extra_data` JSON NULL,
    `valid_from` TIMESTAMP NULL,
    `valid_to` TIMESTAMP NULL,
    `createtime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatetime` DATETIME(3) NOT NULL,
    `deletetime` BIGINT NOT NULL DEFAULT 0,
    `creator` CHAR(36) NULL,
    `updater` CHAR(36) NULL,

    INDEX `dict_code_status_idx`(`code`, `status`),
    INDEX `dict_parent_id_deletetime_idx`(`parent_id`, `deletetime`),
    UNIQUE INDEX `dict_code_value_deletetime_key`(`code`, `value`, `deletetime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NULL,
    `createtime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatetime` DATETIME(3) NOT NULL,
    `deletetime` BIGINT NOT NULL DEFAULT 0,
    `creator` CHAR(36) NULL,
    `updater` CHAR(36) NULL,

    INDEX `post_category_id_fkey`(`category_id`),
    INDEX `post_user_id_fkey`(`user_id`),
    UNIQUE INDEX `post_title_user_id_deletetime_key`(`title`, `user_id`, `deletetime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `createtime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatetime` DATETIME(3) NOT NULL,
    `deletetime` BIGINT NOT NULL DEFAULT 0,
    `creator` CHAR(36) NULL,
    `updater` CHAR(36) NULL,

    INDEX `category_deletetime_idx`(`deletetime`),
    UNIQUE INDEX `category_name_deletetime_key`(`name`, `deletetime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_users_roles` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_users_roles_AB_unique`(`A`, `B`),
    INDEX `_users_roles_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_roles_permission` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_roles_permission_AB_unique`(`A`, `B`),
    INDEX `_roles_permission_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_roles_menu` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_roles_menu_AB_unique`(`A`, `B`),
    INDEX `_roles_menu_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_roles_buttons` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_roles_buttons_AB_unique`(`A`, `B`),
    INDEX `_roles_buttons_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `menu_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buttons` ADD CONSTRAINT `buttons_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dict` ADD CONSTRAINT `dict_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `dict`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_users_roles` ADD CONSTRAINT `_users_roles_A_fkey` FOREIGN KEY (`A`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_users_roles` ADD CONSTRAINT `_users_roles_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_roles_permission` ADD CONSTRAINT `_roles_permission_A_fkey` FOREIGN KEY (`A`) REFERENCES `permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_roles_permission` ADD CONSTRAINT `_roles_permission_B_fkey` FOREIGN KEY (`B`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_roles_menu` ADD CONSTRAINT `_roles_menu_A_fkey` FOREIGN KEY (`A`) REFERENCES `menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_roles_menu` ADD CONSTRAINT `_roles_menu_B_fkey` FOREIGN KEY (`B`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_roles_buttons` ADD CONSTRAINT `_roles_buttons_A_fkey` FOREIGN KEY (`A`) REFERENCES `buttons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_roles_buttons` ADD CONSTRAINT `_roles_buttons_B_fkey` FOREIGN KEY (`B`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
