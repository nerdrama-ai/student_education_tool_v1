import axios from "axios";
import { useState, useEffect } from "react";
import UploadPanel from "../components/UploadPanel";
import AdminRoster from "../components/AdminRoster";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function Admin(){
  const [records, setRecords] = useState<any[]>([]);
  useEffect(()=>{ fetchRec() }, []);
  async function fetchRec(){
    try{
      const r = await axios.get(`${BACKEND}/records`);
      setRecords(r.data.records);
    }catch(e){ console.error(e) }
  }
  return (
    <div className="container">
      <header className="flex justify-between items-center py-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <a href="/" className="text-sm">Student View</a>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#081026] p-4 rounded">
          <h2 className="font-semibold mb-3">Upload PDF</h2>
          <UploadPanel onUploaded={fetchRec} />
        </div>
        <div className="bg-[#081026] p-4 rounded">
          <h2 className="font-semibold mb-3">Roster</h2>
          <AdminRoster records={records} refresh={fetchRec} />
        </div>
      </div>
    </div>
  )
}
