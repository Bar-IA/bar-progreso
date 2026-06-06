import {
  Smartphone,
  Clock3,
  CheckCircle2,
  MonitorSmartphone,
} from "lucide-react";
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-24">

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          <div>

            <div className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 mb-8">
              🚀 Hostelería más eficiente
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
              Tus clientes piden.
              <br />
              Tu equipo sirve.
            </h1>

            <p className="mt-8 text-xl text-gray-600 max-w-xl">
  Recibe pedidos directamente desde la mesa mediante QR.
  Reduce desplazamientos, agiliza el servicio y atiende más mesas con el mismo equipo.
</p>

            <p className="mt-6 text-lg text-gray-500 max-w-xl">
  Más ventas. Menos carreras. Más control.
</p>

            <div className="flex flex-wrap gap-4 mt-10">

              <a
  href="https://wa.me/34694259636?text=Hola.%20He%20visto%20A%20Pedir%20de%20Mesa%20y%20me%20gustaría%20solicitar%20una%20demostración."
  target="_blank"
  rel="noopener noreferrer"
  className="bg-[#C46A2D] text-white px-8 py-4 rounded-2xl font-semibold"
>
  Solicitar demo gratuita
</a>

              <button className="border border-gray-300 px-8 py-4 rounded-2xl font-semibold">
                Cómo funciona
              </button>

            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 max-w-xl text-sm text-gray-600">

  <div className="flex items-center gap-2">
    <Smartphone className="w-4 h-4 text-[#C46A2D]" />
    <span>Sin aplicación</span>
  </div>

  <div className="flex items-center gap-2">
    <Clock3 className="w-4 h-4 text-[#C46A2D]" />
    <span>Configuración remota</span>
  </div>

  <div className="flex items-center gap-2">
    <MonitorSmartphone className="w-4 h-4 text-[#C46A2D]" />
    <span>Cualquier móvil</span>
  </div>

  <div className="flex items-center gap-2">
    <CheckCircle2 className="w-4 h-4 text-[#C46A2D]" />
    <span>Sin cambiar tu TPV</span>
  </div>

</div>

          </div>

          <div>

            <div className="relative">



              <div className="bg-white rounded-[32px] border border-gray-200 shadow-2xl p-8">

                <div className="flex justify-between items-center mb-8">

                  <h3 className="font-bold text-xl">
                    Pedidos en curso
                  </h3>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Tiempo real
                  </span>

                </div>

                <div className="space-y-4">

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="font-semibold">
                      Mesa 7
                    </div>
                    <div className="text-gray-500">
                      2x Cruzcampo
                    </div>
                    <div className="text-gray-500">
                      1x Ensaladilla
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="font-semibold">
                      Mesa 3
                    </div>
                    <div className="text-gray-500">
                      Café + Tostada
                    </div>
                  </div>

                </div>

              </div>

              
              <div className="absolute -right-4 top-24 bg-[#C46A2D] text-white rounded-2xl px-5 py-4 shadow-lg">
                🔔 Nuevo pedido
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}