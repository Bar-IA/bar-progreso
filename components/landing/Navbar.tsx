export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#F8F5F0]/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

        <div className="flex items-center">
          <img
            src="/logo-apedirdemesa.png"
            alt="A Pedir de Mesa"
            className="h-16 w-auto"
          />
        </div>

        <nav className="hidden md:flex items-center gap-10 font-medium text-sm">

          <a href="#como-funciona" className="hover:text-[#C46A2D] transition">
            Cómo funciona
          </a>

          <a href="#beneficios" className="hover:text-[#C46A2D] transition">
            Beneficios
          </a>

          <a href="#negocio" className="hover:text-[#C46A2D] transition">
            Para tu negocio
          </a>

          <a href="#faq" className="hover:text-[#C46A2D] transition">
            Dudas frecuentes
          </a>

        </nav>

        <a
  href="https://wa.me/34694259636?text=Hola.%20He%20visto%20A%20Pedir%20de%20Mesa%20y%20me%20gustaría%20solicitar%20una%20demostración."
  target="_blank"
  rel="noopener noreferrer"
  className="bg-[#10251D] text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition"
>
  Solicitar demostración
</a>

      </div>
    </header>
  );
}