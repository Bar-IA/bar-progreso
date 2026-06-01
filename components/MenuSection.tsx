type Item = {
  name: string;
  price: string;
  description?: string;
};

type Props = {
  title: string;
  items: Item[];
};

export default function MenuSection({
  title,
  items,
}: Props) {
  return (
    <section className="mb-16">

      <h2 className="text-3xl font-bold mb-6">
        {title}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        {items.map((item) => (
          <div
            key={item.name}
            className="bg-zinc-900 p-5 rounded-xl"
          >
            <div className="flex justify-between">
              <span>{item.name}</span>
              <span>{item.price}</span>
            </div>

            {item.description && (
              <p className="text-gray-400 text-sm mt-2">
                {item.description}
              </p>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}