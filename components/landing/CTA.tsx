export default function CTA() {
  return (
    <section className="bg-[#10251D] text-white py-24">

      <div className="max-w-5xl mx-auto px-6 text-center">

        <h2 className="text-5xl md:text-6xl font-bold leading-tight">
          La hostelería necesita más tiempo para atender.
        </h2>

        <p className="mt-6 text-2xl text-gray-300">
          Nosotros te ayudamos a recuperarlo.
        </p>

        <a
  href="https://wa.me/34694259636?text=Hola.%20He%20visto%20A%20Pedir%20de%20Mesa%20y%20me%20gustaría%20solicitar%20una%20demostración."
  target="_blank"
  rel="noopener noreferrer"
  className="
inline-flex
items-center
justify-center
bg-[#C46A2D]
hover:bg-[#b85f25]
text-white
px-10
py-5
rounded-2xl
font-bold
text-lg
transition
shadow-xl
hover:scale-105
"
>
  Solicitar demostración
</a>


        <div className="mt-8 text-sm text-gray-400">
        Configuración remota · Envío de vinilos QR · Sin permanencia
        </div>

      </div>

    </section>
  );
}