import {
  CheckCircle2,
  Clock3,
} from "lucide-react";
export default function Roadmap() {
  
const availableNow = [
  "Pedidos desde mesa",
  "Panel en tiempo real",
  "QR por mesa",
  "Control de estados",
  "Notificaciones sonoras",

];

const comingSoon = [
  "Gestión de mesas",
  "Integración TPV",
  "Comandas de cocina",
  "Análisis de ventas",
  "Gestion de clientes",
  "Automatizaciones",
];


  return (
    <section className="py-28 bg-[#F8F5F0]">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">

          <p className="text-[#C46A2D] font-semibold uppercase tracking-wider mb-4">
            Nuestra visión
          </p>

          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Hoy es un sistema de pedidos.
            <br />
            Mañana será tu centro operativo.
          </h2>

          <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto">
            Empezamos por los pedidos desde mesa.
            Estamos construyendo una plataforma completa para la gestión diaria de bares y restaurantes.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

  {/* Disponible hoy */}

  <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">

    <div className="flex items-center gap-3 mb-8">

      <CheckCircle2
        className="w-8 h-8 text-green-600"
        strokeWidth={2}
      />

      <h3 className="text-2xl font-bold">
        Disponible hoy
      </h3>

    </div>

    <div className="space-y-4">

      {availableNow.map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 py-1"
        >
          <CheckCircle2
            className="w-5 h-5 text-green-600"
          />

          <span>{item}</span>
        </div>
      ))}

    </div>

  </div>

  {/* Próximamente */}

  <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">

    <div className="flex items-center gap-3 mb-8">

      <Clock3
        className="w-8 h-8 text-[#C46A2D]"
        strokeWidth={2}
      />

      <h3 className="text-2xl font-bold">
        Próximamente
      </h3>

    </div>

    <div className="space-y-4">

      {comingSoon.map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 py-1"
        >
          <Clock3
            className="w-5 h-5 text-[#C46A2D]"
          />

          <span>{item}</span>
        </div>
      ))}

    </div>

  </div>

</div>

      </div>

    </section>
  );
}