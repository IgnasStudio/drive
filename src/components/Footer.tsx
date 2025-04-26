import React from "react";

export function Footer() {
  return (
    <div className="container mx-auto px-4 text-center">
      <footer className="mt-6 text-sm text-gray-400 pb-4">
        © {new Date().getFullYear()} Ignas Studio Drive
      </footer>
    </div>
  );
}