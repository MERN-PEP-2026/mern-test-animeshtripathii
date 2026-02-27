import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ user: currentUser, onLogout: handleSignOut, onSettings: openSettingsPanel }) => {
  const appNavigate = useNavigate();

  const navigationLinks = [
    { name: "Overview", icon: "dashboard", active: true },
    { name: "My Work", icon: "check_box", active: false },
    { name: "Schedule", icon: "calendar_month", active: false },
  ];

  const getInitials = (personName) => {
    return personName ? personName.charAt(0).toUpperCase() : "?";
  };

  return (
    <nav className="flex w-72 flex-col justify-between bg-[#0B2B26] p-5 shadow-xl shadow-black/10">
      <div className="space-y-8">
        <div className="flex items-center gap-4 px-2 tracking-tight">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2DFF81] font-bold text-[#0B2B26] shadow-md">
            {getInitials(currentUser.name)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-white">{currentUser.name || "Guest User"}</span>
            <span className="truncate text-xs text-slate-400">{currentUser.email || "No email"}</span>
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {navigationLinks.map((link) => (
            <li key={link.name}>
              <a
                href="#"
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ease-in-out ${
                  link.active
                    ? "bg-[#2DFF81]/10 font-semibold text-[#2DFF81]"
                    : "font-medium text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 border-t border-white/5 pt-5">
        <button
          onClick={openSettingsPanel}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          Preferences
        </button>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
