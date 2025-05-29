/*
  Warnings:

  - You are about to drop the column `estado` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `tipoUsuarioId` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `tipo_usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('CLIENTE', 'ADMIN');

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_tipoUsuarioId_fkey";

-- AlterTable
ALTER TABLE "carrito" ALTER COLUMN "actualizadoEn" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "carrito_item" ALTER COLUMN "actualizadoEn" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "categoria_producto" ALTER COLUMN "actualizadoEn" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "detalle_pedido" ALTER COLUMN "actualizadoEn" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "direccion_cliente" ALTER COLUMN "actualizadoEn" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "pedido" ALTER COLUMN "actualizadoEn" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "producto" ALTER COLUMN "actualizadoEn" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "promocion" ALTER COLUMN "actualizadoEn" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "reclamo" ALTER COLUMN "actualizadoEn" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "estado",
DROP COLUMN "tipoUsuarioId",
ADD COLUMN     "eliminado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tipoUsuario" "TipoUsuario" NOT NULL DEFAULT 'CLIENTE';

-- DropTable
DROP TABLE "tipo_usuario";
