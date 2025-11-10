const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import axios from "axios";
import { useEffect, useState } from "react";
import FlashcardViewer from "../components/FlashcardViewer";
import QuizPlayer from "../components/QuizPlayer";

export default function Home() {
  const [records, setRecords] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setBusy(true);
    axios.get(`${BACKEND}/records`).then(r=>{ setRecords(r.data || []); }).catch(()=>{}).finally(()=>setBusy(false));
  },[])

  return (
    <div className="min-h-screen p-8">
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold accent">Quizway — Student Education Tool</h1>
          <p className="text-sm text-gray-400">Futuristic UI, improved continuity, production-ready layout</p>
        </div>
        <nav className="flex gap-3 items-center">
          <a href="/admin" className="btn-fut bg-white/4 px-4 py-2 rounded-md glass">Admin</a>
          <a href="#" onClick={(e)=>{e.preventDefault(); const t = document.documentElement.classList.toggle('dark'); localStorage.setItem('theme', t ? 'dark' : 'light');}} className="btn-fut glass">Toggle Theme</a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        <section className="col-span-8 glass p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Quiz Player</h2>
          <QuizPlayer />
        </section>

        <aside className="col-span-4 space-y-6">
          <div className="glass p-4 rounded-xl">
            <h3 className="font-semibold mb-3">Available Records</h3>
            {busy ? <div className="text-sm text-gray-400">Loading...</div> : (
              <ul className="space-y-2 max-h-64 overflow-auto">
                {records.map(r=>(
                  <li key={r.id} className={"p-3 rounded-md hover:scale-[1.01] transition transform cursor-pointer " + (selected?.id===r.id ? "ring-2 ring-purple-400" : "bg-white/2")} onClick={()=>setSelected(r)}>
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{r.title || r.name || 'Untitled'}</div>
                        <div className="text-xs text-gray-400">{r.description || r.summary || ''}</div>
                      </div>
                      <div className="text-xs text-gray-400">{new Date(r.created_at||r.createdAt||Date.now()).toLocaleDateString()}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass p-4 rounded-xl">
            <h3 className="font-semibold mb-3">Flashcards</h3>
            <FlashcardViewer />
          </div>

          <div className="glass p-4 rounded-xl">
            <h3 className="font-semibold mb-3">Upload</h3>
            <a href="/admin" className="btn-fut glass block text-center">Manage Content</a>
          </div>
        </aside>
      </main>
    </div>
  );
}
