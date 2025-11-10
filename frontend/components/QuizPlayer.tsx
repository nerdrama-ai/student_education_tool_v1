import { useState } from "react";
import axios from "axios";

export default function QuizPlayer({ record }: { record: any }){
  const quizzes = record.quizzes || [];
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function choose(opt:number){
    setSelected(opt);
  }

  function submit(){
    if(selected === null) return;
    const q = quizzes[i];
    if(selected === q.correct_option) setScore(s=>s+1);
    // show explanation then next
    if(i+1 < quizzes.length){
      setI(i+1);
      setSelected(null);
    }else{
      setDone(true);
      // post analytics to backend
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/record/${record.id}/analytics`, { quiz_attempts: 1 }).catch(()=>{});
    }
  }

  function exportCSV(){
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/record/${record.id}/export_csv`
  }

  if(quizzes.length === 0) return <div className="text-sm text-gray-400">No quizzes generated for this upload.</div>;
  if(done) return <div className="p-4 rounded bg-[#061021]"><h3 className="text-lg">Finished</h3><p className="text-sm mt-2">Score: {score}/{quizzes.length}</p><button className="mt-3 px-3 py-1 bg-accent text-black rounded" onClick={()=> { setDone(false); setI(0); setScore(0); }}>Retry</button><button className="mt-3 ml-3 px-3 py-1 bg-[#0b1f2a] rounded" onClick={exportCSV}>Download CSV</button></div>

  const q = quizzes[i];
  return (
    <div>
      <div className="mb-3 text-sm text-gray-400">Question {i+1}/{quizzes.length}</div>
      <div className="p-4 rounded bg-[#061022] mb-3">
        <div className="font-semibold mb-3">{q.question}</div>
        <div className="grid gap-2">
          {q.options.map((opt:string, idx:number)=>(
            <button key={idx} onClick={()=> choose(idx)} className={`text-left p-3 rounded ${selected===idx ? 'ring-1 ring-accent' : 'hover:bg-slate-800'}`}>{String.fromCharCode(65+idx)}. {opt}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={submit} className="px-3 py-1 bg-accent text-black rounded">Submit</button>
        <button onClick={()=> setI(i+1)} className="px-3 py-1 bg-[#0b1f2a] rounded">Skip</button>
        <div className="ml-auto text-gray-400">Score: {score}</div>
      </div>
      <div className="mt-3 text-xs text-gray-400">Explanation: {q.explanation || '—'}</div>
    </div>
  )
}
