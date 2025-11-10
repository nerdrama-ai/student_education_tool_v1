import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function AdminRoster({ records, refresh }: { records:any[], refresh?: ()=>void }){
  async function exportCsv(id:string){
    const url = `${BACKEND}/record/${id}/export_csv`;
    const res = await axios.post(url, {}, { responseType: 'blob' });
    const href = URL.createObjectURL(res.data);
    const a = document.createElement('a'); a.href=href; a.download = `quizzes_${id}.csv`; a.click();
    URL.revokeObjectURL(href);
  }
  return (
    <div className="space-y-3">
      {records.map(r => (
        <div key={r.id} className="p-3 bg-[#071022] rounded flex justify-between items-center">
          <div>
            <div className="font-medium">{r.filename}</div>
            <div className="text-xs text-gray-400">{r.status}</div>
          </div>
          <div className="flex gap-2">
            <button className="px-2 py-1 bg-[#0b1f2a] text-sm" onClick={()=> exportCsv(r.id)}>Export CSV</button>
            <button className="px-2 py-1 bg-[#0b1f2a] text-sm" onClick={()=> window.location.href = `/record/${r.id}`}>Open</button>
          </div>
        </div>
      ))}
    </div>
  )
}
