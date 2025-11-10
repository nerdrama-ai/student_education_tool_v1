// components/Header.tsx
import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-extrabold accent">Quizway</h1>
        <div className="text-sm text-gray-400">Futuristic learning — clean, fast, and delightful</div>
      </div>

      <nav className="flex gap-3 items-center">
        <a href="/" className="btn-fut glass">Home</a>
        <a href="/admin" className="btn-fut glass">Admin</a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            const dark = document.documentElement.classList.toggle("dark");
            localStorage.setItem("theme", dark ? "dark" : "light");
          }}
          className="btn-fut glass"
        >
          Toggle Theme
        </a>
      </nav>
    </header>
  );
}
