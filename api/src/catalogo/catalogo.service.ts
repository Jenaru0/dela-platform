// src/catalogo/catalogo.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FiltrosCatalogoDto } from './dto/FiltrosCatalogoDto';

@Injectable()
export class CatalogoService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerProductos(filtros: FiltrosCatalogoDto) {
    const { busqueda, categoriaId } = filtros;
    const where: any = {
      estado: 'ACTIVO',
      stock: { gt: 10 }, // Solo productos con stock mayor a 10
            };
            if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: 'insensitive' } },
        { descripcion: { contains: busqueda, mode: 'insensitive' } },
      ];
    }
    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    return this.prisma.producto.findMany({
      where,
      include: { imagenes: true, categoria: true },
      orderBy: { nombre: 'asc' },
    });
  }
}
