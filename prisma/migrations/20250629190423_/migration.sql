/*
  Warnings:

  - A unique constraint covering the columns `[userClientEmail]` on the table `AvaliationCommercialPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUserClient]` on the table `AvaliationCommercialPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idCommercialPoint]` on the table `AvaliationCommercialPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUserClient]` on the table `AvaliationRoadMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idTravelRoadMap]` on the table `AvaliationRoadMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userClientEmail]` on the table `AvaliationTouristPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUserClient]` on the table `AvaliationTouristPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idTouristPoint]` on the table `AvaliationTouristPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userClientEmail]` on the table `CommentCommercialPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUserClient]` on the table `CommentCommercialPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idCommercialPoint]` on the table `CommentCommercialPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userClientEmail]` on the table `CommentRoadMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUserClient]` on the table `CommentRoadMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idTravelRoadMap]` on the table `CommentRoadMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userClientEmail]` on the table `CommentTouristPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUserClient]` on the table `CommentTouristPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idTouristPoint]` on the table `CommentTouristPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUserClient]` on the table `FavoriteCommercialPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idCommercialPoint]` on the table `FavoriteCommercialPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUserClient]` on the table `FavoriteRoadMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idRoadMap]` on the table `FavoriteRoadMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUserClient]` on the table `FavoriteTouristPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idTouristPoint]` on the table `FavoriteTouristPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idCommercialPoint]` on the table `ImageCommercialPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idRoadMap]` on the table `ImageRoadMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idTouristPoint]` on the table `ImageTouristPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idCommercialPoint]` on the table `reportCommercialPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idTouristPoint]` on the table `reportTouristPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUserReport]` on the table `reportTouristPoint` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `AvaliationCommercialPoint_userClientEmail_key` ON `AvaliationCommercialPoint`(`userClientEmail`);

-- CreateIndex
CREATE UNIQUE INDEX `AvaliationCommercialPoint_idUserClient_key` ON `AvaliationCommercialPoint`(`idUserClient`);

-- CreateIndex
CREATE UNIQUE INDEX `AvaliationCommercialPoint_idCommercialPoint_key` ON `AvaliationCommercialPoint`(`idCommercialPoint`);

-- CreateIndex
CREATE UNIQUE INDEX `AvaliationRoadMap_idUserClient_key` ON `AvaliationRoadMap`(`idUserClient`);

-- CreateIndex
CREATE UNIQUE INDEX `AvaliationRoadMap_idTravelRoadMap_key` ON `AvaliationRoadMap`(`idTravelRoadMap`);

-- CreateIndex
CREATE UNIQUE INDEX `AvaliationTouristPoint_userClientEmail_key` ON `AvaliationTouristPoint`(`userClientEmail`);

-- CreateIndex
CREATE UNIQUE INDEX `AvaliationTouristPoint_idUserClient_key` ON `AvaliationTouristPoint`(`idUserClient`);

-- CreateIndex
CREATE UNIQUE INDEX `AvaliationTouristPoint_idTouristPoint_key` ON `AvaliationTouristPoint`(`idTouristPoint`);

-- CreateIndex
CREATE UNIQUE INDEX `CommentCommercialPoint_userClientEmail_key` ON `CommentCommercialPoint`(`userClientEmail`);

-- CreateIndex
CREATE UNIQUE INDEX `CommentCommercialPoint_idUserClient_key` ON `CommentCommercialPoint`(`idUserClient`);

-- CreateIndex
CREATE UNIQUE INDEX `CommentCommercialPoint_idCommercialPoint_key` ON `CommentCommercialPoint`(`idCommercialPoint`);

-- CreateIndex
CREATE UNIQUE INDEX `CommentRoadMap_userClientEmail_key` ON `CommentRoadMap`(`userClientEmail`);

-- CreateIndex
CREATE UNIQUE INDEX `CommentRoadMap_idUserClient_key` ON `CommentRoadMap`(`idUserClient`);

-- CreateIndex
CREATE UNIQUE INDEX `CommentRoadMap_idTravelRoadMap_key` ON `CommentRoadMap`(`idTravelRoadMap`);

-- CreateIndex
CREATE UNIQUE INDEX `CommentTouristPoint_userClientEmail_key` ON `CommentTouristPoint`(`userClientEmail`);

-- CreateIndex
CREATE UNIQUE INDEX `CommentTouristPoint_idUserClient_key` ON `CommentTouristPoint`(`idUserClient`);

-- CreateIndex
CREATE UNIQUE INDEX `CommentTouristPoint_idTouristPoint_key` ON `CommentTouristPoint`(`idTouristPoint`);

-- CreateIndex
CREATE UNIQUE INDEX `FavoriteCommercialPoint_idUserClient_key` ON `FavoriteCommercialPoint`(`idUserClient`);

-- CreateIndex
CREATE UNIQUE INDEX `FavoriteCommercialPoint_idCommercialPoint_key` ON `FavoriteCommercialPoint`(`idCommercialPoint`);

-- CreateIndex
CREATE UNIQUE INDEX `FavoriteRoadMap_idUserClient_key` ON `FavoriteRoadMap`(`idUserClient`);

-- CreateIndex
CREATE UNIQUE INDEX `FavoriteRoadMap_idRoadMap_key` ON `FavoriteRoadMap`(`idRoadMap`);

-- CreateIndex
CREATE UNIQUE INDEX `FavoriteTouristPoint_idUserClient_key` ON `FavoriteTouristPoint`(`idUserClient`);

-- CreateIndex
CREATE UNIQUE INDEX `FavoriteTouristPoint_idTouristPoint_key` ON `FavoriteTouristPoint`(`idTouristPoint`);

-- CreateIndex
CREATE UNIQUE INDEX `ImageCommercialPoint_idCommercialPoint_key` ON `ImageCommercialPoint`(`idCommercialPoint`);

-- CreateIndex
CREATE UNIQUE INDEX `ImageRoadMap_idRoadMap_key` ON `ImageRoadMap`(`idRoadMap`);

-- CreateIndex
CREATE UNIQUE INDEX `ImageTouristPoint_idTouristPoint_key` ON `ImageTouristPoint`(`idTouristPoint`);

-- CreateIndex
CREATE UNIQUE INDEX `reportCommercialPoint_idCommercialPoint_key` ON `reportCommercialPoint`(`idCommercialPoint`);

-- CreateIndex
CREATE UNIQUE INDEX `reportTouristPoint_idTouristPoint_key` ON `reportTouristPoint`(`idTouristPoint`);

-- CreateIndex
CREATE UNIQUE INDEX `reportTouristPoint_idUserReport_key` ON `reportTouristPoint`(`idUserReport`);
