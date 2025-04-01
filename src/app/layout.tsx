import type { Metadata } from "next";
import Footer from "components/Footer";
import Header from "components/Header";
import { ReactNode } from "react";
import { AuthProvider } from "context/AuthProvider";
import "../../public/globals.css";

export const metadata: Metadata = {
  title: "EcoCharge",
  description: "Seu site para carregamento de dispositivos móveis",
};

const RootLayout = ({children}: LayoutProps) => {
  return (
    <AuthProvider >
      <html lang="pt-br">
        <body>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}

export default RootLayout;
