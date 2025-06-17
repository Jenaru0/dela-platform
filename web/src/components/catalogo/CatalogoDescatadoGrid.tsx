import React from 'react';
import CatalogoCard from './CatalogoCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './catalogo-carrusel.css'; // Importa estilos custom para flechas

interface CatalogoDestacadosGridProps {
  productos: CatalogoCardProduct[];
  onAddToCart?: (product: CatalogoCardProduct) => void;
}

// Definir el tipo que espera CatalogoCard
export type CatalogoCardProduct = {
  id: number | string;
  name: string;
  image: string;
  category: string;
  price?: number;
  priceFormatted?: string;
  shortDescription?: string;
  destacado?: boolean;
};

const CatalogoDestacadosGrid: React.FC<CatalogoDestacadosGridProps> = ({
  productos,
  onAddToCart,
}) => {
  if (!productos.length) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-[#FAF6EF] to-[#f5efd7]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#2d2418] mb-2">
          Productos Destacados
        </h2>
        <div className="h-1 w-16 mx-auto bg-[#CC9F53] rounded mb-6" />
        <p className="text-center text-[#9B9178] mb-10">
          Descubre nuestra selección de productos artesanales más populares
        </p>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          speed={900}
          autoplay={{ delay: 2200, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop={true}
          grabCursor={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          className="!pb-16"
        >
          {productos.map((producto) => (
            <SwiperSlide key={producto.id}>
              <div className="h-full flex items-center justify-center">
                <CatalogoCard
                  product={producto}
                  showStar
                  onAddToCart={onAddToCart}
                  onQuickView={() => window.location.assign(`/productos/${producto.id}`)}
                  className="shadow-2xl rounded-3xl bg-white hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Flechas custom SVG estilizadas */}
        <div className="swiper-button-prev custom-swiper-arrow hidden md:flex">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="arrowGradL" x1="0" y1="13" x2="26" y2="13" gradientUnits="userSpaceOnUse">
                <stop stopColor="#CC9F53"/>
                <stop offset="1" stopColor="#9B9178"/>
              </linearGradient>
            </defs>
            <circle cx="13" cy="13" r="12" fill="#fff9ec"/>
            <path d="M16.5 19L10.5 13L16.5 7" stroke="url(#arrowGradL)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="swiper-button-next custom-swiper-arrow hidden md:flex">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="arrowGradR" x1="0" y1="13" x2="26" y2="13" gradientUnits="userSpaceOnUse">
                <stop stopColor="#CC9F53"/>
                <stop offset="1" stopColor="#9B9178"/>
              </linearGradient>
            </defs>
            <circle cx="13" cy="13" r="12" fill="#fff9ec"/>
            <path d="M9.5 7L15.5 13L9.5 19" stroke="url(#arrowGradR)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default CatalogoDestacadosGrid;