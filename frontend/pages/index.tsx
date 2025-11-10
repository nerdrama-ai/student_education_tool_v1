import axios from "axios";
import { useEffect, useState } from "react";
import FlashcardViewer from "../components/FlashcardViewer";
import QuizPlayer from "../components/QuizPlayer";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function Home() {
  const [records, setRecords] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => { fetchRecords() }, []);

  async function fetchRecords(){
    try{
      const r = await axios.get(`${BACKEND}/records`);
      setRecords(r.data.records);
      if(r.data.records.length && !selected) setSelected(r.data.records[0]);
    }catch(e){
      console.error(e);
    }
  }

  async function refreshSelected(){
    if(!selected) return;
    const r = await axios.get(`${BACKEND}/record/${selected.id}`);
    setSelected(r.data);
    setRecords(prev => prev.map(x=>x.id===r.data.id ? r.data : x));
  }

  return (
    <div className="container">
      <header className="flex items-center justify-between py-6">
        <h1 className="text-3xl font-bold">StudyAssist — Your Intelligent Study Companion</h1>
        <nav className="space-x-4 text-sm text-gray-300">
          <a href="/admin">Admin</a>
        </nav>
      </header>

      <main className="grid md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 bg-[#0f1724] p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Uploads</h2>
          <div className="space-y-2">
            {records.map(r => (
              <button key={r.id} className={`w-full text-left p-2 rounded ${selected?.id === r.id ? 'ring-1 ring-accent' : 'hover:bg-slate-800'}`} onClick={()=>{ setSelected(r); }}>
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{r.filename}</div>
                    <div className="text-xs text-gray-400">{r.status} | {new Date(r.created_at).toLocaleString()}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="md:col-span-3 space-y-6">
          {!selected && <div className="p-6 bg-[#081025] rounded">No upload selected.</div>}
          {selected && (
            <>
              <div className="p-4 bg-[#081025] rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{selected.filename}</h3>
                    <p className="text-sm text-gray-400">Status: {selected.status}</p>
                  </div>
                  <div>
                    <button onClick={refreshSelected} className="px-3 py-1 rounded bg-[#0b1f2a] text-sm">Refresh</button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#071022] p-4 rounded">
                  <h4 className="font-semibold mb-2">Flashcards</h4>
                  <FlashcardViewer flashcards={selected.flashcards || []} />
                </div>
                <div className="bg-[#071022] p-4 rounded">
                  <h4 className="font-semibold mb-2">Quiz</h4>
                  <QuizPlayer record={selected} />
                </div>
              </div>

            </>
          )}
        </section>
      </main>
    </div>
  )
}
