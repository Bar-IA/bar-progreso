"use client";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  supabase
} from "@/lib/supabase";

export default function TPVPage() {

  
 const [
  orders,
  setOrders
] = useState<any[]>([]);

const [
  orderItems,
  setOrderItems
] = useState<any[]>([]);

const [
  products,
  setProducts
] = useState<any[]>([]);

const [
  categories,
  setCategories
] = useState<any[]>([]);

const [
  mesaSeleccionada,
  setMesaSeleccionada
] = useState<any>(null);

const [
  categoriaSeleccionada,
  setCategoriaSeleccionada
] =
useState<number | null>(
  null
);
const [
  now,
  setNow
] = useState(
  Date.now()
);

  useEffect(() => {

  cargarDatos();

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

const cargarDatos =
async () => {

  const {
  data: ordersData
} = await supabase
  .from("orders")
  .select("*")
  .eq(
    "cuenta_abierta",
    true
  )
  .order(
    "mesa",
    {
      ascending: true
    }
  );

  const {
    data: itemsData
  } = await supabase
    .from("order_items")
    .select("*");

  const {
    data: productsData
  } = await supabase
    .from("products")
    .select("*")
    .eq(
      "active",
      true
    )
    .order("orden");

  const {
    data: categoriesData
  } = await supabase
    .from("categories")
    .select("*")
    .order("orden");

  setOrders(
    ordersData || []
  );
  console.log(
  "ORDERS TPV",
  ordersData
);

  setOrderItems(
    itemsData || []
  );

  setProducts(
    productsData || []
  );

  setCategories(
    categoriesData || []
  );

  if (
    ordersData?.length &&
    !mesaSeleccionada
  ) {

    setMesaSeleccionada(
      ordersData[0]
    );

  }

  if (
    categoriesData?.length &&
    !categoriaSeleccionada
  ) {

    setCategoriaSeleccionada(
      categoriesData[0].id
    );

  }

};
const itemsMesa =
useMemo(() => {

  if (!mesaSeleccionada)
    return [];

  return orderItems.filter(
    (item) =>
      item.order_id ===
      mesaSeleccionada.id
  );

}, [
  mesaSeleccionada,
  orderItems
]);

const totalMesa =
itemsMesa.reduce(
  (acc, item) =>

    acc +

    Number(
      item.precio
    ) *

    Number(
      item.cantidad
    ),

  0
);

const productosFiltrados =
products.filter(
  (producto) =>

    producto.category_id ===
    categoriaSeleccionada
);


const calcularMinutos = (
  fecha: string
) => {

  return Math.floor(
    (
      now -
      new Date(
        fecha
      ).getTime()
    ) / 60000
  );

};

  return (

    <main
      className="
        min-h-screen
        bg-[#0b0b0d]
        text-white
      "
    >

      {/* HEADER */}

      <header
        className="
          h-24
          border-b
          border-white/5
          px-8
          flex
          items-center
          justify-between
          backdrop-blur-xl
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-black
              tracking-tight
            "
          >
            A PEDIR DE MESA
          </h1>

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            TPV
          </p>

        </div>

        <div
          className="
            flex
            gap-4
          "
        >

          <div
            className="
              bg-white/5
              border
              border-white/5
              rounded-3xl
              px-5
              py-3
            "
          >
            <p
              className="
                text-xs
                text-zinc-500
              "
            >
              Mesas abiertas
            </p>

            <p
              className="
                text-xl
                font-bold
              "
            >
              {orders.length}
            </p>

          </div>

          <div
            className="
              bg-white/5
              border
              border-white/5
              rounded-3xl
              px-5
              py-3
            "
          >
            <p
              className="
                text-xs
                text-zinc-500
              "
            >
              Facturación
            </p>

            <p
              className="
                text-xl
                font-bold
              "
            >
              1.248€
            </p>

          </div>

        </div>

      </header>

      {/* BODY */}

      <div
        className="
          h-[calc(100vh-96px)]
          grid
          grid-cols-[420px_1fr]
        "
      >

        {/* IZQUIERDA */}

        <aside
          className="
            border-r
            border-white/5
            p-6
          "
        >

          <div
            className="
              flex
              justify-between
              items-center
              mb-6
            "
          >

            <h2
              className="
                text-xl
                font-bold
              "
            >
              Mesas
            </h2>

            <button
              className="
                bg-[#b9742d]
                rounded-2xl
                px-4
                py-2
              "
            >
              +
            </button>

          </div>

          <div
  className="
    grid
    grid-cols-3
    gap-3
  "
>

            {orders.map((mesa) => (

              <button
                key={mesa.id}
                onClick={() =>
                  setMesaSeleccionada(
                    mesa
                  )
                }
                className={`
                  rounded-3xl
                  p-2
                  transition-all

                  ${
                    mesaSeleccionada?.id ===
mesa.id

                    ? `
                      bg-[#b9742d]
                      scale-[1.03]
                    `

                    : `
                      bg-white/[0.03]
                      hover:bg-white/[0.05]
                    `
                  }
                `}
              >

                <p
                  className="
                    text-left
                    text-base
                    font-bold
                  "
                >
                  Mesa {mesa.mesa}
                </p>
<p
  className="
    text-xs
    text-zinc-400
    mt-1
  "
>
  {
    orderItems.filter(
      item =>
        item.order_id ===
        mesa.id
    ).length
  } art.
</p>
                <p
                  className="
                    text-left
                    mt-1
                    text-sm
                    opacity-70
                  "
                >
                  {Number(
  mesa.total || 0
).toFixed(2)}€
                </p>

              </button>

            ))}

          </div>

        </aside>

        {/* DERECHA */}

        <section
          className="
            p-6
            flex
            flex-col
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-6
            "
          >

            <div
  className="
    flex
    items-center
    gap-4
  "
>

  <div
    className="
      w-14
      h-14
      rounded-3xl
      bg-[#b9742d]/20
      flex
      items-center
      justify-center
      text-2xl
    "
  >
    🍽️
  </div>

  <div>

    <h2
      className="
        text-4xl
        font-black
      "
    >
      Mesa {mesaSeleccionada?.mesa || "-"}
    </h2>

    <div
  className="
    flex
    items-center
    gap-2
    mt-1
  "
>

  <div
    className="
      w-2
      h-2
      rounded-full
      bg-orange-500
    "
  />

  <span
    className="
      text-sm
      text-zinc-400
    "
  >
    {mesaSeleccionada?.estado || "Pendiente"}
  </span>

</div>

  </div>

</div>

<div
  className="
    flex
    items-center
    gap-4
  "
>

  <div
    className="
      text-right
    "
  >

    <p
      className="
        text-zinc-500
      "
    >
      Total
    </p>

    <p
      className="
        text-5xl
        font-black
        text-[#d8934c]
      "
    >
      {totalMesa.toFixed(2)}€
    </p>

  </div>

  <button
    className="
      bg-[#b9742d]
      hover:scale-105
      transition-all
      px-6
      py-4
      rounded-3xl
      font-bold
      shadow-lg
      shadow-[#b9742d]/20
    "
  >
    💰 COBRAR
  </button>

</div>

          </div>

          <div
  className="
    flex-1
    grid
    grid-cols-[1.1fr_420px]
    gap-6
  "
>

  {/* COMANDA */}

  <div
    className="
      bg-white/[0.03]
      rounded-[32px]
      border
      border-white/5
      p-6
      overflow-hidden
      flex
      flex-col
    "
  >

    <div
      className="
        flex
        justify-between
        items-center
        mb-6
      "
    >

      <div>

  <h3
    className="
      text-2xl
      font-bold
    "
  >
    Comanda
  </h3>

  <p
    className="
      text-sm
      text-zinc-500
      mt-1
    "
  >
    {itemsMesa.length} artículos
  </p>

</div>

      <div
        className="
          bg-[#b9742d]/20
          text-[#d8934c]
          px-4
          py-2
          rounded-2xl
          text-sm
          font-semibold
        "
      >
        {mesaSeleccionada?.estado || "Pendiente"}
      </div>

    </div>

    <div
      className="
        flex-1
        overflow-y-auto
        space-y-0
      "
    >

      {itemsMesa.map(
  (item) => (

    <div
      key={item.id}
      className="
        flex
        items-center
        justify-between
        px-3
        py-1.5
        border-b
        border-white/5
        group
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
          min-w-0
        "
      >

        <span
          className="
            truncate
            text-sm
            font-medium
          "
        >
          {item.product_name}
        </span>

      </div>

      <div
        className="
          flex
          items-center
          gap-4
          shrink-0
        "
      >

        <span
          className="
            text-xs
            text-zinc-400
          "
        >
          x{item.cantidad}
        </span>

        <span
          className="
            text-sm
            font-semibold
          "
        >
          {(
            Number(item.precio) *
            Number(item.cantidad)
          ).toFixed(2)}€
        </span>

        <div
          className="
            flex
            gap-2
            opacity-0
            group-hover:opacity-100
            transition
          "
        >

          <button
            className="
              text-zinc-400
              hover:text-white
            "
          >
            ✏️
          </button>

          <button
            className="
              text-zinc-400
              hover:text-red-400
            "
          >
            🗑️
          </button>

        </div>

      </div>

    </div>

  )
)}

    </div>

    {/* TOTAL */}

    <div
      className="
        mt-6
        pt-6
        border-t
        border-white/5
      "
    >

      <div
        className="
          flex
          justify-between
          items-center
        "
      >

        <div>

          <p
            className="
              text-zinc-500
            "
          >
            Total
          </p>

          <div
  className="
    mt-4
    flex
    justify-between
    items-center
  "
>

 <p
  className="
    text-sm
    opacity-80
  "
>
  {totalMesa.toFixed(2)}€
</p>

  <div
    className="
      w-3
      h-3
      rounded-full
      bg-green-500
    "
  />

</div>

        </div>

        <button
          className="
            bg-[#b9742d]
            hover:scale-105
            transition
            px-8
            py-5
            rounded-3xl
            text-xl
            font-bold
          "
        >
          💰 Cobrar
        </button>

      </div>

    </div>

  </div>

  {/* PRODUCTOS */}

  <div
    className="
      flex
      flex-col
      gap-4
    "
  >

    <div
      className="
        bg-gradient-to-br
from-white/[0.05]
to-white/[0.02]
        border
        border-white/5
        rounded-[32px]
        p-5
      "
    >

      <h3
        className="
          text-xl
          font-bold
          mb-4
        "
      >
        Categorías
      </h3>

      <div
        className="
          flex
          flex-wrap
          gap-2
        "
      >

        {categories.map(
  (categoria) => (

    <button
      key={categoria.id}
      onClick={() =>
        setCategoriaSeleccionada(
          categoria.id
        )
      }
      className={`
        rounded-2xl
        px-4
        py-2
        transition

        ${
          categoriaSeleccionada ===
          categoria.id

          ? "bg-[#b9742d]"

          : "bg-white/[0.05]"
        }
      `}
    >
      {categoria.name}
    </button>

  )
)}

      </div>

    </div>

    <div
      className="
        flex-1
        overflow-y-auto
        grid
        grid-cols-2
        gap-3
      "
    >

      {productosFiltrados.map(
  (producto) => (

    <button
      key={producto.id}
      className="
        bg-gradient-to-br
        from-white/[0.05]
        to-white/[0.02]
        border
        border-white/5
        rounded-3xl
        p-5
        text-left
        hover:bg-white/[0.05]
        hover:scale-[1.02]
        transition
      "
    >

      <p
        className="
          font-semibold
        "
      >
        {producto.name}
      </p>

      <p
        className="
          text-zinc-500
          text-sm
          mt-1
        "
      >
        {producto.category}
      </p>

      <p
        className="
          text-[#d8934c]
          text-3xl
          font-black
          mt-6
        "
      >
        {Number(
          producto.price
        ).toFixed(2)}€
      </p>

    </button>

  )
)}

    </div>

  </div>

</div>

        </section>

      </div>

    </main>

  );

}