import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { inter } from "@/utils/fonts";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
export const metadata: Metadata = {
  title: "Seatwell Prototype",
  description: "A clickable Seatwell resale prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className=" bg-white">
      <body className={` ${inter.className} dark:bg-gray-900`}>
        <StoreProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
