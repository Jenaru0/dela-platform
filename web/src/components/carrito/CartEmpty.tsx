import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export const CartEmpty: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="w-36 h-36 mb-6 flex items-center justify-center bg-gray-100 rounded-full">
      <ShoppingCart className="w-16 h-16 text-gray-400" />
    </div>
    <div className="text-lg text-gray-500 mb-2">¡Tu carrito está vacío!</div>
    <Link href="/productos" className="text-[#CC9F53] font-semibold hover:underline">Explora productos</Link>
  </div>
);
