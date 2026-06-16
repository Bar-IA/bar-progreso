"use client";

import {
  useEffect,
  useState
} from "react";

import { supabase } from "@/lib/supabase";

export default function CartaPage() {

const [mesa, setMesa] = useState("Sin mesa");
const [
  restaurantId,
  setRestaurantId
] = useState<
  number | null
>(null);
const [categoria, setCategoria] =
useState("");

const [
  showModifiersModal,
  setShowModifiersModal
] = useState(false);

const [
  selectedProduct,
  setSelectedProduct
] = useState<any>(null);

const [
  modifierGroups,
  setModifierGroups
] = useState<any[]>([]);

const [
  modifierOptions,
  setModifierOptions
] = useState<any>({});

const [
  selectedModifiers,
  setSelectedModifiers
] = useState<any>({});

const [products, setProducts] =
useState<any[]>([]);

const [categorias, setCategorias] =
useState<any[]>([]);

const [estadoPedido, setEstadoPedido] =
  useState<string | null>(null);
const [cart, setCart] = useState<any[]>([]);
const [pedidoActivo, setPedidoActivo] =
  useState<any[]>([]);
  const [pedidoActual, setPedidoActual] =
  useState<any>(null);

  const [pedidoItems, setPedidoItems] =
  useState<any[]>([]);
  const [comentariosAbiertos,
  setComentariosAbiertos] =
useState<string[]>([]);

  const totalConsumido =
  pedidoItems.reduce(
    (acc, item) =>
      acc +
      (
        Number(item.precio || 0) *
        Number(item.cantidad || 1)
      ),
    0
  );

  const pedidoActivoAgrupado = Object.values(
  pedidoActivo.reduce((acc: any, item: any) => {

    if (!acc[item.name]) {

      acc[item.name] = {
        ...item,
        cantidad: 1
      };

    } else {

      acc[item.name].cantidad++;

    }

    return acc;

  }, {})
);

const pedidoActualAgrupado =
  Object.values(

    pedidoItems.reduce(
      (
        acc: any,
        item: any
      ) => {

        if (
          !acc[item.product_name]
        ) {

          acc[
            item.product_name
          ] = {

            name:
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

  );

const [openCart, setOpenCart] = useState(false);
useEffect(() => {

   if (!restaurantId)
    return;

  const loadProducts = async () => {

    const { data, error } = await supabase
  .from("products")
  .select("*")
  .eq(
    "restaurant_id",
    restaurantId
  )
  .eq(
    "active",
    true
  );
      
      

    console.log(data);
    console.log(error);

    if (data) {
      setProducts(data);
    }

  };

  const loadCategories =
  async () => {

    const { data, error } =
      await supabase
        .from("categories")
        .select("*")
        .eq(
  "restaurant_id",
  restaurantId
)
        .eq("active", true)
        .order("orden");

        console.log("DATA CATEGORIES", data);
console.log("ERROR CATEGORIES", error);

    if (error) {

      console.error(error);

    } else {

      setCategorias(
        data || []
      );
      console.log(
  "CATEGORIAS",
  data
);

      if (
        data &&
        data.length > 0
      ) {

        setCategoria(
          String(data[0].id)
        );

      }

    }

  };


  loadProducts();
  loadCategories();

  const channel = supabase
  .channel("products-realtime")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "products"
    },
    async () => {

      await loadProducts();

    }
  )
  .subscribe();

  return () => {

  supabase.removeChannel(
    channel
  );

};

}, [restaurantId]);


  useEffect(() => {

    

  const params = new URLSearchParams(
    window.location.search
  );

  const mesaUrl = params.get("mesa");

  const restaurantUrl =
  params.get(
    "restaurant"
  );

  console.log(
  "URL COMPLETA",
  window.location.href
);

console.log(
  "restaurant param",
  restaurantUrl
);

console.log(
  "restaurant localStorage",
  localStorage.getItem(
    "restaurant_id"
  )
);

  if (mesaUrl) {

    localStorage.setItem(
      "mesa",
      mesaUrl
    );
    if (restaurantUrl) {

  localStorage.setItem(
    "restaurant_id",
    restaurantUrl
  );

  setRestaurantId(
    Number(
      restaurantUrl
    )
  );

}

    localStorage.setItem(
      "mesa_timestamp",
      Date.now().toString()
    );

    setMesa(mesaUrl);

  } else {

    const mesaGuardada =
      localStorage.getItem("mesa");

      const restaurantGuardado =
  localStorage.getItem(
    "restaurant_id"
  );

if (
  restaurantGuardado
) {

  setRestaurantId(
    Number(
      restaurantGuardado
    )
  );

}

    const timestamp =
      localStorage.getItem(
        "mesa_timestamp"
      );

    if (
      mesaGuardada &&
      timestamp
    ) {

      const horas =
        (Date.now() -
          Number(timestamp))
        / 1000 / 60 / 60;

      if (horas < 4) {

        setMesa(mesaGuardada);

      } else {

        localStorage.removeItem(
          "mesa"
        );

        localStorage.removeItem(
          "mesa_timestamp"
        );

      }

    }

  }
 // const pedidoGuardado =
 // localStorage.getItem("pedido_activo");

// if (pedidoGuardado) {

 // setPedidoActivo(
  //  JSON.parse(pedidoGuardado)
 // );

//}

const pedidoId =
  localStorage.getItem(
    "pedido_id"
  );

  console.log("MESA ACTUAL", mesa);

  console.log(
  "RESTAURANT:",
  restaurantId
);

console.log(
  "PEDIDO ID",
  localStorage.getItem(
    "pedido_id"
  )
);

if (mesa !== "Sin mesa") {

  const cargarEstado =
    async () => {

     const { data, error } =
  await supabase
    .from("orders")
    .select("*")
    .eq("mesa", mesa)
    .eq("cuenta_abierta", true)
    .maybeSingle();

    console.log("MESA:", mesa);
console.log("DATA:", data);
console.log("ENTRA EN IF?", !!data);
console.log("ERROR:", error);
      if (data) {

  setEstadoPedido(
    data.estado
  );

  setPedidoActual(data);

  const { data: items } =
    await supabase
      .from("order_items")
      .select("*")
      .eq(
        "order_id",
        data.id
      );

  setPedidoItems(
    items || []
  );

}

    };

  cargarEstado();

  const channel = supabase
  .channel(
    `pedido-${pedidoId}`
  )
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "orders"
    },
    async (payload) => {

      if (
        payload.new.id ===
        Number(pedidoId)
      ) {
console.log("CLIENTE REALTIME", payload);
        setEstadoPedido(
          payload.new.estado
        );
        setPedidoActual(
  payload.new
);
if (
  payload.new.estado ===
    "Cobrado" ||
  payload.new.cuenta_abierta ===
    false
) {

  localStorage.removeItem(
    "pedido_id"
  );

  setPedidoActual(
    null
  );

  setPedidoItems([]);

  setEstadoPedido(
    null
  );

}

      }

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
  "REALTIME ORDER_ITEMS"
);

   const { data: pedido } =
  await supabase
    .from("orders")
    .select("id")
    .eq("mesa", mesa)
    .eq(
      "cuenta_abierta",
      true
    )
    .maybeSingle();

if (!pedido) return;

const { data: items } =
  await supabase
    .from("order_items")
    .select("*")
    .eq(
      "order_id",
      pedido.id
    );

setPedidoItems(
  items || []
);

    setPedidoItems(
      items || []
    );

  }
  
)
  .subscribe();

  return () => {

  supabase.removeChannel(
    channel
  );

};

}

}, [mesa]);


