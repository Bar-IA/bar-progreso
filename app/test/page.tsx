"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestPage() {

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {

    const loadProducts = async () => {

      const { data, error } = await supabase
        .from("products")
        .select("*");


      if (data) {
        setProducts(data);
      }

    };

    loadProducts();

  }, []);

  return (

    <main className="bg-black text-white min-h-screen p-10">

      <h1 className="text-4xl font-bold mb-6">
        Test Supabase
      </h1>

      {products.map(product => (

        <div
          key={product.id}
          className="mb-4"
        >
          {product.name} - {product.price}€
        </div>

      ))}

    </main>

  );

}