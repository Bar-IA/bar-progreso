"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CocinaPage() {

  const [items, setItems] =
    useState<any[]>([]);

    const [vista, setVista] =
  useState("cocina");

    const [orders, setOrders] =
  useState<any[]>([]);

  const [productos, setProductos] =
  useState<any[]>([]);

  const [now, setNow] =
  useState(Date.now());

  useEffect(() => {

    const loadItems = async () => {

      const { data, error } =
        await supabase
          .from("order_items")
          .select("*")
          .eq("area", "cocina")
          .neq("estado", "Entregado")
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
    console.log("ORDERS", data);

  }

};

const loadProductos = async () => {

  const { data, error } =
    await supabase
      .from("products")
      .select("*")
      .eq("area", "cocina")
      .order("name");

  if (error) {

    console.error(error);

  } else {

    setProductos(
      data || []
    );

  }

};
loadOrders();
loadProductos();


const ordersChannel = supabase
  .channel("cocina-orders")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "orders"
    },
    async () => {

      const { data } =
        await supabase
          .from("orders")
          .select("*");

      setOrders(
        data || []
      );

    }
  )
  .subscribe();
const channel = supabase
  .channel("cocina-realtime")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "order_items"
    },
    async () => {

      const { data } =
        await supabase
          .from("order_items")
          .select("*")
          .eq("area", "cocina")
          .neq(
            "estado",
            "Entregado"
          )
          .order(
            "created_at",
            {
              ascending: false
            }
          );

      setItems(
        data || []
      );

      const { data: ordersData } =
  await supabase
    .from("orders")
    .select("*");

setOrders(
  ordersData || []
);

    }
  )
  .subscribe();

  return () => {

  supabase.removeChannel(
    channel
  );

  


};

  }, []);

  useEffect(() => {

  const interval =
    setInterval(() => {

      setNow(
        Date.now()
      );

    }, 60000);

  return () =>
    clearInterval(
      interval
    );

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

const toggleProducto = async (
  id: number,
  active: boolean
) => {

  const { error } =
    await supabase
      .from("products")
      .update({
        active: !active
      })
      .eq("id", id);

  if (error) {

    console.error(error);

    return;

  }

  setProductos(
    productos.map(
      (p) =>
        p.id === id
          ? {
              ...p,
              active: !active
            }
          : p
    )
  );

};

  return (

    <main className="p-6 bg-[#0f0f0f] min-h-screen text-white">

      <h1 className="text-3xl font-bold mb-6">
        👨‍🍳 Cocina
      </h1>

      <div className="flex gap-3 mb-6">

  <button
    onClick={() =>
      setVista("cocina")
    }
    className={`
      px-4
      py-2
      rounded-xl
      font-semibold

      ${
        vista === "cocina"
          ? "bg-[#b9742d]"
          : "bg-zinc-800"
      }
    `}
  >
    👨‍🍳 Cocina
  </button>

  <button
    onClick={() =>
      setVista("stock")
    }
    className={`
      px-4
      py-2
      rounded-xl
      font-semibold

      ${
        vista === "stock"
          ? "bg-[#b9742d]"
          : "bg-zinc-800"
      }
    `}
  >
    📦 Stock
  </button>

</div>

{
  vista === "cocina" && (

      <div
      className="
      grid
      grid-cols-3
      gap-3
      ">

      
      {       
      Object.entries(

      items.reduce(
      (acc: any, item: any) => {

        if (
       !acc[item.batch_id]
        ) {

  acc[item.batch_id] = [];

}

acc[item.batch_id].push(
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
}</h2>

<p
  className="
    text-xs
    text-gray-500
    mb-2
  "
>
  Comanda {
    new Date(
      productos[0].created_at
    ).toLocaleTimeString(
      "es-ES",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    )
  }


</p>

<p
  className={`
    text-sm
    font-bold
    mb-2

    ${
      Math.floor(
        (
          now -
          new Date(
            productos[0].created_at
          ).getTime()
        ) /
        60000
      ) >= 20

        ? "text-red-500"

        : Math.floor(
            (
              now -
              new Date(
                productos[0].created_at
              ).getTime()
            ) /
            60000
          ) >= 10

        ? "text-orange-500"

        : "text-green-500"
    }
  `}
>
  ⏱️ {
    Math.floor(
      (
        now -
        new Date(
          productos[0].created_at
        ).getTime()
      ) /
      60000
    )
  } min
</p>

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

        
{productos.map((producto: any) => (

  <div
    key={producto.id}
    className="mb-3"
  >

    <p>
      🍔 {producto.product_name}
      {" x"}
      {producto.cantidad}
    </p>

    {producto.comentario && (

  <p
    className="
      text-red-500
      font-bold
      text-sm
      ml-5
      mt-1
    "
  >
    ⚠ {producto.comentario.toUpperCase()}
  </p>

)}

  </div>

))}


      </div>

    )
  )
}
</div>
)
}

{
  vista === "stock" && (

    <div
      className="
        bg-zinc-900
        rounded-3xl
        p-6
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-6
        "
      >
        📦 Stock Cocina
      </h2>

      <div className="space-y-3">

        {
          productos.map(
            (producto) => (

              <div
                key={producto.id}
                className="
                  bg-zinc-800
                  rounded-xl
                  p-4
                  flex
                  justify-between
                  items-center
                "
              >

                <p>
                  {producto.name}
                </p>

                <button
  onClick={() =>
    toggleProducto(
      producto.id,
      producto.active
    )
  }
  className={`
                    px-3
                    py-2
                    rounded-xl
                    font-semibold

                    ${
                      producto.active
                        ? "bg-green-600"
                        : "bg-red-600"
                    }
                  `}
                >
                  {
                    producto.active
                      ? "✅ Disponible"
                      : "❌ Agotado"
                  }
                </button>

              </div>

            )
          )
        }

      </div>

    </div>

  )
}

    </main>

  );

}