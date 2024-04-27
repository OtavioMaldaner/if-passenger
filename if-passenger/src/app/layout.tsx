import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IF Passenger",
  description:
    "Inscreva-se agora e comece a economizar enquanto conecta com outros estudantes!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
