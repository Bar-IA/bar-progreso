"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [logged, setLogged] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] =
  useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] =
  useState("");
  const [vista, setVista] =
  useState("productos");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [description, setDescription] =  useState("");
  const [newCategory, setNewCategory] =
  useState("");

  const [newCategoryIcon,
  setNewCategoryIcon] =
  useState("burger");
  const [editingCategoryId,
  setEditingCategoryId] =
  useState<number | null>(
    null
  );

const [editingCategoryName,
  setEditingCategoryName] =
  useState("");

 const iconos: any = {

  burger: "🍔",
  pizza: "🍕",
  fries: "🍟",
  coffee: "☕",
  drink: "🍹",
  cake: "🍰",
  tapas: "🍤",
  salad: "🥗",
  fish: "🐟",
  cocktail: "🍸",
  wine: "🍷",

  meat: "🥩",
  sushi: "🍣",
  chicken: "🍗",
  breakfast: "🥖",
  pasta: "🍝",
  sandwich: "🥪",
  hotdog: "🌭",
  icecream: "🍨",
  vegan: "🌱",
  menu: "📋",
  kids: "🧒",
  grill: "🔥",
  generic: "🍽️"

};

  const loadProducts = async () => {

    

    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id");

    if (data) {
      setProducts(data);
    }

  };

  const loadCategories =
  async () => {

    const { data } =
      await supabase
  .from("categories")
  .select("*")
  .order("orden");

    if (data) {

  setCategories(data);

  if (data.length > 0) {

    setCategory(
      String(data[0].id)
    );

  }

}

  };



  useEffect(() => {

  loadProducts();
  loadCategories();

}, []);

useEffect(() => {

  const checkSession = async () => {

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      setLogged(true);
    }

  };

  checkSession();

}, []);

  const addProduct = async () => {

  if (editingId) {

    await supabase
      .from("products")
      .update({

  category:
    categories.find(
      c =>
        c.id ===
        Number(category)
    )?.name,

  category_id:
    Number(category),

  name,
  description,
  price:
    Number(price)

})
      .eq("id", editingId);

  } else {

    const { data, error } =
  await supabase
    .from("products")
    .insert([
      {
  category:
    categories.find(
      c =>
        c.id ===
        Number(category)
    )?.name,

  category_id:
    Number(category),

  name,
  description,
  price: Number(price),
  active: true,
  featured: false
}
    ]);

console.log(
  "INSERT DATA",
  data
);

console.log(
  "INSERT ERROR",
  error
);

  }

  setName("");
  setPrice("");
  setCategory("");
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

  const addCategory = async () => {

  if (!newCategory.trim())
    return;

  const ultimoOrden =
    categories.length > 0
      ? Math.max(
          ...categories.map(
            (c) => c.orden || 0
          )
        )
      : 0;

  const { error } =
    await supabase
      .from("categories")
      .insert([
  {
    name: newCategory,
    icon:
      newCategoryIcon,
    active: true,
    orden:
      ultimoOrden + 1
  }
]);

  if (error) {

    console.error(error);

    return;

  }

  setNewCategory("");

  setNewCategoryIcon(
  "burger"
);

  loadCategories();

};

const toggleCategory = async (
  id: number,
  active: boolean
) => {

  const { error } =
    await supabase
      .from("categories")
      .update({
        active: !active
      })
      .eq("id", id);

  if (error) {

    console.error(error);

    return;

  }

  loadCategories();

};

const saveCategory = async () => {

  if (
    !editingCategoryId
  ) return;

  const { error } =
    await supabase
      .from("categories")
      .update({
        name:
          editingCategoryName
      })
      .eq(
        "id",
        editingCategoryId
      );

  if (error) {

    console.error(error);

    return;

  }

  setEditingCategoryId(
    null
  );

  setEditingCategoryName(
    ""
  );

  loadCategories();

};

const login = async () => {

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    alert("Credenciales incorrectas");
    return;
  }

  setLogged(true);

};

const groupedProducts =
  categories.reduce(
    (acc: any, category) => {

      acc[category.name] =
        products.filter(
          (product) =>
            product.category_id ===
            category.id
        );

      return acc;

    },
    {}
  );

