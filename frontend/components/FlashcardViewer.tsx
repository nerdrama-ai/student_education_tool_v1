const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import axios from "axios";
import { useEffect, useState } from "react";

export default function FlashcardViewer() {
  const [cards, setCards] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    axios.get(`${BACKEND}/flashcards`).then((r) => setCards(r.data || []));
  }, []);

  if (!cards.length)
    return <div className="text-sm text-gray-400">No flashcards</div>;

  const c = cards[idx % cards.length];
  return (
    <div>
      <div className="glass p-4 rounded-lg">
        <div className="font-semibold">{c.front}</div>
        <div className="text-sm text-gray-400 mt-2">{c.back}</div>
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
