import {
  Users,
  PersonStanding,
  HandPlatter,
  Clock3,
  Beer,
  UserRoundX,
} from "lucide-react";

const problems = [
  {
    icon: <Users className="w-12 h-12 text-[#C46A2D]" strokeWidth={1.75} />,
    title: "Clientes esperando",
    text: "Mesas listas para pedir sin encontrar al camarero.",
  },
  {
    icon: <HandPlatter className="w-12 h-12 text-[#C46A2D]" strokeWidth={1.75} />,
    title: "Camareros ocupados",
    text: "Gran parte del tiempo se pierde recorriendo mesas.",
  },
  {
    icon: <Clock3 className="w-12 h-12 text-[#C46A2D]" strokeWidth={1.75} />,
    title: "Horas punta",
    text: "Los pedidos se acumulan cuando más trabajo hay.",
  },
  {
    icon: <Beer className="w-12 h-12 text-[#C46A2D]" strokeWidth={1.75} />,
    title: "Segundas rondas perdidas",
    text: "Muchos clientes no vuelven a pedir por la espera.",
  },
  {
    icon: <UserRoundX className="w-12 h-12 text-[#C46A2D]" strokeWidth={1.75} />,
    title: "Falta de personal",
    text: "Cada empleado debe atender más mesas que antes.",
  },
];

export default function Problem() {
  return (
    <section className="bg-white py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold mb-6">
            El problema no es servir.
          </h2>

          <h3 className="text-4xl text-[#C46A2D] font-bold">
            El problema es llegar a tiempo.
          </h3>

          <p className="mt-6 text-lg text-gray-500">
            En la mayoría de bares ocurre lo mismo.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">

  {problems.map((problem) => (
    <div
      key={problem.title}
      className="
        bg-white
        rounded-3xl
        border
        border-gray-200
        p-5
        text-center
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      <div className="flex justify-center mb-4">
        {problem.icon}
      </div>

      <h4 className="font-semibold mb-3">
        {problem.title}
      </h4>

      <p className="text-sm text-gray-500 leading-relaxed">
        {problem.text}
      </p>
    </div>
  ))}

</div>
<p className="mt-16 text-center text-gray-500 text-lg">
  Todos estos problemas terminan provocando lo mismo:
</p>
        <div className="mt-20 bg-gradient-to-r from-[#10251D] to-[#173428] text-white rounded-[32px] p-14 text-center shadow-2xl">

          <p className="text-3xl font-medium">
            Cuando una mesa espera demasiado...
          </p>

          <p className="text-5xl font-bold mt-4 text-[#C46A2D]">
            consume menos.
          </p>

        </div>

      </div>

    </section>
  );
}