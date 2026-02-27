import { useState, useEffect } from "react";
import { updateProfile } from "../services/api.js";

function SettingsModal({ show, onClose, user, onUserUpdate }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", email: user.email || "", password: "" });
      setMessage({ text: "", type: "" });
    }
  }, [user, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const payload = { name: formData.name, email: formData.email };
      if (formData.password) {
        payload.password = formData.password;
      }
      const { data } = await updateProfile(payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      onUserUpdate({ name: data.name, email: data.email });
      setMessage({ text: "Profile updated successfully!", type: "success" });
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to update profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg mx-4 p-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-black text-black">Settings</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-black transition-colors">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
        <p className="text-sm text-slate-500 font-medium mb-6">Update your profile information.</p>

        {message.text && (
          <div className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${message.type === "success" ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-black mb-1.5" htmlFor="settings-name">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
              <input
                id="settings-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 text-sm focus:ring-2 focus:ring-[#2DFF81] focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1.5" htmlFor="settings-email">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </div>
              <input
                id="settings-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 text-sm focus:ring-2 focus:ring-[#2DFF81] focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1.5" htmlFor="settings-password">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <input
                id="settings-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 text-sm focus:ring-2 focus:ring-[#2DFF81] focus:border-black placeholder:text-slate-400"
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-black py-3 text-sm font-bold text-black hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-[#2DFF81] border border-black py-3 text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:brightness-95 transition-all active:translate-y-0.5 active:shadow-none disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsModal;
