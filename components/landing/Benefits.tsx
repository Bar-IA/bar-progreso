import {
  Route,
  TrendingUp,
  Smile,
  HeartHandshake,
  Wallet,
} from "lucide-react";

export default function Benefits() {
  const benefits = [
  {
    icon: <Route className="w-12 h-12 text-[#C46A2D]" />,
    title: "Menos desplazamientos",
    text: "Tu equipo dedica más tiempo a servir y menos a recorrer mesas.",
  },
  {
    icon: <TrendingUp className="w-12 h-12 text-[#C46A2D]" />,
    title: "Más ventas",
    text: "Los clientes piden más fácilmente una segunda ronda.",
  },
  {
    icon: <Smile className="w-12 h-12 text-[#C46A2D]" />,
    title: "Mejor experiencia",
    text: "Menos esperas y más comodidad para tus clientes.",
  },
  {
    icon: <HeartHandshake className="w-12 h-12 text-[#C46A2D]" />,
    title: "Menos estrés",
    text: "La carga de trabajo se reparte mejor durante el servicio.",
  },
  {
    icon: <Wallet className="w-12 h-12 text-[#C46A2D]" />,
    title: "Más rentabilidad",
    text: "El mismo equipo puede atender más mesas.",
  },
];

  return (
    <section className="bg-[#10251D] py-24 text-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            Lo que cambia en tu día a día
          </h2>

          <p className="mt-4 text-gray-300 text-lg">
            Resultados visibles desde el primer servicio.
          </p>

        </div>

        <div className="grid md:grid-cols-5 gap-8">

          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="text-center"
            >
              <div className="flex justify-center mb-5">
                {benefit.icon}
              </div>

              <h3 className="font-bold mb-3">
                {benefit.title}
              </h3>

              <p className="text-sm text-gray-300">
                {benefit.text}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}