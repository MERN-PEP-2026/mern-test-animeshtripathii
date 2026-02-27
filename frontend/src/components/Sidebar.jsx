import { useNavigate } from "react-router-dom";

function Sidebar({ user, onLogout, onSettings }) {
  return (
    <aside className="flex w-72 flex-col justify-between bg-[#0B2B26] p-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2DFF81] ring-2 ring-white/20">
            <span className="text-sm font-black text-black">{user.name?.charAt(0)?.toUpperCase() || "U"}</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-sm font-semibold leading-tight">{user.name || "User"}</h1>
            <p className="text-white/60 text-xs font-medium">{user.email || ""}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2DFF81] text-black" href="#">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="text-sm font-bold">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">check_box</span>
            <span className="text-sm font-medium">My Tasks</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            <span className="text-sm font-medium">Calendar</span>
          </a>
        </nav>
      </div>

      <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
        <button onClick={onSettings} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors w-full">
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
