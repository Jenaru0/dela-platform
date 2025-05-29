/* eslint-disable @typescript-eslint/require-await */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Inicializando base de datos...');
  
  // Aquí puedes agregar datos iniciales si es necesario
  // Por ejemplo: categorías de productos, configuraciones, etc.
  
  console.log('✅ Base de datos inicializada correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
