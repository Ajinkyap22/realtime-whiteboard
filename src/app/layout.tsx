import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "@/app/globals.css";

import ChakraProvider from "@/app/providers/ChakraProvider";
import SessionProvider from "@/app/providers/SessionProvider";

import { getServerSession } from "next-auth";

import Navbar from "@/app/components/Navbar";
import { QueryClientProviders } from "./providers/QueryClientProvider";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={figtree.className}>
        <SessionProvider session={session}>
          <QueryClientProviders>
            <ChakraProvider>
              <Navbar />

              {children}
            </ChakraProvider>
          </QueryClientProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
