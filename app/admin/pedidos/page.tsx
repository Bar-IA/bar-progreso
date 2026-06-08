"use client";

import {
  useEffect,
  useState,
  useRef
} from "react";
import { supabase } from "@/lib/supabase";

export default function PedidosPage() {

  const [pedidos, setPedidos] =
    useState<any[]>([]);

    const [mesaProductos, setMesaProductos] =
  useState<number | null>(null);

  const [busquedaProducto, setBusquedaProducto] =
  useState("");

const [categoriaProducto, setCategoriaProducto] =
  useState("Todos");

  const [mesaSeleccionada, setMesaSeleccionada] =
  useState<any>(null);

    const [solicitudes, setSolicitudes] =
  useState<any[]>([]);

  const [vista, setVista] =
  useState("pedidos");

  const [productos, setProductos] =
  useState<any[]>([]);
  const [orderItems, setOrderItems] =
  useState<any[]>([]);
  const [pedidoAbierto, setPedidoAbierto] =
  useState<number | null>(null);
  const [mostrarNuevaMesa, setMostrarNuevaMesa] =
  useState(false);

const [nuevaMesa, setNuevaMesa] =
  useState("");

  const [audioActivo, setAudioActivo] =
  useState(false);
  const audioActivoRef =
  useRef(false);
  const ignorarSiguienteRealtime =
  useRef(false);

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

  
  ignorarSiguienteRealtime.current = true;

  console.log(
  "CAMBIO ESTADO"
);

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

    if (nuevoEstado === "Cobrado") {

  setPedidos(
    pedidos.filter(
      (pedido) =>
        pedido.id !== id
    )
  );

} else {

  setPedidos(
    pedidos.map(
      (pedido) =>
        pedido.id === id
          ? {
              ...pedido,
              estado: nuevoEstado
            }
          : pedido
    )
  );

}

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
const loadOrderItems = async () => {

  const { data, error } =
    await supabase
      .from("order_items")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {

    console.error(error);

  } else {

    setOrderItems(
      data || []
    );

    console.log(
  "ORDER ITEMS",
  data
);

  }

};

    loadPedidos();
    loadSolicitudes();
    loadProductos();
    loadOrderItems();

    console.log(
  "ORDER ITEMS",
  orderItems
);

    

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

  if (
    ignorarSiguienteRealtime.current
  ) {
     console.log(
    "REALTIME IGNORADO"
  );

    ignorarSiguienteRealtime.current =
      false;

    return;

  }
    if (
  audioActivoRef.current
) {

    const audio =
      new Audio(
        "/sounds/new-order.mp3"
      );

    console.log("SONIDO REALTIME");

audio.play().catch(
  console.error
);

  }


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
    
    const { data: items } =
  await supabase
    .from("order_items")
    .select("*");

setOrderItems(
  items || []
);

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

  useEffect(() => {

  console.log(
    "ORDER ITEMS",
    orderItems
  );

}, [orderItems]);

const marcarComoVisto = async (
  orderId: number
) => {

  const { error } =
    await supabase
      .from("order_items")
      .update({
        vista_camarero: true
      })
      
      .eq("order_id", orderId)
      .eq(
        "vista_camarero",
        false
      );
      await supabase
  .from("orders")
  .update({
    novedad: false
  })
  .eq("id", orderId);

  if (error) {

    console.error(error);

    return;

  }

  setOrderItems(
    orderItems.map(
      (item) =>
        item.order_id === orderId
          ? {
              ...item,
              vista_camarero: true
            }
          : item
    )
  );

};



 const añadirProductoMesa = async (
  producto: any
) => {

  if (!mesaSeleccionada) return;

  const batchId =
    Date.now().toString();

  const { error } =
    await supabase
      .from("order_items")
      .insert([
        {
          order_id:
            mesaSeleccionada.id,

          product_id:
            producto.id,

          product_name:
            producto.name,

          precio:
            producto.price,

          cantidad: 1,

          estado:
            "Pendiente",

          area:
            producto.area,

          restaurant_id: 1,

          batch_id:
            batchId,

          vista_camarero:
            false
        }
      ]);

  if (error) {

    console.error(error);

    return;

  }

  const nuevoTotal =
  Number(
    mesaSeleccionada.total || 0
  ) +
  Number(
    producto.price || 0
  );

await supabase
  .from("orders")
  .update({
    total: nuevoTotal
  })
  .eq(
    "id",
    mesaSeleccionada.id
  );

setPedidos(
  pedidos.map(
    (pedido) =>
      pedido.id ===
      mesaSeleccionada.id
        ? {
            ...pedido,
            total: nuevoTotal
          }
        : pedido
  )
);

setMesaSeleccionada(
  null
);

setMesaProductos(
  null
);

setBusquedaProducto(
  ""
);

  alert(
    `${producto.name} añadido`
  );

};
const crearMesa = async () => {

  if (!nuevaMesa) return;

  const { data: mesaExistente } =
    await supabase
      .from("orders")
      .select("id")
      .eq("mesa", nuevaMesa)
      .eq("cuenta_abierta", true)
      .maybeSingle();

  if (mesaExistente) {

    alert(
      `La mesa ${nuevaMesa} ya existe`
    );

    return;

  }

  const { data, error } =
    await supabase
      .from("orders")
      .insert([
        {
          restaurant_id: 1,
          mesa: nuevaMesa,
          pedido: [],
          total: 0,
          estado: "Pendiente",
          cuenta_abierta: true,
          novedad: false
        }
      ])
      .select();

  if (error) {

    console.error(error);

    return;

  }

  setPedidos([
    ...(data || []),
    ...pedidos
  ]);

  setNuevaMesa("");
  setMostrarNuevaMesa(false);

};

  return (

    <main className="p-6 w-full bg-[#0f0f0f] min-h-screen text-white">

      <div className="mb-4">

  <div className="flex justify-between items-center mb-4">

  <h1 className="text-xl font-bold">
    🍽️ Mesas Activas ({pedidos.length})
  </h1>

  <div className="mt-3">
  <button
    onClick={() =>
      setMostrarNuevaMesa(
        !mostrarNuevaMesa
      )
    }
    className="
      bg-green-600
      hover:bg-green-700
      px-4
      py-2
      rounded-xl
      font-semibold
    "
  >
    ➕ Nueva mesa
  </button>

  {
  mostrarNuevaMesa && (

    <div
      className="
        mt-3
        bg-zinc-800
        p-4
        rounded-xl
      "
    >

      <input
        type="number"
        placeholder="Número de mesa"
        value={nuevaMesa}
        onChange={(e) =>
          setNuevaMesa(
            e.target.value
          )
        }
        className="
          w-full
          p-2
          rounded-lg
          bg-zinc-900
          border
          border-zinc-700
        "
      />

      <button
  onClick={crearMesa}
  className="
    mt-3
    w-full
    bg-green-600
    py-2
    rounded-lg
    font-semibold
  "
>
  Crear mesa
</button>

    </div>

  )
}
</div>

  <div className="flex gap-2 text-sm font-semibold">

    <div className="bg-yellow-600 px-3 py-1 rounded-lg">
      🟡 {pedidosPendientes.length}
    </div>

    <div className="bg-orange-600 px-3 py-1 rounded-lg">
      🟠 {pedidosPreparando.length}
    </div>

    <div className="bg-green-600 px-3 py-1 rounded-lg">
      🟢 {pedidosServidos.length}
    </div>

    <button
  onClick={async () => {

    if (!audioActivo) {

      try {

        const audio =
          new Audio(
            "/sounds/new-order.mp3"
          );

        audio.volume = 0;

        await audio.play();

      } catch (error) {

        console.error(error);

      }

    }

   const nuevoEstado =
  !audioActivo;

setAudioActivo(
  nuevoEstado
);

audioActivoRef.current =
  nuevoEstado;

  }}
  className="
    bg-zinc-700
    px-3
    py-1
    rounded-lg
  "
>
  {audioActivo ? "🔔" : "🔇"}
</button>

  </div>

</div>

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



{vista === "pedidos" && (
          <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
          <div className="grid md:grid-cols-2 gap-4">
            

        {[...pedidos]
 .sort((a, b) => {

  const prioridad = {
    Pendiente: 1,
    Preparando: 2,
    Servido: 3
  };

  const estadoDiff =
    prioridad[
      a.estado as keyof typeof prioridad
    ] -
    prioridad[
      b.estado as keyof typeof prioridad
    ];

  if (estadoDiff !== 0) {
    return estadoDiff;
  }

  return a.mesa - b.mesa;

})
  .map((pedido) => (

          <div
            key={pedido.id}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              p-4
              "
          >

            <div className="flex justify-between mb-2">


                <h2 className="text-xl font-bold">
  Mesa {pedido.mesa}

  <span
  className="
    bg-red-600
    text-white
    text-xs
    px-2
    py-1
    rounded-full
    ml-2
  "
>
  +
  {
    orderItems.filter(
      (item) =>
        item.order_id === pedido.id &&
        item.vista_camarero === false
    ).length
  }
</span>
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



            

            

  


{
  orderItems.filter(
    (item) =>
      item.order_id === pedido.id &&
      item.vista_camarero === false
  ).length > 0 && (

    <div
      className="
        mt-4
        border-t
        border-red-600
        pt-3
      "
    >

      <div
        className="
          flex
          justify-between
          items-center
          mb-2
        "
      >

        <p
          className="
            text-red-500
            font-bold
          "
        >
          🆕 NUEVOS
        </p>

        <button
          onClick={() =>
            marcarComoVisto(
              pedido.id
            )
          }
          className="
            bg-green-600
            hover:bg-green-700
            px-2
            py-1
            rounded
            text-xs
          "
        >
          ✓ Visto
        </button>

      </div>

      {
        orderItems
          .filter(
            (item) =>
              item.order_id === pedido.id &&
              item.vista_camarero === false
          )
          .map((item) => (

            <p key={item.id}>
              • {item.product_name}
            </p>

          ))
      }

    </div>

  )
}
            <div className="mt-2 pt-2 border-t border-zinc-700">

              <p className="font-bold text-[#b9742d]">
                Total: {Number(
                  pedido.total
                ).toFixed(2)}€
              </p>

            </div>

            <button
  onClick={() =>
    setPedidoAbierto(
      pedidoAbierto === pedido.id
        ? null
        : pedido.id
    )
  }
  className="
    mt-3
    text-sm
    text-blue-400
    hover:text-blue-300
    font-semibold
  "
>
  {pedidoAbierto === pedido.id
    ? "▲ Ocultar pedido"
    : "▼ Ver pedido"}
</button>
<button
  onClick={() => {

    setBusquedaProducto("");

  setMesaSeleccionada(
    pedido
  );

  setMesaProductos(
    pedido.id
  );

}}
  className="
    mt-2
    text-sm
    text-green-400
    hover:text-green-300
    font-semibold
    block
  "
>
  {mesaProductos === pedido.id
    ? "➖ Ocultar productos"
    : "➕ Añadir producto"}
</button>

{
  mesaProductos === pedido.id && (
    <></>
  )
}



{
  pedidoAbierto === pedido.id && (

    <div className="mt-3">

      {
        orderItems
          .filter(
            (item) =>
              item.order_id === pedido.id
          )
          .map((item) => (

            <p key={item.id}>
              • {item.product_name}
            </p>

          ))
      }

    </div>

  )
}

          </div>

        ))}
        </div>
        </div>
        
        <div
  className="
  bg-zinc-900
  rounded-3xl
  p-6
  h-fit
  sticky
  top-4
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

        <div>

  <p>
    {producto.name}
  </p>

  <p className="text-xs text-gray-400">

    {producto.area === "barra"
      ? "🍺 Barra"
      : "🍳 Cocina"}

  </p>

</div>

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
{
  mesaSeleccionada && (

    <div
      className="
        fixed
        inset-0
        bg-black/70
        flex
        items-center
        justify-center
        z-50
      "
    >

      <div
        className="
          bg-zinc-900
          rounded-2xl
          p-6
          w-full
          max-w-xl
        "
      >

        <div
          className="
            flex
            justify-between
            items-center
            mb-4
          "
        >

          <h2 className="text-xl font-bold">
            ➕ Añadir producto
            a Mesa {
              mesaSeleccionada.mesa
            }
          </h2>

          <button
            onClick={() => {

              setMesaSeleccionada(
                null
              );

              setMesaProductos(
                null
              );

              setBusquedaProducto(
      ""
    );

            }}
            className="
              text-red-500
              font-bold
            "
          >
            ✕
          </button>

        </div>

        <input
  type="text"
  placeholder="🔍 Buscar producto..."
  value={busquedaProducto}
  onChange={(e) =>
    setBusquedaProducto(
      e.target.value
    )
  }
  className="
    w-full
    mb-4
    p-3
    rounded-xl
    bg-zinc-800
    border
    border-zinc-700
  "
/>
<div
  className="
    max-h-96
    overflow-y-auto
    space-y-2
  "
>

  {
    productos
      .filter(
        (producto) =>
          producto.name
            .toLowerCase()
            .includes(
              busquedaProducto.toLowerCase()
            )
      )
      .map(
        (producto) => (

          <button
            key={producto.id}
            onClick={() =>
  añadirProductoMesa(
    producto
  )
}
            
            
            className="
              w-full
              text-left
              p-3
              rounded-xl
              bg-zinc-800
              hover:bg-zinc-700
            "
          >
            {producto.name}
          </button>

        )
      )
  }

</div>

      </div>

    </div>

  )
}
    </main>

  );

}