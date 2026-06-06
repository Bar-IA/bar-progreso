import {
  QrCode,
  MenuSquare,
  ShoppingCart,
  CheckCircle2,
  Bell,
  LayoutDashboard,
  Clock3,
  Check,
} from "lucide-react";

export default function Future() {
  return (
    <section className="bg-white py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16">

          {/* Cliente */}

          <div>

            <h2 className="text-4xl font-bold mb-8">
                Experiencia para el cliente
            </h2>
            <p className="text-gray-500 mt-3 mb-8">
              Pide directamente desde la mesa en menos de un minuto.
            </p>

            <div className="bg-[#F8F5F0] rounded-3xl p-8 border border-gray-200">

              <div className="space-y-4">

                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                  <QrCode className="w-6 h-6 text-[#C46A2D]" />
                  <span>Escanea el QR de la mesa</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                  <MenuSquare className="w-6 h-6 text-[#C46A2D]" />
                  <span>Consulta la carta</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                  <ShoppingCart className="w-6 h-6 text-[#C46A2D]" />
                  <span>Realiza el pedido</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#C46A2D]" />
                  <span>Recibe confirmación</span>
                </div>

</div>

            </div>

          </div>

          {/* Local */}

          <div>

            <h2 className="text-4xl font-bold mb-8">
              Control para el local
            </h2>

            <p className="text-gray-500 mt-3 mb-8">
              Recibe, organiza y sirve pedidos desde un único panel.
            </p>

            <div className="bg-[#F8F5F0] rounded-3xl p-6 border border-gray-200">

              <div className="bg-white rounded-2xl border border-gray-200 p-6">

                <div className="font-bold text-xl mb-6">
                  Pedidos en curso
                </div>

                <div className="space-y-3">

                  <div className="flex justify-between items-center">
                    <span>Mesa 3</span>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Listo
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Mesa 7</span>

                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                      En preparación
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Mesa 12</span>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      Nuevo
                    </span>
                  </div>

                </div>

              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">

  <div
  className="
    bg-white
    rounded-2xl
    border
    border-gray-200
    p-5
    flex
    items-center
    gap-4
    hover:shadow-md
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
    <Bell className="w-5 h-5 text-[#C46A2D]" />
    <span className="text-sm">
      Notificaciones sonoras
    </span>
  </div>

                  <div
  className="
    bg-white
    rounded-2xl
    border
    border-gray-200
    p-5
    flex
    items-center
    gap-4
    hover:shadow-md
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
                    <Clock3 className="w-5 h-5 text-[#C46A2D]" />
                    <span className="text-sm">
                      Estado actualizado
                    </span>
                  </div>

                  <div
  className="
    bg-white
    rounded-2xl
    border
    border-gray-200
    p-5
    flex
    items-center
    gap-4
    hover:shadow-md
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
                    <Check className="w-5 h-5 text-[#C46A2D]" />
                    <span className="text-sm">
                      Gestión sencilla
                    </span>
                  </div>

                  <div
  className="
    bg-white
    rounded-2xl
    border
    border-gray-200
    p-5
    flex
    items-center
    gap-4
    hover:shadow-md
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
                    <LayoutDashboard className="w-5 h-5 text-[#C46A2D]" />
                    <span className="text-sm">
                      Todo centralizado
                    </span>
                  </div>

                </div>


            </div>

          </div>

        </div>

      </div>

    </section>
  );
}