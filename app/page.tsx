import Image from "next/image";
import MenuSection from "@/components/MenuSection";
import AISection from "@/components/AISection";

import { menu } from "@/data/menu";
import { business } from "@/data/business";

export default function Home() {
return ( <main className="bg-[#0f0f0f] text-white">

  {/* HERO */}

  <section className="relative min-h-screen">

    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000')",
      }}
    />

    <div className="absolute inset-0 bg-black/70" />

    <div className="relative z-10 max-w-7xl mx-auto px-6">

      

      <div className="flex items-center min-h-[75vh]">

        <div className="max-w-3xl">

          <span className="text-[#b9742d] uppercase tracking-[5px]">
            Plaza del Progreso · Jerez de la Frontera
          </span>

          <h1
  className="
    text-4xl
    sm:text-5xl
    md:text-8xl
    font-black
    leading-tight
    mt-6
    break-words
  "
>
            HAMBURGUESAS
            <br />
            PIZZAS Y
            <br />
            <span className="text-[#b9742d]">
              BUEN AMBIENTE
            </span>
          </h1>

          <p className="text-gray-300 text-xl mt-8 max-w-xl">
            {business.slogan}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">

            <a
              href="#carta"
              className="bg-[#b9742d] px-8 py-4 rounded-full font-semibold"
            >
              Ver Carta
            </a>

            <a
              href="#contacto"
              className="border border-white px-8 py-4 rounded-full"
            >
              Reservar Mesa
            </a>

          </div>

        </div>

      </div>

    </div>

  </section>

  {/* DESTACADOS */}

  <section className="py-24">

    <div className="max-w-7xl mx-auto px-6">

      <h2 className="text-center text-5xl font-bold mb-14">
        Lo Más Pedido
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="bg-zinc-900 rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200"
            className="h-64 w-full object-cover"
            alt=""
          />
          <div className="p-6">
            <h3 className="text-2xl font-bold">
              Kyoto Angus Burger
            </h3>
            <p className="text-gray-400 mt-2">
              BBQ, cebolla caramelizada y rulo de cabra.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=1200"
            className="h-64 w-full object-cover"
            alt=""
          />
          <div className="p-6">
            <h3 className="text-2xl font-bold">
              Nachos Progreso
            </h3>
            <p className="text-gray-400 mt-2">
              Carne, cheddar, jalapeños y guacamole.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200"
            className="h-64 w-full object-cover"
            alt=""
          />
          <div className="p-6">
            <h3 className="text-2xl font-bold">
              Pizza Trufada
            </h3>
            <p className="text-gray-400 mt-2">
              Trufa, mozzarella y cebolla caramelizada.
            </p>
          </div>
        </div>

      </div>

    </div>

  </section>

  {/* CARTA */}

  <section
    id="carta"
    className="max-w-7xl mx-auto px-6 py-24"
  >

    <h2 className="text-center text-5xl font-bold mb-16">
      Nuestra Carta
    </h2>

    <MenuSection
      title="🍔 Hamburguesas Angus"
      items={menu.burgers}
    />

    <MenuSection
      title="🍕 Pizzas Artesanales"
      items={menu.pizzas}
    />

    <MenuSection
      title="🍤 Tapas y Raciones"
      items={menu.tapas}
    />

    <div className="text-center mt-12">

      <a
        href="/carta"
        className="inline-block bg-[#b9742d] px-8 py-4 rounded-full font-semibold hover:opacity-90 transition"
      >
        Ver Carta Completa
      </a>

    </div>

  </section>

  {/* EXPERIENCIA */}

  <section className="py-24 bg-[#161616]">

    <div className="max-w-7xl mx-auto px-6 text-center">

      <h2 className="text-5xl font-bold">
        Tradición y sabor en pleno centro de Jerez
      </h2>

      <p className="text-gray-400 max-w-3xl mx-auto mt-6 text-lg">
        Un lugar para disfrutar de hamburguesas Angus,
        pizzas artesanales, tapas y buenos momentos.
      </p>

    </div>

  </section>

  <div id="ia">
    <AISection />
  </div>

{/* PEDIDOS DESDE LA MESA */}

<section className="py-24 bg-[#111111]">

  <div className="max-w-6xl mx-auto px-6">

    <div className="text-center mb-16">

      <span className="text-[#b9742d] uppercase tracking-wider">
        Tecnología para el cliente
      </span>

      <h2 className="text-5xl font-bold mt-4">
        Pide desde tu Mesa
      </h2>

      <p className="text-gray-400 max-w-2xl mx-auto mt-6">
        Escanea el código QR, consulta la carta,
        realiza tu pedido y recibe atención inmediata
        sin esperas.
      </p>

    </div>

    <div className="grid md:grid-cols-3 gap-8">

      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 hover:border-[#b9742d] transition">

        <div className="text-6xl">📱</div>

        <h3 className="mt-6 text-2xl font-bold">
          Escanea
        </h3>

        <p className="text-gray-400 mt-3">
          Accede a la carta digital directamente desde tu mesa.
        </p>

      </div>

      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 hover:border-[#b9742d] transition">

        <div className="text-6xl">🍔</div>

        <h3 className="mt-6 text-2xl font-bold">
          Pide
        </h3>

        <p className="text-gray-400 mt-3">
          Añade productos al carrito y realiza el pedido.
        </p>

      </div>

      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 hover:border-[#b9742d] transition">

        <div className="text-6xl">👨‍🍳</div>

        <h3 className="mt-6 text-2xl font-bold">
          Disfruta
        </h3>

        <p className="text-gray-400 mt-3">
          El pedido llega automáticamente a cocina.
        </p>

      </div>

    </div>

    <div className="mt-20 max-w-4xl mx-auto">

      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">

        <div className="bg-zinc-800 px-6 py-4 font-semibold">
          Mesa 5 · Pedido en curso
        </div>

        <div className="p-6 space-y-4">

          <div className="flex justify-between">
            <span>Kyoto Angus Burger</span>
            <span>8,50€</span>
          </div>

          <div className="flex justify-between">
            <span>Pizza Trufada</span>
            <span>14,00€</span>
          </div>

          <div className="flex justify-between">
            <span>Coca-Cola</span>
            <span>2,20€</span>
          </div>

          <hr className="border-zinc-700" />

          <div className="flex justify-between text-xl font-bold text-[#b9742d]">
            <span>Total</span>
            <span>24,70€</span>
          </div>

          <button
            disabled
            className="w-full bg-[#b9742d] py-4 rounded-xl font-bold mt-4"
          >
            Confirmar Pedido
          </button>

        </div>

      </div>

    </div>

  </div>

</section>

  {/* CONTACTO */}

  <section
    id="contacto"
    className="py-24"
  >

    <div className="max-w-5xl mx-auto text-center px-6">

      <h2 className="text-5xl font-bold">
        Reserva tu Mesa
      </h2>

      <p className="text-gray-400 mt-4">
        Contacta con nosotros y disfruta de la experiencia Progreso.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mt-10">

        <a
          href={`tel:${business.phone}`}
          className="bg-[#b9742d] px-8 py-4 rounded-full"
        >
          Llamar
        </a>

        <a
          href={`https://wa.me/${business.whatsapp}`}
          className="border border-white px-8 py-4 rounded-full"
        >
          WhatsApp
        </a>

      </div>

    </div>

  </section>

  <footer className="border-t border-zinc-800 py-10 text-center text-gray-500">
    © 2026 {business.name}
  </footer>

</main>

);
}
