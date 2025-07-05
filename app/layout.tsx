import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      {/* Añadimos una clase para aplicar flexbox */}
      <body className={`${inter.className} flex-container`}>
        {/* Envolvemos el contenido en una etiqueta <main> */}
        <main className="main-content">
          {children}
        </main>
        
        <footer className="main-footer">
          <p>Hecho con ❤️ by Cyberdark</p>
        </footer>

      </body>
    </html>
  );
}