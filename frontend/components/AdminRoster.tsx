const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminRoster() {
  const [roster, setRoster] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${BACKEND}/roster`).then((r) => setRoster(r.data || []));
  }, []);

  return (
    <div className="space-y-3">
      <ul className="divide-y divide-white/6 max-h-96 overflow-auto">
        {roster.map((r, i) => (
          <li key={i} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{r.name || r.email}</div>
              <div className="text-xs text-gray-400">{r.role || "student"}</div>
            </div>
            <div className="text-sm text-gray-400">{r.id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