const addToCart = (item: any) => {

  setCart((prev) => [
    ...prev,
    {
      ...item,
      comentario: ""
    }
  ]);

};
const openProduct = async (
  product: any
) => {

  const { data: groups } =
    await supabase
      .from(
        "product_modifier_groups"
      )
      .select("*")
      .eq(
        "product_id",
        product.id
      );

  if (
    !groups ||
    groups.length === 0
  ) {

    addToCart(product);
    return;

  }

  const opciones: any = {};

  for (
    const group of groups
  ) {

    const {
      data
    } = await supabase
      .from(
        "product_modifiers"
      )
      .select("*")
      .eq(
        "group_id",
        group.id
      );

    opciones[group.id] =
      data || [];

  }

  setSelectedProduct(
    product
  );

  setModifierGroups(
    groups
  );

  setModifierOptions(
    opciones
  );

  setSelectedModifiers(
    {}
  );
alert(
  `Grupos encontrados: ${
    groups?.length || 0
  }`
);
  setShowModifiersModal(
    true
  );

};

const removeFromCart = (index: number) => {
  setCart(cart.filter((_, i) => i !== index));
};
const total = cart.reduce((acc, item) => {
  return acc + Number(item.price);
}, 0);

const modifiersTotal =
  Object.values(
    selectedModifiers
  ).reduce(
    (
      acc: number,
      value: any
    ) => {

      if (
        Array.isArray(value)
      ) {

        return (
          acc +
          value.reduce(
            (
              sum: number,
              item: any
            ) =>
              sum +
              Number(
                item.price || 0
              ),
            0
          )
        );

      }

      return (
        acc +
        Number(
          value?.price || 0
        )
      );

    },
    0
  );

  const productTotal =
  Number(
    selectedProduct?.price || 0
  ) + modifiersTotal;

