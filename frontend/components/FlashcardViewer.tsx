// components/FlashcardViewer.tsx
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import axios from "axios";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function FlashcardViewer() {
  const [cards, setCards] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    axios.get(`${BACKEND}/flashcards`).then((r) => setCards(r.data || []));
  }, []);

  if (!cards.length)
    return <div className="text-sm text-gray-400">No flashcards</div>;

  const c = cards[idx % cards.length];

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setFlipped((s) => !s)}
        onKeyDown={(e) => e.key === "Enter" && setFlipped((s) => !s)}
        className={clsx(
          "relative w-full min-h-[110px] p-6 rounded-lg perspective",
          "cursor-pointer select-none"
        )}
      >
        <div
          className={clsx(
            "card transition-transform duration-500 ease-in-out w-full h-full rounded-lg p-4",
            flipped ? "is-flipped" : ""
          )}
        >
          <div className="card-face card-front glass p-4 rounded-lg">
            <div className="font-semibold text-lg">{c.front}</div>
            <div className="text-xs text-gray-400 mt-2">Tap to flip</div>
          </div>

          <div className="card-face card-back glass p-4 rounded-lg">
            <div className="font-medium">{c.back}</div>
            <div className="text-xs text-gray-400 mt-2">Tap to flip back</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button className="btn-fut glass" onClick={() => setIdx((i) => Math.max(0, i - 1))}>
          Prev
        </button>
        <button className="btn-fut glass" onClick={() => setIdx((i) => i + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
