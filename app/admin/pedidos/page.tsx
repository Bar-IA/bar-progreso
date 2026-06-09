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

  const [mesaEditar, setMesaEditar] =
  useState<any>(null);

const [nuevoNumeroMesa, setNuevoNumeroMesa] =
  useState("");
  const [productoSeleccionado, setProductoSeleccionado] =
  useState<any>(null);
  const [cantidadProducto, setCantidadProducto] =
  useState(1);

    const [solicitudes, setSolicitudes] =
  useState<any[]>([]);

  const [vista, setVista] =
  useState("pedidos");

  const [productos, setProductos] =
  useState<any[]>([]);
  const [orderItems, setOrderItems] =
  useState<any[]>([]);

  const [listos, setListos] =
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

.on(
  
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "order_items"
  },
  async () => {
    console.log(
  "🔥 ORDER_ITEMS EVENT"
);

    const { data } =
      await supabase
        .from("order_items")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    setOrderItems(
  data || []
);

console.log(
  "LISTOS",
  (data || []).filter(
    (item) =>
      item.estado === "Listo"
  )
);

console.log(
  "ESTADOS",
  (data || []).map(
    (item) => item.estado
  )
);

  }
)

.on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "products"
  },
  async () => {

    const { data } =
      await supabase
        .from("products")
        .select("*")
        .eq(
          "restaurant_id",
          1
        )
        .order("name");

    setProductos(
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

  const tieneListo = (
  pedidoId: number
) => {

  return orderItems.some(
    (item) =>
      item.order_id === pedidoId &&
      item.estado === "Listo"
  );

};

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

const marcarEntregado = async (
  orderId: number,
  area: string
) => {

  const { error } =
    await supabase
      .from("order_items")
      .update({
        estado: "Entregado"
      })
      .eq(
        "order_id",
        orderId
      )
      .eq(
        "area",
        area
      )
      .eq(
        "estado",
        "Listo"
      );

  if (error) {

    console.error(error);

    return;

  }

  setOrderItems(
    orderItems.map(
      (item) =>

        item.order_id === orderId &&
        item.area === area &&
        item.estado === "Listo"

          ? {
              ...item,
              estado:
                "Entregado"
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

          cantidad: cantidadProducto,

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
  (
    Number(
      producto.price || 0
    ) *
    cantidadProducto
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

setProductoSeleccionado(
  null
);

setCantidadProducto(
  1
);

  alert(
    `${producto.name} añadido`
  );

};
const eliminarProductoMesa = async (
  pedidoId: number,
  nombreProducto: string
) => {

  const item =
    orderItems.find(
      (i) =>
        i.order_id === pedidoId &&
        i.product_name === nombreProducto
    );

  if (!item) return;

  if (
    (item.cantidad || 1) > 1
  ) {

    await supabase
      .from("order_items")
      .update({
        cantidad:
          item.cantidad - 1
      })
      .eq("id", item.id);

  } else {

    await supabase
      .from("order_items")
      .delete()
      .eq("id", item.id);

  }
  const pedido =
  pedidos.find(
    (p) => p.id === pedidoId
  );

if (!pedido) return;

const nuevoTotal =
  Math.max(
    0,
    Number(pedido.total) -
      Number(item.precio)
  );

await supabase
  .from("orders")
  .update({
    total: nuevoTotal
  })
  .eq("id", pedidoId);

setPedidos(
  pedidos.map((p) =>
    p.id === pedidoId
      ? {
          ...p,
          total: nuevoTotal
        }
      : p
  )
);

};
const cambiarMesa = async () => {

  if (!mesaEditar) return;

  const { data: mesaExistente } =
    await supabase
      .from("orders")
      .select("id")
      .eq(
        "mesa",
        nuevoNumeroMesa
      )
      .eq(
        "cuenta_abierta",
        true
      )
      .neq(
        "id",
        mesaEditar.id
      )
      .maybeSingle();

  if (mesaExistente) {

    alert(
      `La mesa ${nuevoNumeroMesa} ya está ocupada`
    );

    return;

  }

  const { error } =
    await supabase
      .from("orders")
      .update({
        mesa:
          nuevoNumeroMesa
      })
      .eq(
        "id",
        mesaEditar.id
      );

  if (error) {

    console.error(error);

    return;

  }

  setPedidos(
    pedidos.map(
      (pedido) =>
        pedido.id ===
        mesaEditar.id
          ? {
              ...pedido,
              mesa:
                nuevoNumeroMesa
            }
          : pedido
    )
  );

  setMesaEditar(
    null
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


{
  productos.filter(
    p => !p.active
  ).length > 0 && (

    <div
      className="
        w-full
        bg-red-900/30
        border-b
        border-red-600
        px-4
        py-2
        mb-4
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          text-sm
        "
      >

        <span
          className="
            text-red-400
            font-bold
            whitespace-nowrap
          "
        >
          🚫 AGOTADOS:
        </span>

        <div
          className="
            overflow-hidden
            text-red-200
          "
        >
          {
            productos
              .filter(
                p => !p.active
              )
              .map(
                p => p.name
              )
              .join(" • ")
          }
        </div>

      </div>

    </div>

  )
}
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
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            

        {[...pedidos]
        
 .sort((a, b) => {

  if (
  tieneListo(a.id) &&
  !tieneListo(b.id)
) {
  return -1;
}

if (
  !tieneListo(a.id) &&
  tieneListo(b.id)
) {
  return 1;
}

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
  className={`
    rounded-xl
    p-2
    border

    ${
      orderItems.some(
        (item) =>
          item.order_id === pedido.id &&
          item.estado === "Listo"
      )
        ? "bg-green-900 border-green-500"

        : "bg-zinc-900 border-zinc-800"
    }
  `}
>

            <div className="flex justify-between mb-2">


                <h2 className="text-base font-bold">
  Mesa {pedido.mesa}

 {
  orderItems.filter(
    (item) =>
      item.order_id === pedido.id &&
      item.vista_camarero === false
  ).length > 0 && (

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

  )
}
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

              <div className="mb-2 space-y-1">

  {
    orderItems.some(
      (item) =>
        item.order_id === pedido.id &&
        item.estado === "Listo" &&
        item.area === "cocina"
    ) && (

      <button
  onClick={() =>
    marcarEntregado(
      pedido.id,
      "cocina"
    )
  }
  className="
    w-full
    bg-orange-600
    text-white
    text-center
    text-xs
    font-bold
    py-1
    rounded-lg
  "
>
  🍔 COMIDA LISTA
</button>

    )
  }

  {
    orderItems.some(
      (item) =>
        item.order_id === pedido.id &&
        item.estado === "Listo" &&
        item.area === "barra"
    ) && (

      <button
  onClick={() =>
    marcarEntregado(
      pedido.id,
      "barra"
    )
  }
  className="
    w-full
    bg-blue-600
    text-white
    text-center
    text-xs
    font-bold
    py-1
    rounded-lg
  "
>
  🍺 BEBIDA LISTA
</button>

    )
  }

</div>

              

{/*

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
*/}

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

  {
    item.cantidad > 1
      ? ` x${item.cantidad}`
      : ""
  }
</p>

          ))
      }

    </div>

  )
}
            <div className="mt-2 pt-2 border-t border-zinc-700">

              <p className="text-sm font-bold text-[#b9742d]">
                Total: {Number(
                  pedido.total
                ).toFixed(2)}€
              </p>

            </div>

            

<div
  className="
    flex
    gap-2
    mt-2
  "
>

  <button
  onClick={() =>
    setPedidoAbierto(
      pedidoAbierto === pedido.id
        ? null
        : pedido.id
    )
  }
  className="
  bg-zinc-800
  hover:bg-zinc-700
  rounded-lg
  w-8
  h-8
  flex
  items-center
  justify-center
"
>
  {pedidoAbierto === pedido.id
  ? "📋"
  : "📋"}
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
  bg-zinc-800
  hover:bg-zinc-700
  rounded-lg
  w-8
  h-8
  flex
  items-center
  justify-center
"
>

  
  {mesaProductos === pedido.id
    ? "➖ Ocultar productos"
    : "➕"}
</button>

<button
  onClick={() => {

    setMesaEditar(
      pedido
    );

    setNuevoNumeroMesa(
      pedido.mesa
    );

  }}
  className="
  bg-zinc-800
  hover:bg-zinc-700
  rounded-lg
  w-8
  h-8
  flex
  items-center
  justify-center
"
>
  📝
</button>
</div>

{
  mesaProductos === pedido.id && (
    <></>
  )
}



{
  pedidoAbierto === pedido.id && (

    <div className="mt-3">

      {
  Object.values(

    orderItems
      .filter(
        (item) =>
          item.order_id === pedido.id
      )
      .reduce(
        (acc: any, item: any) => {

          if (
            !acc[item.product_name]
          ) {

            acc[item.product_name] = {
              nombre:
                item.product_name,

              cantidad:
                item.cantidad || 1
            };

          } else {

            acc[
              item.product_name
            ].cantidad +=
              item.cantidad || 1;

          }

          return acc;

        },
        {}
      )

  ).map((producto: any) => (

    <div
  key={producto.nombre}
  className="
    flex
    justify-between
    items-center
    py-1
  "
>

  <p
  className="
    text-xs
    truncate
    flex-1
  "
>
  {producto.nombre}

  {
    producto.cantidad > 1
      ? ` x${producto.cantidad}`
      : ""
  }
</p>

  <button
    onClick={() =>
      eliminarProductoMesa(
        pedido.id,
        producto.nombre
      )
    }
    className="
      text-red-500
      hover:text-red-400
      font-bold
      px-2
    "
  >
    🗑️
  </button>

</div>

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

          <h2 className="text-base font-bold">
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
           onClick={() => {

  setProductoSeleccionado(
    producto
  );

  setCantidadProducto(
    1
  );

}}

            
            
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

  {
  productoSeleccionado && (

    <div
      className="
        mt-4
        border-t
        border-zinc-700
        pt-4
      "
    >

      <p className="font-bold mb-3">
        {productoSeleccionado.name}
      </p>

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <button
          onClick={() =>
            setCantidadProducto(
              Math.max(
                1,
                cantidadProducto - 1
              )
            )
          }
          className="
            bg-zinc-700
            px-3
            py-2
            rounded-lg
          "
        >
          -
        </button>

        <span
          className="
            text-xl
            font-bold
          "
        >
          {cantidadProducto}
        </span>

        <button
          onClick={() =>
            setCantidadProducto(
              cantidadProducto + 1
            )
          }
          className="
            bg-zinc-700
            px-3
            py-2
            rounded-lg
          "
        >
          +
        </button>

      </div>

      <button
  onClick={() =>
    añadirProductoMesa(
      productoSeleccionado
    )
  }
  className="
    mt-4
    w-full
    bg-green-600
    hover:bg-green-700
    py-3
    rounded-xl
    font-semibold
  "
>
  Añadir a la mesa
</button>

    </div>

  )
}

</div>

      </div>

  

  )
}

{
  mesaEditar && (

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
          max-w-md
        "
      >

        <h2
          className="
            text-xl
            font-bold
            mb-4
          "
        >
          📝 Cambiar mesa
        </h2>

        <input
          type="number"
          value={nuevoNumeroMesa}
          onChange={(e) =>
            setNuevoNumeroMesa(
              e.target.value
            )
          }
          className="
            w-full
            p-3
            rounded-xl
            bg-zinc-800
            border
            border-zinc-700
          "
        />
<button
  onClick={cambiarMesa}
  className="
    w-full
    bg-green-600
    hover:bg-green-700
    py-3
    rounded-xl
    font-semibold
  "
>
  Guardar cambios
</button>
        <button
          onClick={() =>
            setMesaEditar(
              null
            )
          }
          className="
            mt-4
            w-full
            bg-red-600
            py-3
            rounded-xl
          "
        >
          Cancelar
        </button>

      </div>

    </div>

  )
}
    </main>

  );

}