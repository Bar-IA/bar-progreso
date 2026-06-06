export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#FAF9F7] text-[#10251D] min-h-screen">
      {children}
    </div>
  );
}