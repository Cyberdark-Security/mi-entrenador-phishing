import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react'; // <-- 1. IMPORTA EL COMPONENTE

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Entrenador Anti-Phishing",
  description: "Entrenamiento para detectar correos de phishing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex-container`}>
        <main className="main-content">
          {children}
        </main>
        
        <footer className="main-footer">
          <p>Hecho con ❤️ by Cyberdark</p>
        </footer>

        <Analytics /> {/* <-- 2. AÑADE EL COMPONENTE AQUÍ */}
      </body>
    </html>
  );
}