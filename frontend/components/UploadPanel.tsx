import axios from "axios";
import { useState } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function UploadPanel({ onUploaded }: { onUploaded?: ()=>void }){
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);

  async function doUpload(){
    if(!file) return;
    setStatus("Uploading...");
    const fd = new FormData();
    fd.append("file", file);
    try{
      const res = await axios.post(`${BACKEND}/upload`, fd, {
        headers: {"Content-Type":"multipart/form-data"},
        onUploadProgress: (e)=> setProgress(Math.round((e.loaded/e.total)*100))
      });
      setStatus("Processing complete");
      setProgress(100);
      if(onUploaded) onUploaded();
    }catch(err:any){
      setStatus("Upload/processing failed: " + (err?.response?.data?.detail || err?.message));
    }
  }

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={(e)=> setFile(e.target.files?.[0] ?? null)} />
      <div className="mt-3 flex gap-2">
        <button className="px-3 py-1 rounded bg-accent text-black" onClick={doUpload}>Upload & Process</button>
      </div>
      <div className="mt-3">
        <div className="w-full bg-gray-800 rounded h-3">
          <div style={{width: `${progress}%`}} className="h-3 rounded bg-gradient-to-r from-accent to-accent2"></div>
        </div>
        <div className="text-sm text-gray-400 mt-1">{status || 'Idle'}</div>
      </div>
    </div>
  );
}
