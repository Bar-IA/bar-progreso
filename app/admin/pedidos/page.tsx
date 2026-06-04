"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PedidosPage() {

  const [pedidos, setPedidos] =
    useState<any[]>([]);

    const [solicitudes, setSolicitudes] =
  useState<any[]>([]);

  const [vista, setVista] =
  useState("pedidos");

  const [productos, setProductos] =
  useState<any[]>([]);

    const cambiarEstado = async (
  id: number,
  estadoActual: string
) => {

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
      "Servido";

  } else if (
    estadoActual ===
    "Servido"
  ) {

    nuevoEstado =
      "Cobrado";

  }

  

  const { error } =
  await supabase
    .from("orders")
    .update({
      estado: nuevoEstado,

      cuenta_abierta:
        nuevoEstado === "Cobrado"
          ? false
          : true,

      novedad: false
    })
    .eq("id", id);

  if (error) {

    console.error(error);

  } else {

    setPedidos(
      pedidos.map(
        (pedido) =>
          pedido.id === id
            ? {
                ...pedido,
                estado:
                  nuevoEstado
              }
            : pedido
      )
    );

  }

};

const atenderSolicitud = async (

    
  id: number
) => {

  const { error } =
    await supabase
      .from("solicitudes")
      .update({
        atendida: true
      })
      .eq("id", id);

  if (error) {

    console.error(error);

  } else {

    setSolicitudes(
      solicitudes.filter(
        (s) => s.id !== id
      )
    );

  }

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

  } else {

    setProductos(
      productos.map(
        (producto) =>
          producto.id === id
            ? {
                ...producto,
                active: !active
              }
            : producto
      )
    );

  }

};

  useEffect(() => {

    const loadSolicitudes =
  async () => {

    const { data, error } =
      await supabase
        .from("solicitudes")
        .select("*")
        .eq(
          "restaurant_id",
          1
        )
        .eq(
          "atendida",
          false
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    if (error) {

      console.error(error);

    } else {

      setSolicitudes(
        data || []
      );

    }

  };

    const loadPedidos = async () => {

      const { data, error } =
        await supabase
          .from("orders")
          .select("*")
          .eq("restaurant_id", 1)
          .neq("estado", "Cobrado")
          .order(
            "created_at",
            { ascending: false }
          );

      if (error) {

        console.error(error);

      } else {

        setPedidos(data || []);

      }

    };

    const loadProductos = async () => {

  const { data } =
    await supabase
      .from("products")
      .select("*")
      .eq("restaurant_id", 1)
      .order("name");

  setProductos(data || []);

};

    loadPedidos();
    loadSolicitudes();
    loadProductos();

    

    const channel = supabase
  .channel("orders-realtime")
  .on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "orders"
  },
  async (payload) => {

    console.log(
      "REALTIME RECIBIDO",
      payload
    );

    const { data } =
      await supabase
        .from("orders")
        .select("*")
        .eq("restaurant_id", 1)
        .neq("estado", "Cobrado")
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    setPedidos(data || []);

  }
)

.on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "solicitudes"
  },
  async () => {

    const { data } =
      await supabase
        .from("solicitudes")
        .select("*")
        .eq(
          "restaurant_id",
          1
        )
        .eq(
          "atendida",
          false
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    setSolicitudes(
      data || []
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

   const pedidosPendientes =
  pedidos.filter(
    (p) => p.estado === "Pendiente"
  );

const pedidosPreparando =
  pedidos.filter(
    (p) => p.estado === "Preparando"
  );

const pedidosServidos =
  pedidos.filter(
    (p) => p.estado === "Servido"
  );

  return (

    <main className="p-6 w-full">

      <div className="mb-8">

  <h1 className="text-4xl font-bold">
    🍔 Pedidos activos ({pedidos.length})
  </h1>

  <div className="flex gap-3 mt-4">

  <button
    onClick={() =>
      setVista("pedidos")
    }
    className={`
      px-4
      py-2
      rounded-xl
      font-semibold

      ${
        vista === "pedidos"
          ? "bg-[#b9742d]"
          : "bg-zinc-800"
      }
    `}
  >
    🍔 Pedidos
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

</div>

<div className="grid md:grid-cols-3 gap-4 mb-8">

  <div
    className="
      bg-yellow-600
      rounded-2xl
      p-4
    "
  >
    <p className="text-sm">
      Pendientes
    </p>

    <p className="text-3xl font-bold">
      {pedidosPendientes.length}
    </p>
  </div>

  <div
    className="
      bg-orange-600
      rounded-2xl
      p-4
    "
  >
    <p className="text-sm">
      Preparando
    </p>

    <p className="text-3xl font-bold">
      {pedidosPreparando.length}
    </p>
  </div>

  <div
    className="
      bg-green-600
      rounded-2xl
      p-4
    "
  >
    <p className="text-sm">
      Servidos
    </p>

    <p className="text-3xl font-bold">
      {pedidosServidos.length}
    </p>
  </div>

</div>

{vista === "pedidos" && (
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
            

        {[...pedidos]
  .sort((a, b) => {

    const prioridad = {
      Pendiente: 1,
      Preparando: 2,
      Servido: 3
    };

 
    return (
  prioridad[
    a.estado as keyof typeof prioridad
  ] -
  prioridad[
    b.estado as keyof typeof prioridad
  ]
);

  })
  .map((pedido) => (

          <div
            key={pedido.id}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              p-6
            "
          >

            <div className="flex justify-between mb-4">

              <h2 className="text-2xl font-bold">
                Mesa {pedido.mesa}
                {pedido.novedad && (

  <span
    className="
      bg-red-600
      text-white
      text-xs
      px-2
      py-1
      rounded-full
      ml-2
      animate-pulse
    "
  >
    NUEVO
  </span>

)}
              </h2>

              <button
  onClick={() =>
  cambiarEstado(
    pedido.id,
    pedido.estado
  )
}


  className={`
  px-3
  py-1
  rounded-full
  text-sm
  font-semibold
  cursor-pointer

  ${
    pedido.estado === "Pendiente"
      ? "bg-yellow-600"
      : pedido.estado === "Preparando"
      ? "bg-orange-600"
      : pedido.estado === "Servido"
      ? "bg-green-600"
      : "bg-zinc-700"
  }
`}
>
  {pedido.estado}
</button>

            </div>

            <div className="space-y-2">

              {
  Object.values(

    pedido.pedido.reduce(
      (acc: any, item: any) => {

        if (!acc[item.name]) {

          acc[item.name] = {
            ...item,
            cantidad: 1
          };

        } else {

          acc[item.name].cantidad++;

        }

        return acc;

      },
      {}
    )

  ).map(
    (item: any, index: number) => (

      <p key={index}>
        • {item.name}
        {item.cantidad > 1 &&
          ` x${item.cantidad}`}
      </p>

    )
  )
}

            </div>

            <div className="mt-4 pt-4 border-t border-zinc-700">

              <p className="font-bold text-[#b9742d]">
                Total: {Number(
                  pedido.total
                ).toFixed(2)}€
              </p>

            </div>

          </div>

        ))}
        </div>
        
        <div
  className="
    bg-zinc-900
    rounded-3xl
    p-6
    h-fit
  "
>

  <h2 className="text-2xl font-bold mb-4">
  🔔 Solicitudes ({solicitudes.length})
</h2>

  {solicitudes.length === 0 ? (

    <p className="text-gray-400">
      Sin solicitudes
    </p>

  ) : (

    <div className="space-y-3">

      {solicitudes.map(
        (solicitud) => (

          <div
            key={solicitud.id}
            className="
              bg-zinc-800
              rounded-xl
              p-3
            "
          >

            <p className="font-bold">
              Mesa {solicitud.mesa}
            </p>

            <p>
              {solicitud.tipo ===
              "camarero"

                ? "🙋 Camarero"

                : "💰 Cuenta"}
            </p>

            <button
  onClick={() =>
    atenderSolicitud(
      solicitud.id
    )
  }
  className="
    mt-3
    w-full
    bg-green-600
    hover:bg-green-700
    rounded-lg
    py-2
    text-sm
    font-semibold
  "
>
  ✓ Atendida
</button>

          </div>

        )
      )}

    </div>

  )}

</div>

      </div>
)}

{vista === "stock" && (

  <div
    className="
      bg-zinc-900
      rounded-3xl
      p-6
    "
  >

    <h2 className="text-3xl font-bold mb-6">
      📦 Stock
    </h2>

    <div className="space-y-3">

  {productos.map(
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

        <span>
          {producto.name}
        </span>

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

  {producto.active
    ? "✅ Disponible"
    : "❌ Agotado"}

</button>

      </div>

    )
  )}

</div>

  </div>

)}
    </main>

  );

}