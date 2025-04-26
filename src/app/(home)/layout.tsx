import React from "react";
import { Footer } from "~/components/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}