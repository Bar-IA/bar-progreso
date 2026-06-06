"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "¿Necesitan instalar alguna aplicación los clientes?",
      answer:
        "No. Los clientes simplemente escanean el código QR de la mesa y acceden directamente a la carta desde el navegador de su móvil.",
    },
    {
      question: "¿Funciona en cualquier móvil?",
      answer:
        "Sí. Funciona en cualquier smartphone moderno, tanto Android como iPhone, sin necesidad de descargar nada.",
    },
    {
      question: "¿Cuánto tiempo lleva la instalación?",
      answer:
        "La configuración inicial suele completarse en una sola visita. Nos encargamos de dejar el sistema listo para funcionar.",
    },
    {
      question: "¿Tengo que cambiar mi TPV actual?",
      answer:
        "No necesariamente. La versión básica funciona de forma independiente. Además, estamos trabajando en integraciones y una versión completa con TPV.",
    },
    {
  question: "¿Es necesario que acudáis al local para instalarlo?",
  answer:
    "No. La mayoría de las configuraciones pueden realizarse de forma remota. Preparamos el sistema, configuramos las mesas y enviamos los vinilos QR listos para colocar.",
},
    {
      question: "¿Puedo probarlo antes de contratarlo?",
      answer:
        "Sí. Podemos realizar una demostración para que veas exactamente cómo funciona antes de tomar una decisión.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-24">
      <div className="max-w-4xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            Preguntas frecuentes
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Las dudas más habituales antes de empezar.
          </p>

        </div>

        <div className="space-y-4">

          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="border border-gray-200 rounded-3xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-lg">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`transition-transform ${
                    open === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open === index && (
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}