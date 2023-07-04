import "./globals.css";
import { Inter } from "next/font/google";
import AuthContext from "./AuthContext";
import { Header } from "../components";
import AppProvider from "../context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dash Upload",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <AppProvider>
            <div className="m-0 flex min-h-screen flex-col bg-gradient-to-tr from-slate-950 to-teal-950 p-0 text-white">
              <Header />
              <main className="flex flex-1 flex-col">{children}</main>
            </div>
          </AppProvider>
        </AuthContext>
      </body>
    </html>
  );
}
