import { useState } from "react";

export default function FlashcardViewer({ flashcards }: { flashcards: any[] }){
  const [idx, setIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);
  if(!flashcards || flashcards.length === 0) return <div className="text-sm text-gray-400">No flashcards yet</div>;
  const fc = flashcards[idx];
  return (
    <div>
      <div className="p-6 rounded border border-gray-800 text-center hover:cursor-pointer" onClick={()=> setShowBack(!showBack)}>
        <div className="text-xl font-semibold mb-2">{ showBack ? fc.back : fc.front }</div>
        <div className="text-xs text-gray-400">{ showBack ? 'Back' : 'Front'}</div>
      </div>

      <div className="flex justify-between items-center mt-3">
        <button className="px-3 py-1 bg-[#0b1f2a]" onClick={()=> { setIdx((idx-1+flashcards.length)%flashcards.length); setShowBack(false); }}>Prev</button>
        <div className="text-sm text-gray-400">{idx+1} / {flashcards.length}</div>
        <button className="px-3 py-1 bg-[#0b1f2a]" onClick={()=> { setIdx((idx+1)%flashcards.length); setShowBack(false); }}>Next</button>
      </div>
    </div>
  )
}
