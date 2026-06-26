import Link from "next/link";
import Image from "next/image";

const APPS = [
  {
    id: "shady",
    name: "Shady",
    description: "Instagram tracker",
    icon: "/icons/shady.png",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 gap-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Screenshoot</h1>
        <p className="mt-2 text-sm text-white/40">Generate realistic iPhone lock screen notifications</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        {APPS.map((app) => (
          <Link
            key={app.id}
            href={`/${app.id}`}
            className="flex items-center gap-4 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 border border-white/8"
          >
            <div className="w-12 h-12 rounded-[10px] overflow-hidden bg-white/10 shrink-0">
              <Image src={app.icon} alt={app.name} width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-semibold text-sm">{app.name}</div>
              <div className="text-xs text-white/40 mt-0.5">{app.description}</div>
            </div>
            <div className="ml-auto text-white/20 text-lg">›</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
