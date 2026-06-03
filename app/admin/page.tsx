"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Hamburguesas");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [description, setDescription] =  useState("");

  const loadProducts = async () => {

    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id");

    if (data) {
      setProducts(data);
    }

  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async () => {

  if (editingId) {

    await supabase
      .from("products")
      .update({
  category,
  name,
  description,
  price: Number(price)
})
      .eq("id", editingId);

  } else {

    await supabase
      .from("products")
      .insert([
  {
    category,
    name,
    description,
    price: Number(price),
    active: true,
    featured: false
  }
]);

  }

  setName("");
  setPrice("");
  setCategory("Hamburguesas");
  setEditingId(null);
  setDescription("");

  loadProducts();

};

  const deleteProduct = async (
    id: number
  ) => {

    await supabase
      .from("products")
      .delete()
      .eq("id", id);

    loadProducts();

  };

const groupedProducts = products.reduce(
  (acc: any, product) => {

    if (!acc[product.category]) {
      acc[product.category] = [];
    }

    acc[product.category].push(product);

    return acc;

  },
  {}
);

  return (

    <main className="p-10">

      <h1 className="text-4xl font-bold mb-8">
        Panel Admin
        
      </h1>

      <div className="flex gap-4 mb-8">
<select
  value={category}
  onChange={(e) =>
    setCategory(e.target.value)
  }
  className="border p-2"
>

 <option value="burgers">
  Hamburguesas
</option>

<option value="pizzas">
  Pizzas
</option>

<option value="tapas">
  Tapas
</option>

<option value="patatas">
  Patatas
</option>

<option value="bebidas">
  Bebidas
</option>

<option value="postres">
  Postres
</option>

</select>
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="border p-2"
        />
<input
  placeholder="Descripción"
  value={description}
  onChange={(e) =>
    setDescription(e.target.value)
  }
  className="border p-2"
/>
        <input
          placeholder="Precio"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className="border p-2"
        />

        <button
          onClick={addProduct}
          className="
            bg-green-600
            text-white
            px-4
            rounded
          "
        >
          {editingId
  ? "Guardar Cambios"
  : "Añadir"}
        </button>

      </div>

      {Object.entries(groupedProducts).map(
  ([category, items]: any) => (

    <div
      key={category}
      className="mb-10"
    >

      <h2
        className="
          text-2xl
          font-bold
          mt-8
          mb-4
        "
      >
        {category}
      </h2>

      {items.map((product: any) => (

        <div
          key={product.id}
          className="
            flex
            justify-between
            border-b
            py-3
          "
        >

          <div>

            <p className="font-semibold">
              {product.name}
            </p>

            <p className="text-sm text-gray-500">
              {product.description}
            </p>

            <p>
              {product.price}€
            </p>

          </div>

          <div className="flex gap-4">

            <button
              onClick={() => {

                setEditingId(product.id);

                setName(product.name);

                setPrice(
                  String(product.price)
                );

                setCategory(
                  product.category
                );

                setDescription(
                  product.description || ""
                );

              }}
              className="text-blue-500"
            >
              Editar
            </button>

            <button
              onClick={() =>
                deleteProduct(product.id)
              }
              className="text-red-500"
            >
              Eliminar
            </button>

          </div>

        </div>

      ))}

    </div>

))}

    </main>

  );

}