if (!logged) {

  return (

    <main className="min-h-screen flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-3xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6">
          Acceso Admin
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 mb-4 text-black"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 mb-4 text-black"
        />

        <button
          onClick={login}
          className="
            w-full
            bg-[#b9742d]
            py-3
            rounded-xl
          "
        >
          Entrar
        </button>

      </div>

    </main>

  );

}

  return (

    <main className="p-10">

  <div className="flex justify-between items-center mb-8">

    <h1 className="text-4xl font-bold">
      Panel Admin
    </h1>
    

    <button
      onClick={async () => {

        await supabase.auth.signOut();

        setLogged(false);

      }}
      className="
        bg-red-600
        px-4
        py-2
        rounded
      "
    >
      Cerrar sesión
    </button>

  </div>
<div className="flex gap-3 mb-6">

  <button
    onClick={() =>
      setVista("productos")
    }
    className={`
      px-4
      py-2
      rounded-xl
      font-semibold

      ${
        vista === "productos"
          ? "bg-[#b9742d]"
          : "bg-zinc-800"
      }
    `}
  >
    🍔 Productos
  </button>

  <button
    onClick={() =>
      setVista("categorias")
    }
    className={`
      px-4
      py-2
      rounded-xl
      font-semibold

      ${
        vista === "categorias"
          ? "bg-[#b9742d]"
          : "bg-zinc-800"
      }
    `}
  >
    📂 Categorías
  </button>

</div>
{
  vista === "productos" && (
    <>
  <div className="flex gap-4 mb-8">
    
<select
  value={category}
  onChange={(e) =>
    setCategory(
      e.target.value
    )
  }
  className="border p-2"
>

  {categories.map((cat) => (

    <option
      key={cat.id}
      value={cat.id}
    >
      {cat.name}
    </option>

  ))}

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
  String(
    product.category_id
  )
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

    </>

  )
}

  
{
  vista === "categorias" && (

    <div
      className="
        bg-zinc-900
        rounded-3xl
        p-6
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-6
        "
      >
        📂 Categorías
      </h2>

      <div
  className="
    flex
    gap-3
    mb-6
  "
>

  <input
    value={newCategory}
    onChange={(e) =>
      setNewCategory(
        e.target.value
      )
    }
    placeholder="Nueva categoría"
    className="
      flex-1
      bg-zinc-800
      rounded-xl
      px-4
      py-3
    "
  />
  <select
  value={
    newCategoryIcon
  }
  onChange={(e) =>
    setNewCategoryIcon(
      e.target.value
    )
  }
  className="
    bg-zinc-800
    rounded-xl
    px-4
    py-3
  "
>
<option value="generic">
    🍽️ Otros
  </option>

  <option value="burger">
    🍔 Hamburguesa
  </option>

  <option value="pizza">
    🍕 Pizza
  </option>

  <option value="fries">
    🍟 Patatas
  </option>

  <option value="coffee">
    ☕ Café
  </option>

  <option value="drink">
    🍹 Bebidas
  </option>

  <option value="cake">
    🍰 Postres
  </option>

  <option value="salad">
    🥗 Ensaladas
  </option>

  <option value="fish">
    🐟 Pescado
  </option>

  <option value="cocktail">
    🍸 Copas
  </option>

  <option value="meat">
  🥩 Carnes
</option>

<option value="sushi">
  🍣 Sushi
</option>

<option value="chicken">
  🍗 Pollo
</option>

<option value="breakfast">
  🥖 Desayunos
</option>

<option value="pasta">
  🍝 Pasta
</option>

<option value="sandwich">
  🥪 Bocadillos
</option>

<option value="hotdog">
  🌭 Perritos
</option>

<option value="icecream">
  🍨 Helados
</option>

<option value="vegan">
  🌱 Vegano
</option>

<option value="menu">
  📋 Menú
</option>

<option value="kids">
  🧒 Infantil
</option>

<option value="grill">
  🔥 Parrilla
</option>

</select>

  <button
    onClick={addCategory}
    className="
      bg-green-600
      px-4
      rounded-xl
      font-semibold
    "
  >
    Añadir
  </button>

</div>

      {categories.map((cat) => (

        <div
  key={cat.id}
  className={`
    rounded-xl
    p-4
    mb-3
    flex
    justify-between
    items-center

    ${
      cat.active
        ? "bg-zinc-800"
        : "bg-zinc-900 opacity-50"
    }
  `}
>

{
  editingCategoryId ===
  cat.id ? (

    <input
      value={
        editingCategoryName
      }
      onChange={(e) =>
        setEditingCategoryName(
          e.target.value
        )
      }
      className="
        bg-zinc-700
        rounded-lg
        px-3
        py-2
      "
    />

  ) : (

    <span>

      {iconos[
        cat.icon
      ]}

      {" "}

      {cat.name}

    </span>

  )
}

          <div
  className="
    flex
    gap-4
    items-center
  "
>

  {
    editingCategoryId ===
    cat.id ? (

      <button
        onClick={
          saveCategory
        }
        className="
          text-green-400
          font-semibold
        "
      >
        Guardar
      </button>

    ) : (

      <button
        onClick={() => {

          setEditingCategoryId(
            cat.id
          );

          setEditingCategoryName(
            cat.name
          );

        }}
        className="
          text-blue-400
          font-semibold
        "
      >
        Editar
      </button>

    )
  }

  <button
    onClick={() =>
      toggleCategory(
        cat.id,
        cat.active
      )
    }
    className={`
      font-semibold

      ${
        cat.active
          ? "text-red-400"
          : "text-green-400"
      }
    `}
  >
    {
      cat.active
        ? "Ocultar"
        : "Mostrar"
    }
  </button>

</div>

        </div>

      ))}

    </div>

  )
}
    </main>

  );

}