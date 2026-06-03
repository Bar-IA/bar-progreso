"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Carta2Page() {

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {

    const loadProducts = async () => {

      const { data } = await supabase
        .from("products")
        .select("*");

      if (data) {
        setProducts(data);
      }

    };

    loadProducts();

  }, []);

  const groupedProducts = products.reduce(
    (acc: any, product) => {

      if (!acc[product.category]) {
        acc[product.category] = [];
      }

      acc[product.category].push(product);

      return acc;

    },
    {}
  );

  return (

    <main className="p-10">

      <h1 className="text-4xl font-bold mb-10">
        Carta Digital
      </h1>

      {Object.entries(groupedProducts).map(
        ([category, items]: any) => (

          <div
            key={category}
            className="mb-10"
          >

            <h2 className="text-2xl font-bold mb-4">
              {category}
            </h2>

            {items.map((product: any) => (

              <div
                key={product.id}
                className="
                  border-b
                  py-4
                "
              >

                <div className="flex justify-between">

                  <h3 className="font-semibold">
                    {product.name}
                  </h3>

                  <span>
                    {product.price}€
                  </span>

                </div>

                <p className="text-gray-500">

                  {product.description}

                </p>

              </div>

            ))}

          </div>

        )
      )}

    </main>

  );

}