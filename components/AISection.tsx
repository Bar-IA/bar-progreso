import { Bot, Send } from "lucide-react";

export default function AISection() {
return ( <section className="py-24 bg-[#151515]">

  <div className="max-w-6xl mx-auto px-6">

    <div className="text-center mb-16">

      <span className="text-[#b9742d] uppercase tracking-wider">
        Asistente Inteligente
      </span>

      <h2 className="text-5xl font-bold mt-4">
        Tu camarero digital
      </h2>

      <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
        Consulta la carta, descubre recomendaciones,
        resuelve dudas y realiza pedidos directamente
        desde tu mesa.
      </p>

    </div>

    <div className="max-w-3xl mx-auto bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">

      <div className="bg-zinc-800 px-6 py-4 flex items-center gap-3">

        <Bot className="text-[#b9742d]" />

        <span className="font-semibold">
          Asistente Bar Progreso
        </span>

      </div>

      <div className="p-6 space-y-5">

        <div className="flex justify-end">

          <div className="bg-[#b9742d] rounded-2xl px-4 py-3 max-w-xs">
            ¿Qué hamburguesa me recomiendas?
          </div>

        </div>

        <div className="flex">

          <div className="bg-zinc-800 rounded-2xl px-4 py-3 max-w-md">
            La Kyoto Angus Burger es una de las favoritas.
            Lleva salsa BBQ, cebolla caramelizada y rulo de cabra.
          </div>

        </div>

        <div className="flex justify-end">

          <div className="bg-[#b9742d] rounded-2xl px-4 py-3 max-w-xs">
            Añádela a mi pedido.
          </div>

        </div>

        <div className="flex">

          <div className="bg-zinc-800 rounded-2xl px-4 py-3 max-w-md">
            ✅ Añadida al pedido.

            <div className="mt-3 text-sm text-green-400">
              Mesa 5 · Pedido actualizado
            </div>
          </div>

        </div>

      </div>

      <div className="border-t border-zinc-800 p-4 flex gap-3">

        <input
          disabled
          placeholder="Escribe tu mensaje..."
          className="flex-1 bg-zinc-800 rounded-full px-4 py-3 text-sm"
        />

        <button
          disabled
          className="bg-[#b9742d] p-3 rounded-full"
        >
          <Send size={18} />
        </button>

      </div>

    </div>

  </div>

</section>

);
}
