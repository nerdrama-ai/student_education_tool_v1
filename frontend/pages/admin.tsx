const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import AdminRoster from "../components/AdminRoster";
import UploadPanel from "../components/UploadPanel";
export default function AdminPage() {
  return (
    <div className="min-h-screen p-8">
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold accent">Admin Console</h1>
        <a href="/" className="btn-fut glass">Back to Home</a>
      </header>
      <main className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        <section className="col-span-8 glass p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Roster</h2>
          <AdminRoster />
        </section>
        <aside className="col-span-4 glass p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Upload Panel</h2>
          <UploadPanel />
        </aside>
      </main>
    </div>
  );
}
