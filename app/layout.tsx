import "./globals.css";
import AppShell from "@/components/AppShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#0f0f0f] text-white">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}