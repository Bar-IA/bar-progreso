"use client";

import { use } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function QRPage(
  {
    params
  }: {
    params: Promise<{
      token: string;
    }>;
  }
) {

  const {
    token
  } = use(params);

  const router =
    useRouter();

  useEffect(() => {

    const load =
      async () => {

        const {
          data,
          error
        } = await supabase
          .from("tables")
          .select("*")
          .eq(
            "qr_token",
            token
          )

          
          .single();
          console.log(
  "TOKEN:",
  token
);
console.log(
  "DATA:",
  data
);

console.log(
  "ERROR:",
  error
);
        if (
          error ||
          !data
        ) {

          alert(
            "QR inválido"
          );

          return;

        }

        router.push(
  `/carta?mesa=${data.number}&restaurant=${data.restaurant_id}`
);

      };

    load();

  }, []);

  return (

    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
      "
    >

      Cargando...

    </main>

  );

}