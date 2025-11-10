// components/QuizPlayer.tsx
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import axios from "axios";
import { useEffect, useState } from "react";
import clsx from "clsx";

type Quiz = {
  title?: string;
  questions?: Array<{
    prompt?: string;
    options?: Array<string | { text: string }>;
  }>;
};

export default function QuizPlayer() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BACKEND}/quiz`)
      .then((r) => setQuiz(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // reset selection when index changes
    setSelected(null);
  }, [index]);

  if (loading)
    return (
      <div className="glass p-6 rounded-2xl text-center">
        Loading quiz...
      </div>
    );
  if (!quiz)
    return (
      <div className="glass p-6 rounded-2xl text-center text-gray-400">
        No quiz available
      </div>
    );

  const questions = quiz.questions || [];
  const q = questions[index] || null;
  const total = questions.length;
  const progress = total ? Math.round(((index + 1) / total) * 100) : 0;

  function next() {
    setIndex((i) => Math.min(total - 1, i + 1));
  }

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  }

  return (
    <div className="glass p-6 rounded-2xl" onKeyDown={handleKey} tabIndex={0}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400">
            {quiz.title || "Quiz"} · Question {index + 1} / {total}
          </div>
          <h3 className="text-lg font-semibold mt-2">{q?.prompt || "—"}</h3>
        </div>

        <div className="text-sm text-gray-300">{progress}%</div>
      </div>

      <div className="mt-5 grid gap-3">
        {(q?.options || []).map((opt, i) => {
          const text = (opt as any).text || opt;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={clsx(
                "text-left p-3 rounded-lg transition-transform transform hover:scale-[1.01] focus:outline-none",
                selected === i ? "ring-2 ring-indigo-400 bg-white/6" : "bg-white/3"
              )}
              aria-pressed={selected === i}
            >
              <div className="font-medium">{text}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="progress-track">
            <div
              className="progress-fill bg-gradient-to-r from-purple-500 to-cyan-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={prev} className="btn-fut glass" aria-label="Previous">
            Prev
          </button>
          <button
            onClick={next}
            className="btn-fut glass"
            aria-label="Next"
            disabled={index >= total - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
