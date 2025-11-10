const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import axios from "axios";
import { useState } from "react";

export default function UploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function upload() {
    if (!file) return setStatus("Select a file first");
    const fd = new FormData();
    fd.append("file", file);
    setStatus("Uploading...");
    try {
      await axios.post(`${BACKEND}/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("Uploaded successfully");
    } catch (e) {
      setStatus("Upload failed");
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm"
      />
      <div className="flex gap-2">
        <button className="btn-fut glass" onClick={upload}>
          Upload
        </button>
        <button className="btn-fut glass" onClick={() => setStatus(null)}>
          Reset
        </button>
      </div>
      {status && <div className="text-sm text-gray-300">{status}</div>}
    </div>
  );
}
