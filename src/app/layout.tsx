import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "Brandon G. Castañón | Software Engineer & Full Stack Developer",
  description: "Professional portfolio and CV of Brandon Giovanni Castañón García — Software Engineering, Full Stack Development, and technical projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            <div className="app-shell">
              <Header />
              <main>{children}</main>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
