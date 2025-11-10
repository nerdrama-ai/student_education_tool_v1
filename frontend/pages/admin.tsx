// pages/admin.tsx
import AdminRoster from "../components/AdminRoster";
import UploadPanel from "../components/UploadPanel";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div className="glass p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold accent">Admin Console</h1>
          <p className="text-sm text-gray-300">Manage roster & content uploads</p>
        </div>
        <a href="/" className="btn-fut glass">
          Back to Home
        </a>
      </div>

      <main className="grid grid-cols-12 gap-6">
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
