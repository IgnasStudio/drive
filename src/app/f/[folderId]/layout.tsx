import React from "react";
import { Footer } from "~/components/Footer";

export default function FolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col items-center justify-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}