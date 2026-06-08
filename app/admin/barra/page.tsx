"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CocinaPage() {

  const [items, setItems] =
    useState<any[]>([]);

    const [orders, setOrders] =
  useState<any[]>([]);

  useEffect(() => {

    const loadItems = async () => {

      const { data, error } =
        await supabase
          .from("order_items")
          .select("*")
          .eq("area", "barra")
          .order(
            "created_at",
            {
              ascending: false
            }
          );

      if (error) {

        console.error(error);

      } else {

        setItems(data || []);

      }

    };

    loadItems();

    const loadOrders = async () => {

  const { data, error } =
    await supabase
      .from("orders")
      .select("*");

  if (error) {

    console.error(error);

  } else {

    setOrders(data || []);

  }

};

loadOrders();

  }, []);

  const cambiarEstado = async (
  productos: any[]
) => {

  const estadoActual =
    productos[0].estado;

  let nuevoEstado =
    "Pendiente";

  if (
    estadoActual ===
    "Pendiente"
  ) {

    nuevoEstado =
      "Preparando";

  } else if (
    estadoActual ===
    "Preparando"
  ) {

    nuevoEstado =
      "Listo";

  }

  const ids =
    productos.map(
      (p) => p.id
    );

  const { error } =
    await supabase
      .from("order_items")
      .update({
        estado: nuevoEstado
      })
      .in("id", ids);

  if (error) {

    console.error(error);

    return;

  }

  setItems(
    items.map(
      (item) =>
        ids.includes(item.id)
          ? {
              ...item,
              estado: nuevoEstado
            }
          : item
    )
  );

};

  return (

    <main className="p-6 bg-[#0f0f0f] min-h-screen text-white">

      <h1 className="text-3xl font-bold mb-6">
        🍺 Barra
      </h1>

      {
  Object.entries(

    items.reduce(
      (acc: any, item: any) => {

        if (
          !acc[item.order_id]
        ) {

          acc[item.order_id] = [];

        }

        acc[item.order_id].push(
          item
        );

        return acc;

      },
      {}
    )

  ).map(
    ([orderId, productos]: any) => (

      <div
        key={orderId}
        className="
          bg-zinc-900
          rounded-2xl
          p-4
          mb-4
        "
      >

        <h2
  className="
    text-xl
    font-bold
    mb-3
  "
>
  Mesa {
    orders.find(
      (o) =>
        o.id ===
        productos[0].order_id
    )?.mesa || "?"
  }
</h2>

<p
  className="
    text-yellow-400
    font-semibold
    mb-3
  "
>
  Estado: {
    productos[0].estado
  }
</p>

<button
  onClick={() =>
    cambiarEstado(
      productos
    )
  }
  className={`
    px-3
    py-1
    rounded-lg
    mb-4

    ${
      productos[0].estado ===
      "Pendiente"
        ? "bg-yellow-600"
        : productos[0].estado ===
          "Preparando"
        ? "bg-orange-600"
        : "bg-green-600"
    }
  `}
>
  {productos[0].estado}
</button>

        {
  Object.values(

    productos.reduce(
      (acc: any, item: any) => {

        if (
          !acc[item.product_name]
        ) {

          acc[item.product_name] = {
            nombre:
              item.product_name,
            cantidad: 1
          };

        } else {

          acc[
            item.product_name
          ].cantidad++;

        }

        return acc;

      },
      {}
    )

  ).map((producto: any) => (

    <p
      key={producto.nombre}
      className="mb-1"
    >
      🍺 {producto.nombre}
      {" x"}
      {producto.cantidad}
    </p>

  ))
}

      </div>

    )
  )
}

    </main>

  );

}