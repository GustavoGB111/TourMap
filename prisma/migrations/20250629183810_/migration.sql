/*
  Warnings:

  - A unique constraint covering the columns `[idClient]` on the table `notificationRoadMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idRoadMap]` on the table `notificationRoadMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idClient]` on the table `notificationTouristPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idTouristPoint]` on the table `notificationTouristPoint` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `notificationRoadMap_idClient_key` ON `notificationRoadMap`(`idClient`);

-- CreateIndex
CREATE UNIQUE INDEX `notificationRoadMap_idRoadMap_key` ON `notificationRoadMap`(`idRoadMap`);

-- CreateIndex
CREATE UNIQUE INDEX `notificationTouristPoint_idClient_key` ON `notificationTouristPoint`(`idClient`);

-- CreateIndex
CREATE UNIQUE INDEX `notificationTouristPoint_idTouristPoint_key` ON `notificationTouristPoint`(`idTouristPoint`);
