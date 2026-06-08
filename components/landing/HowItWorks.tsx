import {
  QrCode,
  MenuSquare,
  ShoppingCart,
  MonitorSmartphone,
  HandPlatter,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Escanea el QR",
      text: "El cliente accede desde la mesa sin instalar ninguna aplicación.",
      icon: <QrCode className="w-12 h-12 text-[#C46A2D]" />,
    },
    {
      number: "2",
      title: "Consulta la carta",
      text: "Visualiza productos, precios y categorías desde cualquier móvil.",
      icon: <MenuSquare className="w-12 h-12 text-[#C46A2D]" />,

    },
    {
      number: "3",
      title: "Realiza el pedido",
      text: "Añade productos y envía el pedido en segundos.",
      icon: <ShoppingCart className="w-12 h-12 text-[#C46A2D]" />,

    },
    {
      number: "4",
      title: "Lo recibes al instante",
      text: "El pedido aparece automáticamente en tu panel.",
      icon: <MonitorSmartphone className="w-12 h-12 text-[#C46A2D]" />,

    },
    {
      number: "5",
      title: "Lo sirves",
      text: "Menos desplazamientos y más tiempo para atender.",
      icon: <HandPlatter className="w-12 h-12 text-[#C46A2D]" />,
    },
  ];

  return (
    <section id="comofunciona" className="bg-[#F8F5F0] py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            Así funciona A Pedir de Mesa
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Desde que el cliente se sienta hasta que recibe su pedido.
          </p>

        </div>

        <div className="grid md:grid-cols-5 gap-8">

          {steps.map((step, index) => (
  <div
    key={step.number}
    className="relative text-center"
  >
              <div className="w-14 h-14 rounded-full bg-[#C46A2D] shadow-lg text-white flex items-center justify-center mx-auto mb-6 font-bold">
                {step.number}
              </div>

              <div className="mb-4 flex justify-center">
                {step.icon}
              </div>

              <h3 className="font-bold mb-3">
                {step.title}
              </h3>

              <p className="text-sm text-gray-500">
                {step.text}
              </p>
              {index < steps.length - 1 && (
  <div className="hidden md:block absolute top-6 left-[70%] w-[60%] border-t-2 border-dashed border-[#C46A2D]/30" />
)}
            </div>
            
          ))}

        </div>

      </div>

    </section>
  );
}