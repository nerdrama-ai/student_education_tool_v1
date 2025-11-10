const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import axios from 'axios';
import { useEffect, useState } from 'react';
export default function QuizPlayer(props:any) {
  const [quiz, setQuiz] = useState<any|null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setLoading(true);
    axios.get(`${BACKEND}/quiz`).then(r=>setQuiz(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  },[])

  if(loading) return <div className="p-8 text-center">Loading quiz...</div>;
  if(!quiz) return <div className="p-8 text-center text-gray-400">No quiz available</div>;

  const q = quiz.questions?.[index];
  const total = quiz.questions?.length || 0;
  const progress = total ? Math.round(((index)/total)*100) : 0;

  function submitAnswer() {
    // keep simple: advance and clear
    setSelected(null);
    setIndex(i=>Math.min(total-1,i+1));
  }

  return (
    <div className="space-y-4">
      <div className="glass p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Question {index+1} / {total}</div>
            <div className="text-lg font-semibold">{q?.prompt || q?.question || '—'}</div>
          </div>
          <div className="text-xs text-gray-400">{quiz.title || 'Quiz'}</div>
        </div>

        <div className="mt-4 grid gap-3">
          {(q?.options || q?.choices || []).map((opt:any,i:number)=>(
            <button key={i} onClick={()=>setSelected(i)} className={
              "text-left p-3 rounded-md transition transform hover:scale-[1.01] " +
              (selected===i ? "ring-2 ring-indigo-400 bg-white/4" : "bg-white/2")
            }>
              <div className="font-medium">{opt.text || opt}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="w-2/3">
            <div className="progress-track">
              <div className="progress-fill bg-gradient-to-r from-purple-500 to-cyan-400" style={{width: `${progress}%`}}></div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-fut glass" onClick={()=>setIndex(i=>Math.max(0,i-1))}>Prev</button>
            <button className="btn-fut glass" onClick={submitAnswer}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