const cartAgrupado = Object.values(
  cart.reduce((acc: any, item: any) => {

    if (!acc[item.name]) {

      acc[item.name] = {
        ...item,
        cantidad: 1
      };

    } else {

      acc[item.name].cantidad++;

    }

    return acc;

  }, {})
);




const items = products.filter(
  (product) =>
    String(
      product.category_id
    ) === categoria
);

console.log(
  "restaurantId:",
  restaurantId
);

console.log(
  "categorias:",
  categorias
);

console.log(
  "categoria seleccionada:",
  categoria
);

console.log(
  "products:",
  products.length
);

console.log(
  "items:",
  items.length
);

return ( <main>

  {/* HERO */}

  <section
    className="relative h-[50vh] bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2000')",
    }}
  >

    <div className="absolute inset-0 bg-black/70" />

    <div className="relative z-10 h-full flex flex-col items-center justify-center">

      <h1 className="text-6xl md:text-8xl font-black">
        CARTA
      </h1>

      <p className="text-gray-300 mt-4">
        Descubre todas nuestras especialidades
      </p>

    </div>

  </section>

  {/* CATEGORIAS */}

  <section className="max-w-7xl mx-auto px-6 py-16">

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">

      {categorias.map((cat) => (

        <button
          key={cat.id}
         onClick={() =>
  setCategoria(
    String(cat.id)
  )
}
          className={`
          rounded-3xl p-6 text-center transition-all
          ${
            categoria === cat.id
              ? "bg-[#b9742d]"
              : "bg-zinc-900 hover:bg-zinc-800"
          }
        `}
        >
          <div className="font-semibold">
  {cat.name}
</div>

        </button>

      ))}

    </div>

    <div className="grid md:grid-cols-2 gap-6">

      {items.map((item) => (

  <div
    key={item.name}
    className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 hover:border-[#b9742d] transition"
  >
    {item.image_url && (

  <img
    src={item.image_url}
    alt={item.name}
    className="
  w-full
  h-56
  object-cover
  rounded-2xl
  mb-4
  border
  border-zinc-800
"
  />

)}

    <div className="flex justify-between">

      <h3 className="font-bold text-xl">
        {item.name}
      </h3>

      <span className="text-[#b9742d] font-bold">
  {Number(item.price).toFixed(2)}€
</span>

    </div>

    {"description" in item && item.description && (
  <p className="text-gray-400 mt-3">
    {item.description}
  </p>
)}

    {(item.name === "Kyoto Angus Burger" ||
      item.name === "Pizza Trufada" ||
      item.name === "Nachos Progreso") && (

      <div className="mt-4">
        <span className="bg-[#b9742d] text-white text-xs px-3 py-1 rounded-full">
          ⭐ Más vendido
        </span>
      </div>

    )}

    <button
  onClick={() =>
  openProduct(item)
}
  className="mt-5 w-full bg-[#b9742d] hover:bg-[#c98237] py-3 rounded-xl font-semibold transition"
>
  Añadir al carrito
</button>



  </div>

))}

    </div>

  </section>

  {/* CTA IA */}

  <section className="py-20 text-center">

    <div className="max-w-4xl mx-auto px-6 bg-gradient-to-r from-[#b9742d] to-[#8f5c24] rounded-3xl p-10">

      <h2 className="text-4xl font-bold">
  Asistente Inteligente del Bar
</h2>

<p className="mt-4">
  Recomienda platos, responde dudas sobre la carta
  y permite realizar pedidos directamente desde la mesa.
</p>

      <p className="mt-4">
        Pregunta por ingredientes,
        recomendaciones o realiza reservas.
      </p>

    </div>

  </section>

{/* BURBUJA CARRITO */}

{mesa !== "Sin mesa" && (
<button
  onClick={() => setOpenCart(!openCart)}
  className="
    fixed
    bottom-24
    right-6
    z-50
    bg-[#b9742d]
    w-16
    h-16
    rounded-full
    text-2xl
    shadow-2xl
    flex
    items-center
    justify-center
  "
>
  🛒

  {cart.length > 0 && (
    <span
      className="
        absolute
        -top-2
        -right-2
        bg-red-600
        text-white
        w-7
        h-7
        rounded-full
        text-xs
        flex
        items-center
        justify-center
      "
    >
      {cart.length}
    </span>
  )}

</button>
)}

{/* PANEL CARRITO */}

{openCart && (

  <>

    <div
      className="
        fixed
        inset-0
        z-30
      "
      onClick={() => setOpenCart(false)}
    />

    <div
    className="
      fixed
      bottom-24
      right-6
      z-40
      bg-zinc-900
      border
      border-zinc-800
      rounded-3xl
      p-5
      w-80
      max-w-[90vw]
      shadow-2xl
    "
  >

    <h3 className="font-bold text-lg mb-4">
  Mesa {mesa}
</h3>

{pedidoActual && (

  <div className="mb-4 p-3 bg-zinc-800 rounded-xl">

    <p className="font-semibold mb-2">
      🟢 Pedido actual
    </p>

    {estadoPedido && (

  <div className="mb-3">

    <p
      className={`
        font-bold

        ${
          estadoPedido === "Pendiente"
            ? "text-yellow-500"

            : estadoPedido ===
              "Preparando"
            ? "text-orange-500"

            : "text-green-500"
        }
      `}
    >

      {estadoPedido ===
      "Pendiente"

        ? "🟡 Pedido recibido"

        : estadoPedido ===
          "Preparando"

        ? "🟠 Preparándose"

        : "🟢 Servido"}

    </p>

  </div>

)}

    {pedidoItems.map((item: any) => (

  <div
    key={item.id}
    className="
      flex
      justify-between
      text-sm
      mb-1
    "
  >

    <span>
      {item.product_name}
    </span>

    <span
      className={
        item.estado === "Pendiente"
          ? "text-yellow-500"
          : item.estado === "Preparando"
          ? "text-orange-500"
          : item.estado === "Listo"
          ? "text-green-500"
          : "text-zinc-400"
      }
    >
      {item.estado}
    </span>

  </div>

))}

    <div className="mt-3 pt-3 border-t border-zinc-700">

  <p className="font-bold text-[#b9742d]">
    Total consumido:
    {" "}
    {totalConsumido.toFixed(2)}€
  </p>

</div>

  </div>

)}

    {cart.length === 0 ? (

      <p className="text-gray-400">
        Tu carrito está vacío.
      </p>

    ) : (

      <div className="space-y-2 text-sm">

        {cartAgrupado.map((item: any, index) => (

  <div
    key={index}
    className="flex justify-between items-center"
  >

    <div>

  <p>
    {item.name}
    {item.cantidad > 1 &&
      ` x${item.cantidad}`}
  </p>

  {item.modifiers?.length > 0 && (

    <p
      className="
        text-xs
        text-zinc-400
        mt-1
      "
    >
      {item.modifiers
        .map(
          (m: any) => m.name
        )
        .join(" · ")}
    </p>

  )}
<button
  onClick={() => {

    if (
      comentariosAbiertos.includes(
        item.name
      )
    ) {

      setComentariosAbiertos(
        comentariosAbiertos.filter(
          c => c !== item.name
        )
      );

    } else {

      setComentariosAbiertos([
        ...comentariosAbiertos,
        item.name
      ]);

    }

  }}
  className="
    text-xs
    text-[#b9742d]
    mt-2
  "
>

  {
    comentariosAbiertos.includes(
      item.name
    )
      ? "▲ Ocultar comentario"
    : "▼ Añadir comentario"
  }

</button>
{comentariosAbiertos.includes(
  item.name
) && (

  <input
    type="text"
    placeholder="Comentario..."
    value={
      item.comentario || ""
    }
    onChange={(e) => {

      setCart(prev =>
        prev.map(p =>

          p.name === item.name
            ? {
                ...p,
                comentario:
                  e.target.value
              }
            : p

        )
      );

    }}
    className="
      mt-2
      w-full
      bg-zinc-800
      rounded-lg
      px-3
      py-2
      text-sm
    "
  />

)}
      <p className="text-[#b9742d] text-sm">
  {(Number(item.price) * item.cantidad).toFixed(2)}€
</p>
    </div>

    <div className="flex items-center gap-3">

  <button
    onClick={() => {

      const indice =
        cart.findIndex(
          p => p.name === item.name
        );

      if (indice === -1) return;

      setCart(
        cart.filter(
          (_, i) => i !== indice
        )
      );

    }}
    className="
      bg-zinc-800
      w-8
      h-8
      rounded-lg
      font-bold
    "
  >
    -
  </button>

  <span className="font-bold">
    {item.cantidad}
  </span>

  <button
    onClick={() => {

      setCart(prev => [
        ...prev,
        {
          ...item
        }
      ]);

    }}
    className="
      bg-[#b9742d]
      w-8
      h-8
      rounded-lg
      font-bold
    "
  >
    +
  </button>

</div>

  </div>

))}

      </div>

    )}

    <hr className="my-4 border-zinc-700" />

<div className="flex justify-between font-bold text-[#b9742d]">

  <span>Total</span>

  <span>
    {total.toFixed(2)}€
  </span>

</div>
    
    <button
  onClick={() => {

    if (!restaurantId) {

    alert(
      "Error: restaurante no identificado"
    );

    return;

  }

    const pedidoAgrupado = Object.values(
  cart.reduce((acc: any, item: any) => {

    if (!acc[item.name]) {

      acc[item.name] = {
        ...item,
        cantidad: 1
      };

    } else {

      acc[item.name].cantidad++;

    }

    return acc;

  }, {})
);
  const pedido = pedidoAgrupado
  .map((item: any) =>

    `• ${item.name}${
      item.cantidad > 1
        ? ` x${item.cantidad}`
        : ""
    } - ${(
      Number(item.price) *
      item.cantidad
    ).toFixed(2)}€`

  )
  .join("\n");

  const mensaje = encodeURIComponent(
`🍔 NUEVO PEDIDO

Mesa ${mesa}

${pedido}

Total: ${total.toFixed(2)}€

Enviado desde Bar IA`
);

 

  (async () => {

  const { data: cuentaAbierta } =
    await supabase
      .from("orders")
      .select("*")
      .eq("mesa",  mesa)
      .eq("cuenta_abierta", true)
      .single();
      console.log("CUENTA ABIERTA", cuentaAbierta);
console.log("MESA", mesa);


  if (!cuentaAbierta) {

    const { data, error } =
      await supabase
        .from("orders")
        .insert([
          {
            restaurant_id: restaurantId,
            mesa,
            pedido: cart,
            total,
            estado: "Pendiente",
            cuenta_abierta: true, 
            novedad: true
          }
        ])
        .select()
        .single();

    if (error) {

      console.error(error);

    } else {
      console.log("ENTRO EN ELSE");

      localStorage.setItem(
        "pedido_id",
        data.id.toString()
      );

     
      // window.location.reload();
      setPedidoActual(data);
setEstadoPedido(data.estado);

const batchId =
  Date.now().toString();

await supabase
  .from("order_items")
  .insert(

    cart.map((item) => ({
  order_id: data.id,
  product_id: item.id,
  product_name: item.name,
  precio: item.price,
  cantidad: 1,

  comentario:
  [
    item.comentario,

    ...(item.modifiers || [])
      .map(
        (m: any) =>
          m.name
      )

  ]
    .filter(Boolean)
    .join(" · "),

  estado: "Pendiente",
  area: item.area,
  restaurant_id: restaurantId,
  batch_id: batchId
}))

  );

    }

  } else {
    

    const pedidoActualizado = [
      ...cuentaAbierta.pedido,
      ...cart
    ];

    const nuevoTotal =
      Number(cuentaAbierta.total) +
      total;

    const { error } =
      await supabase
  .from("orders")
  .update({
    pedido: pedidoActualizado,
    total: nuevoTotal,
    estado: "Pendiente", 
    novedad: true
  })
        .eq(
          "id",
          cuentaAbierta.id
        );

    if (error) {

      console.error(error);

    } else {

      localStorage.setItem(
        "pedido_id",
        cuentaAbierta.id.toString()
      );

      setPedidoActual({
  ...cuentaAbierta,
  pedido: pedidoActualizado,
  total: nuevoTotal
});

const batchId =
  Date.now().toString();
const { data: itemsData, error: itemsError } =
  await supabase
    .from("order_items")
    .insert(

      cart.map((item) => ({
  order_id: cuentaAbierta.id,
  product_id: item.id,
  product_name: item.name,
  precio: item.price,
  cantidad: 1,

  comentario:
  [
    item.comentario,

    ...(item.modifiers || [])
      .map(
        (m: any) =>
          m.name
      )

  ]
    .filter(Boolean)
    .join(" · "),

  estado: "Pendiente",
  area: item.area,
  restaurant_id: restaurantId,
  batch_id: batchId
}))

    )
    .select();

console.log(
  "ITEMS DATA",
  itemsData
);

console.log(
  "ITEMS ERROR",
  itemsError
);

    }

  }

})();

//const pedidoAnterior =
  //JSON.parse(
    //localStorage.getItem(
      //</div>"pedido_activo"
//</>    ) || "[]"
//  );

//</main>const nuevoPedido = [
 // ...pedidoAnterior,
 // ...cart
//];

//setPedidoActivo(
 // nuevoPedido
//);

//localStorage.setItem(
//  "pedido_activo",
 // JSON.stringify(
 //   nuevoPedido
 // )
//);

setCart([]);

}}
  className="
    w-full
    mt-4
    bg-[#b9742d]
    py-3
    rounded-xl
    font-semibold
  "
>
  Confirmar Pedido
</button>

<button
  onClick={async () => {

    if (!restaurantId) {

  alert(
    "Error: restaurante no identificado"
  );

  return;

}

    const confirmar =
  confirm(
    `¿Llamar al camarero a la mesa ${mesa}?`
  );

if (!confirmar) return;

    const mensaje =
      encodeURIComponent(
        `🙋 Mesa ${mesa} solicita camarero`
      );
await supabase
  .from("solicitudes")
  .insert([
    {
      restaurant_id: restaurantId,
      mesa,
      tipo: "camarero"
    }
  ]);
   

  }}
  className="
    w-full
    mt-3
    bg-blue-600
    py-3
    rounded-xl
    font-semibold
  "
>
  🙋 Llamar camarero
</button>

<button
  onClick={async () => {

    if (!restaurantId) {

  alert(
    "Error: restaurante no identificado"
  );

  return;

}

    const confirmar =
  confirm(
    `¿Solicitar la cuenta para la mesa ${mesa}?`
  );

if (!confirmar) return;

    const mensaje =
      encodeURIComponent(
        `💰 Mesa ${mesa} solicita la cuenta`
      );
await supabase
  .from("solicitudes")
  .insert([
    {
      restaurant_id: restaurantId,
      mesa,
      tipo: "cuenta"
    }
  ]);
    

  }}
  className="
    w-full
    mt-3
    bg-green-600
    py-3
    rounded-xl
    font-semibold
  "
>
  💰 Pedir cuenta
</button>

  </div>

  </>

)}
{showModifiersModal && (

  <div
    className="
      fixed
      inset-0
      bg-black/80
      z-[999]
      flex
      items-center
      justify-center
      p-6
    "
  >

    <div
      className="
        bg-zinc-900
        rounded-3xl
        w-full
        max-w-xl
        p-8
      "
    >

      <h2
        className="
          text-3xl
          font-black
          mb-6
        "
      >
        {selectedProduct?.name}
      </h2>

      {modifierGroups.map(
        (group) => (

          <div
            key={group.id}
            className="mb-8"
          >

            <h3
  className="
    text-xs
    uppercase
    tracking-wider
    text-zinc-400
    mb-2
    font-semibold
  "
>
              {group.name}

              {group.required &&
                " *"}
            </h3>

            <div
  className="
    flex
    flex-wrap
    gap-2
  "
>

              {(
                modifierOptions[
                  group.id
                ] || []
              ).map(
                (option: any) => (

                  <button
  key={option.id}
  onClick={() => {

    if (group.multiple) {

  setSelectedModifiers(
    (prev: any) => {

      const actuales =
  Array.isArray(
    prev[group.id]
  )
    ? prev[group.id]
    : [];

      const existe =
        actuales.some(
          (m: any) =>
            m.id === option.id
        );

      return {

        ...prev,

        [group.id]:
          existe

            ? actuales.filter(
                (m: any) =>
                  m.id !== option.id
              )

            : [
                ...actuales,
                option
              ]

      };

    }
  );

} else {

  setSelectedModifiers(
    (prev: any) => ({

      ...prev,

      [group.id]:
        option

    })
  );

}

  }}
  className={`
    px-4
    py-2
    rounded-full
    border
    text-sm
    font-medium
    transition

    ${
  (
    group.multiple
      ? Array.isArray(
          selectedModifiers[group.id]
        ) &&
        selectedModifiers[
          group.id
        ].some(
          (m: any) =>
            m.id === option.id
        )
      : selectedModifiers[
          group.id
        ]?.id === option.id
  )
    ? `
        bg-[#b9742d]
        border-[#b9742d]
        text-white
      `
    : `
        bg-zinc-800
        border-zinc-700
        hover:bg-zinc-700
      `
}
  `}
>
                    {option.name}

                    {Number(
                      option.price
                    ) > 0 && (
                      <span
                        className="
                          text-green-400
                          ml-2
                        "
                      >
                        +{option.price}€
                      </span>
                    )}
                  </button>

                )
              )}

            </div>

          </div>

        )
      )}

      <button
  onClick={() => {

  const modifiers = Object.values(
    selectedModifiers
  ).flatMap(
    (value: any) =>

      Array.isArray(value)
        ? value
        : [value]
  );

  addToCart({

    ...selectedProduct,

    price: productTotal,

    modifiers

  });

  setShowModifiersModal(
    false
  );

}}
  className="
    w-full
    bg-[#b9742d]
    py-3
    rounded-xl
    font-bold
  "
>
  Añadir al carrito · {productTotal.toFixed(2)}€
</button>

    </div>

  </div>

)}
</main>

);
}
