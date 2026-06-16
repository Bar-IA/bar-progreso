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
  const [orden, setOrden] =
  useState("");

  const [selectedGroupId,
  setSelectedGroupId] =
useState<number | null>(
  null
);

const [modifiers,
  setModifiers] =
useState<any[]>([]);

const [newModifierName,
  setNewModifierName] =
useState("");

  const [modifierGroups,
  setModifierGroups] =
useState<any[]>([]);

const [
  newModifierPrice,
  setNewModifierPrice
] = useState("0");

const [selectedRestaurantId,
  setSelectedRestaurantId] =
useState<number | null>(
  null
);

const [newGroupName,
  setNewGroupName] =
useState("");

  const [openCategories,
  setOpenCategories] =
useState<any>({});
  const [currentImageUrl,
  setCurrentImageUrl] =
useState("");
 

const [showModal,
  setShowModal] =
useState(false);
  const [category, setCategory] =
  useState("");
  const [vista, setVista] =
  useState("productos");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [description, setDescription] =  useState("");
  const [imageUrl, setImageUrl] =
  useState("");
  const [newCategory, setNewCategory] =
  useState("");
const [imageFile, setImageFile] =
  useState<File | null>(null);
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

  const abiertas: any = {};

  data.forEach((cat) => {

    abiertas[cat.name] = true;

  });

  setOpenCategories(
    abiertas
  );

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


    let uploadedImageUrl = imageUrl;

if (imageFile) {

  const fileName =
    `${Date.now()}-${imageFile.name}`;

  const { error } =
    await supabase.storage
      .from("products")
      .upload(
        fileName,
        imageFile
      );

  if (error) {

    console.error(error);

    return;

  }

  const {
    data: publicUrlData
  } = supabase.storage
    .from("products")
    .getPublicUrl(
      fileName
    );

  uploadedImageUrl =
    publicUrlData.publicUrl;

}
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
  image_url:
  uploadedImageUrl ||
  currentImageUrl,
  price:
    Number(price),
    orden:
  Number(orden),

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
  image_url:
  uploadedImageUrl,
  price: Number(price),
  orden: Number(orden),
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
  setOrden("");
  setCategory("");
  setEditingId(null);
  setDescription("");
  setImageUrl("");
  setImageFile(null);
  setCurrentImageUrl("");

  loadProducts();

};

const addModifierGroup =
async () => {

  if (
    !editingId ||
    !newGroupName.trim()
  ) return;

  
  const { error } =
    await supabase
  .from(
    "product_modifier_groups"
  )
  .insert([{

    product_id:
      editingId,

    restaurant_id:
      selectedRestaurantId,

    name:
      newGroupName,

    required: false,

    multiple: false

  }]);

  if (error) {

    console.error(error);

    return;

  }

  
  const { data } =
    await supabase
      .from(
        "product_modifier_groups"
      )
      .select("*")
      .eq(
        "product_id",
        editingId
      );

      console.log(
  "MODIFIER GROUPS",
  data
);

  setModifierGroups(
    data || []
  );

  setNewGroupName("");

};

const addModifier =
async () => {

  if (
    !selectedGroupId ||
    !newModifierName.trim()
  ) return;

  const { error } =
    await supabase
      .from(
        "product_modifiers"
      )
      .insert([{

        group_id:
          selectedGroupId,

        restaurant_id:
          selectedRestaurantId,

        name:
          newModifierName,

        price:
  Number(
    newModifierPrice
  )

      }]);

  if (error) {

    console.error(error);

    return;

  }

  const { data } =
    await supabase
      .from(
        "product_modifiers"
      )
      .select("*")
      .eq(
        "group_id",
        selectedGroupId
      );

  setModifiers(
    data || []
  );

  setNewModifierName("");

  setNewModifierPrice(
  "0"
);

};


