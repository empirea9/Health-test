import { useState } from "react";
import {
  Bell,
  MessageSquare,
  Search,
  Home,
  FileText,
  Pill,
  MapPinned,
  Menu,
  CalendarCheck2,
} from "lucide-react";

type Page = "Home" | "Docs" | "Medicines" | "Maps" | "Messages";

const navItems: Array<{
  label: Exclude<Page, "Messages">;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { label: "Home", icon: Home },
  { label: "Docs", icon: FileText },
  { label: "Medicines", icon: Pill },
  { label: "Maps", icon: MapPinned },
];

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activePage, setActivePage] = useState<Page>("Home");

  const jumpTo = (page: Page) => setActivePage(page);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 text-slate-800">
      <div className="flex h-full w-full">
        <aside
          className={`relative flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
            isSidebarExpanded ? "w-64" : "w-20"
          }`}
        >
          <button
            onClick={() => setIsSidebarExpanded((s) => !s)}
            className="mx-auto mt-4 flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="mt-6 flex-1 space-y-2 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => jumpTo(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isSidebarExpanded && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2">
              <img
                src="https://i.pravatar.cc/100?img=15"
                alt="User profile"
                className="h-10 w-10 rounded-full object-cover"
              />
              {isSidebarExpanded && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    Alex Johnson
                  </p>
                  <p className="truncate text-xs text-slate-500">Patient</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="flex h-full flex-1 flex-col overflow-hidden">
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div className="w-32" />

            <div className="flex flex-1 justify-center">
              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search appointments, doctors, medicines..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none ring-blue-200 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                />
              </div>
            </div>

            <div className="flex w-32 justify-end gap-3">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
              </button>
              <button
                onClick={() => jumpTo("Messages")}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
              </button>
            </div>
          </header>

          <div className="border-b border-blue-100 bg-blue-50 px-6 py-3 text-sm font-medium text-blue-700">
            <div className="flex items-center gap-2">
              <CalendarCheck2 className="h-4 w-4" />
              <span>Appointment booked for 26/08/26</span>
            </div>
          </div>

          <section className="flex min-h-0 flex-1 gap-4 p-4">
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="grid min-h-0 flex-1 grid-cols-12 gap-4">
                <div className="col-span-8 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-base font-semibold">Health Metrics</h2>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Stable
                    </span>
                  </div>
                  <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                    <p className="text-sm text-slate-400">
                      Placeholder Chart Area
                    </p>
                  </div>
                </div>

                <div className="col-span-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="mb-1 text-sm font-semibold text-slate-700">
                    Quick Actions
                  </h3>

                  <button
                    onClick={() => jumpTo("Maps")}
                    className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => jumpTo("Medicines")}
                    className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Order Medicine
                  </button>
                  <button
                    onClick={() => jumpTo("Docs")}
                    className="rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700"
                  >
                    View Reports
                  </button>
                  <button
                    onClick={() => jumpTo("Messages")}
                    className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Contact Doctor
                  </button>

                  <div className="mt-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                    Current page: 
                    <span className="font-semibold text-slate-700">
                      {activePage}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid h-28 grid-cols-12 gap-4">
                <div className="col-span-8 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <h4 className="text-sm font-semibold text-slate-700">
                    Latest Healthcare News
                  </h4>
                  <p className="mt-2 truncate text-sm text-slate-500">
                    • WHO highlights progress in preventive care • New digital health policies improve patient access • Telemedicine usage continues to rise
                  </p>
                </div>

                <div className="col-span-4 rounded-2xl border border-slate-200 bg-white p-3">
                  <h4 className="text-sm font-semibold text-slate-700">
                    Spending
                  </h4>
                  <div className="mt-2 flex items-center justify-center">
                    <div className="relative h-16 w-16 rounded-full bg-[conic-gradient(#2563eb_0_72%,#dbeafe_72%_100%)]">
                      <div className="absolute inset-2 rounded-full bg-white" />
                    </div>
                    <span className="ml-3 text-sm font-semibold text-slate-700">
                      72%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
