import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return ( <html lang="es"> <body className="bg-[#0f0f0f] text-white">

    <Navbar />

{children}

<Link
  href="#ia"
  className="
    fixed
    bottom-6
    right-6
    z-50
    bg-[#b9742d]
    hover:bg-[#c98237]
    text-white
    px-5
    py-4
    rounded-full
    shadow-2xl
    font-semibold
    transition-all
    hover:scale-105
    flex
    items-center
    gap-2
  "
>
  🤖 ¿Necesitas ayuda?
</Link>

<Footer />

  </body>
</html>

);
}