const deleteModifier =
async (
  id: number
) => {

  const { error } =
    await supabase
      .from(
        "product_modifiers"
      )
      .delete()
      .eq(
        "id",
        id
      );

  if (error) {

    console.error(error);

    return;

  }

  const { data } =
    await supabase
      .from(
        "product_modifiers"
      )
      .select("*")
      .eq(
        "group_id",
        selectedGroupId
      );

  setModifiers(
    data || []
  );

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
  onClick={() => {

    setEditingId(null);

    setName("");
    setDescription("");
    setPrice("");
    setOrden("");

    setCategory(
      String(categories[0]?.id || "")
    );

    setImageFile(null);
    setCurrentImageUrl("");

    setShowModal(true);

  }}
  className="
    bg-green-600
    px-5
    py-3
    rounded-xl
    font-semibold
  "
>
  ➕ Nuevo producto
</button>
    

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

    

      {Object.entries(groupedProducts).map(
  ([category, items]: any) => (

    <div
      key={category}
      className="mb-10"
    >

      <button
  onClick={() =>
    setOpenCategories(
      {
        ...openCategories,

        [category]:
          !openCategories[
            category
          ]
      }
    )
  }
  className="
    w-full
    flex
    justify-between
    items-center
    bg-zinc-800
    rounded-2xl
    px-5
    py-4
    mb-4
    text-left
  "
>

  <span
    className="
      text-2xl
      font-bold
    "
  >
    {category}
{" ("}
{items.length}
{")"}
  </span>

  <span>
    {
      openCategories[
        category
      ]
        ? "▼"
        : "▶"
    }
  </span>

</button>

      {
  openCategories[category] && (

<div
  className="
    grid
    md:grid-cols-2
    xl:grid-cols-3
    gap-4
  "
>

      {items.map((product: any) => (

  <div
    key={product.id}
    className="
      bg-zinc-800
      rounded-2xl
      overflow-hidden
      border
      border-zinc-700
    "
  >
    {product.image_url && (

  <img
    src={product.image_url}
    alt={product.name}
    className="
  w-full
  h-32
  object-contain
  bg-zinc-900
  p-2
"
  />

)}

          <div className="p-4">

            <p className="font-bold text-lg">
  {product.name}
</p>

            <p className="text-sm text-gray-500">
              {product.description}
            </p>

           <div
  className="
    flex
    gap-2
    mt-3
  "
>

  <span
    className="
      bg-[#b9742d]
      px-3
      py-1
      rounded-full
      text-sm
    "
  >
    💰 {product.price}€
  </span>

  <span
    className="
      bg-zinc-700
      px-3
      py-1
      rounded-full
      text-sm
    "
  >
    📊 {product.orden}
  </span>

</div>



          </div>
        
          


          <div className="flex gap-2 mt-4">

            <button
              onClick={async () => {

 
  setEditingId(
    product.id
  );

  setSelectedRestaurantId(
  product.restaurant_id
);

  setName(
    product.name
  );

  setDescription(
    product.description || ""
  );

  setPrice(
    String(product.price)
  );

  setOrden(
    String(
      product.orden || 0
    )
  );
  setCategory(
  String(
    product.category_id
  )
);

setCurrentImageUrl(
  product.image_url || ""
);

setSelectedGroupId(
  null
);

setModifiers([]);

const { data } =
  await supabase
    .from(
      "product_modifier_groups"
    )
    .select("*")
    .eq(
      "product_id",
      product.id
    );

console.log(
  "MODIFIER GROUPS",
  data
);

setModifierGroups(
  data || []
);


  setShowModal(true);

}}
             className="
  flex-1
  bg-blue-600
  py-2
  rounded-xl
  text-center
  font-semibold
"
            >
              Editar
            </button>

            <button
              onClick={() =>
                deleteProduct(product.id)
              }
              className="
  flex-1
  bg-red-600
  py-2
  rounded-xl
  text-center
  font-semibold
"
            >
              Eliminar
            </button>

          </div>

        </div>

      ))}

    </div>
  )}
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

{showModal && (

  <div
    className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
    "
  >

    <div
      className="
        bg-zinc-900
        rounded-3xl
        p-6
        w-full
        max-w-xl
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-6
        "
      >
        {
  editingId
    ? "Editar producto"
    : "Nuevo producto"
}
      </h2>

      <div className="space-y-4">

        <input
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="Nombre"
          className="
            w-full
            bg-zinc-800
            rounded-xl
            px-4
            py-3
          "
        />

        <input
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          placeholder="Descripción"
          className="
            w-full
            bg-zinc-800
            rounded-xl
            px-4
            py-3
          "
        />
        <select
  value={category}
  onChange={(e) =>
    setCategory(
      e.target.value
    )
  }
  className="
    w-full
    bg-zinc-800
    rounded-xl
    px-4
    py-3
  "
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
  type="file"
  accept="image/*"
  onChange={(e) => {

    if (
      e.target.files &&
      e.target.files[0]
    ) {

      setImageFile(
        e.target.files[0]
      );

    }

  }}
  className="
    w-full
    bg-zinc-800
    rounded-xl
    px-4
    py-3
  "
/>

{currentImageUrl && (

  <img
    src={currentImageUrl}
    alt="preview"
    className="
      w-full
      h-40
      object-contain
      bg-zinc-800
      rounded-xl
      p-2
    "
  />

)}


        <input
          value={price}
          onChange={(e) =>
            setPrice(
              e.target.value
            )
          }
          placeholder="Precio"
          className="
            w-full
            bg-zinc-800
            rounded-xl
            px-4
            py-3
          "
        />

        <input
          value={orden}
          onChange={(e) =>
            setOrden(
              e.target.value
            )
          }
          placeholder="Orden"
          className="
            w-full
            bg-zinc-800
            rounded-xl
            px-4
            py-3
          "
        />

        {editingId && (

  <div>

    <hr className="my-4 border-zinc-700" />

    <h3
      className="
        text-lg
        font-bold
        mb-3
      "
    >
      Modificadores
    </h3>

    <div
  className="
    flex
    gap-2
    mb-3
  "
>

  <input
    value={newGroupName}
    onChange={(e) =>
      setNewGroupName(
        e.target.value
      )
    }
    placeholder="
      Ej: Tipo de pan
    "
    className="
      flex-1
      bg-zinc-800
      rounded-xl
      px-4
      py-3
    "
  />

  <button
  onClick={
    addModifierGroup
  }
  className="
    bg-purple-600
    px-4
    rounded-xl
  "
>
  Añadir
</button>

</div>
<div className="space-y-2">

  {modifierGroups.map(
  (group) => (

    <div
      key={group.id}
      onClick={async () => {

  setSelectedGroupId(
    group.id
  );

  const { data } =
    await supabase
      .from(
        "product_modifiers"
      )
      .select("*")
      .eq(
        "group_id",
        group.id
      );

  setModifiers(
    data || []
  );

}}
      className={`
        rounded-xl
        px-4
        py-3
        cursor-pointer

        ${
          selectedGroupId ===
          group.id

            ? "bg-purple-600"

            : "bg-zinc-800"
        }
      `}
    >
      <div
  className="
    flex
    justify-between
    items-center
  "
>

  <span>
    ⚙️ {group.name}
  </span>

  <div
    className="
      flex
      gap-2
    "
    onClick={(e) =>
      e.stopPropagation()
    }
  >

    <button
      onClick={async () => {

        await supabase
          .from(
            "product_modifier_groups"
          )
          .update({
            required:
              !group.required
          })
          .eq(
            "id",
            group.id
          );

        setModifierGroups(
          modifierGroups.map(
            (g) =>
              g.id === group.id
                ? {
                    ...g,
                    required:
                      !g.required
                  }
                : g
          )
        );

      }}
      className={`
        px-2
        py-1
        rounded-lg
        text-xs

        ${
          group.required

            ? "bg-green-600"

            : "bg-zinc-700"
        }
      `}
    >
      Obligatorio
    </button>

    <button
      onClick={async () => {

        await supabase
          .from(
            "product_modifier_groups"
          )
          .update({
            multiple:
              !group.multiple
          })
          .eq(
            "id",
            group.id
          );

        setModifierGroups(
          modifierGroups.map(
            (g) =>
              g.id === group.id
                ? {
                    ...g,
                    multiple:
                      !g.multiple
                  }
                : g
          )
        );

      }}
      className={`
        px-2
        py-1
        rounded-lg
        text-xs

        ${
          group.multiple

            ? "bg-blue-600"

            : "bg-zinc-700"
        }
      `}
    >
      Múltiple
    </button>

  </div>

</div>
    </div>

  )
)}

{selectedGroupId && (

  <div
    className="
      mt-4
      border-t
      border-zinc-700
      pt-4
    "
  >

    <div
      className="
        flex
        gap-2
        mb-3
      "
    >

      <input
        value={newModifierName}
        onChange={(e) =>
          setNewModifierName(
            e.target.value
          )
        }
        placeholder="
          Ej: Blanco
        "
        className="
          flex-1
          bg-zinc-800
          rounded-xl
          px-4
          py-3
        "
      />
      <input
  value={newModifierPrice}
  onChange={(e) =>
    setNewModifierPrice(
      e.target.value
    )
  }
  placeholder="0.00"
  className="
    w-28
    bg-zinc-800
    rounded-xl
    px-4
    py-3
  "
/>

      <button
  onClick={
    addModifier
  }
  className="
    bg-green-600
    px-4
    rounded-xl
  "
>
  Añadir
</button>



    </div>

    <div className="space-y-2">

  {modifiers.map(
  (modifier) => (

    <div
      key={modifier.id}
      className="
        bg-zinc-700
        rounded-xl
        px-4
        py-2
        flex
        justify-between
        items-center
      "
    >

      <span>
  {modifier.name}

  {Number(modifier.price) > 0 && (
    <span
      className="
        text-green-400
        ml-2
      "
    >
      +{Number(modifier.price).toFixed(2)}€
    </span>
  )}
</span>

      <button
        onClick={() =>
          deleteModifier(
            modifier.id
          )
        }
        className="
          text-red-400
          font-bold
          hover:text-red-300
        "
      >
        ❌
      </button>

    </div>

  )
)}

</div>

  </div>

)}

</div>
  </div>




)}

        <div
          className="
            flex
            gap-3
          "
        >

          <button
            onClick={() => {

              addProduct();

              setShowModal(
                false
              );

            }}
            className="
              flex-1
              bg-green-600
              py-3
              rounded-xl
              font-semibold
            "
          >
            Guardar
          </button>

          <button
            onClick={() => {

              setShowModal(false);

setEditingId(null);

setName("");
setDescription("");
setPrice("");
setOrden("");
setCurrentImageUrl("");
setSelectedGroupId(
  null
);

setModifiers([]);

setModifierGroups([]);

            }}
            className="
              flex-1
              bg-red-600
              py-3
              rounded-xl
              font-semibold
            "
          >
            Cancelar
          </button>

          

        </div>

      </div>

    </div>

  </div>

)}
    </main>

  );

}