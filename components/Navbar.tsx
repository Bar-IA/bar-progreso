import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
return ( <header className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-zinc-800">

  <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

    <Link href="/">
      <Image
        src="/logoV3.PNG"
        alt="Bar Progreso"
        width={180}
        height={70}
        priority
      />
    </Link>

    <nav className="flex gap-6 text-sm md:text-base">

      <Link
        href="/"
        className="hover:text-[#b9742d] transition"
      >
        Inicio
      </Link>

      <Link
        href="/carta"
        className="hover:text-[#b9742d] transition"
      >
        Carta
      </Link>

      <a
        href="/#contacto"
        className="hover:text-[#b9742d] transition"
      >
        Reservas
      </a>

      <a
        href="/#ia"
        className="hover:text-[#b9742d] transition"
      >
        IA
      </a>

    </nav>

  </div>

</header>

);
}
