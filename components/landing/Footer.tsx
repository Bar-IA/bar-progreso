export default function Footer() {
  return (
    <footer className="bg-[#0F1F19] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between gap-8">

          <div>
            <h3 className="font-bold text-xl">
              A Pedir de Mesa
            </h3>

            <p className="mt-3 text-gray-400 max-w-md">
              Pedidos mediante QR para bares y restaurantes.
            </p>
          </div>

          <div className="text-gray-400 text-sm">
            © 2026 A Pedir de Mesa
          </div>

        </div>

      </div>
    </footer>
  );
}