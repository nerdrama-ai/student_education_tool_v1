// pages/index.tsx
import FlashcardViewer from "../components/FlashcardViewer";
import QuizPlayer from "../components/QuizPlayer";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function Home() {
  const [records, setRecords] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setBusy(true);
    axios
      .get(`${BACKEND}/records`)
      .then((r) => setRecords(r.data || []))
      .catch(() => {})
      .finally(() => setBusy(false));
  }, []);

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-12 gap-6 items-start">
        <main className="col-span-8 space-y-6">
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold">Play a Quiz</h2>
                <p className="text-sm text-gray-300 mt-1">
                  Fast, responsive quiz player with progress and accessibility
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="btn-fut glass"
                  onClick={() => {
                    const dark = document.documentElement.classList.toggle("dark");
                    localStorage.setItem("theme", dark ? "dark" : "light");
                  }}
                >
                  Toggle Theme
                </button>
                <a href="/admin" className="btn-fut glass">
                  Admin
                </a>
              </div>
            </div>
          </div>

          <QuizPlayer />
        </main>

        <aside className="col-span-4 space-y-6">
          <div className="glass p-4 rounded-xl">
            <h3 className="font-semibold mb-3">Available Records</h3>
            {busy ? (
              <div className="text-sm text-gray-400">Loading...</div>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-auto">
                {records.map((r) => (
                  <li
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={
                      "p-3 rounded-md transition transform cursor-pointer flex items-start justify-between " +
                      (selected?.id === r.id ? "ring-2 ring-purple-400 bg-white/4" : "bg-white/3 hover:scale-[1.01]")
                    }
                  >
                    <div>
                      <div className="font-medium">{r.title || r.name || "Untitled"}</div>
                      <div className="text-xs text-gray-400 mt-1">{r.description || r.summary || ""}</div>
                    </div>
                    <div className="text-xs text-gray-400 ml-4">
                      {new Date(r.created_at || r.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </li>
                ))}
                {!records.length && <li className="text-sm text-gray-400">No records found</li>}
              </ul>
            )}
          </div>

          <div className="glass p-4 rounded-xl">
            <h3 className="font-semibold mb-3">Flashcards</h3>
            <FlashcardViewer />
          </div>

          <div className="glass p-4 rounded-xl">
            <h3 className="font-semibold mb-3">Manage Content</h3>
            <a href="/admin" className="btn-fut glass block text-center">
              Go to Admin Console
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}
