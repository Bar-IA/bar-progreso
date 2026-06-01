"use client";

import { useState } from "react";
import { fullMenu } from "@/data/fullMenu";

export default function CartaPage() {
const [categoria, setCategoria] =
useState("burgers");

const categorias = [
{
id: "burgers",
nombre: "🍔 Hamburguesas",
},
{
id: "pizzas",
nombre: "🍕 Pizzas",
},
{
id: "tapas",
nombre: "🍤 Tapas",
},
{
id: "patatas",
nombre: "🍟 Patatas",
},
];

const items =
fullMenu[categoria as keyof typeof fullMenu];

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
            setCategoria(cat.id)
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
          <div className="text-3xl mb-2">
            {cat.nombre.split(" ")[0]}
          </div>

          <div>
            {cat.nombre.replace(
              cat.nombre.split(" ")[0],
              ""
            )}
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

    <div className="flex justify-between">

      <h3 className="font-bold text-xl">
        {item.name}
      </h3>

      <span className="text-[#b9742d] font-bold">
        {item.price}
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

{/* CARRITO */}

<div className="fixed bottom-6 right-6 z-50">

  <button
    className="
      bg-white
      text-black
      px-6
      py-4
      rounded-full
      shadow-2xl
      font-bold
      hover:scale-105
      transition
    "
  >
    🛒 Carrito (3)
  </button>

</div>

<div className="fixed bottom-24 right-6 z-40">

  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 w-72 shadow-2xl">

    <h3 className="font-bold text-lg mb-4">
      Mesa 5
    </h3>

    <div className="space-y-2 text-sm">

      <div className="flex justify-between">
        <span>Kyoto Angus Burger</span>
        <span>8,50€</span>
      </div>

      <div className="flex justify-between">
        <span>Pizza Trufada</span>
        <span>14€</span>
      </div>

      <div className="flex justify-between">
        <span>Coca-Cola</span>
        <span>2,20€</span>
      </div>

    </div>

    <hr className="my-4 border-zinc-700" />

    <div className="flex justify-between font-bold text-[#b9742d]">
      <span>Total</span>
      <span>24,70€</span>
    </div>

    <button
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

  </div>

</div>

</main>

);
}
