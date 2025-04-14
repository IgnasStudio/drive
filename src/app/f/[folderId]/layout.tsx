import React from "react";
import { Footer } from "~/components/footer";

export default function FolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex-grow flex flex-col items-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}