// components/Layout.tsx
import React from "react";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto">
      <Header />
      <main className="mt-8">{children}</main>
      <footer className="mt-12 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Quizway — Built for learning
      </footer>
    </div>
  );
}
