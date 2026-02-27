import React, { useState, useEffect } from "react";
import { updateProfile } from "../services/api.js";

const SettingsModal = ({ isVisible, closeHandler, currentUser, refreshUserData }) => {
  const [profileInputs, setProfileInputs] = useState({ name: "", email: "", password: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState({ msg: "", type: "" });

  useEffect(() => {
    if (currentUser) {
      setProfileInputs({ name: currentUser.name || "", email: currentUser.email || "", password: "" });
      setFeedback({ msg: "", type: "" });
    }
  }, [currentUser, isVisible]);

  const updateProp = (field, value) => {
    setProfileInputs((prev) => ({ ...prev, [field]: value }));
  };

  const executeSave = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setFeedback({ msg: "", type: "" });
    try {
      const payloadBody = { name: profileInputs.name, email: profileInputs.email };
      if (profileInputs.password.trim() !== "") {
        payloadBody.password = profileInputs.password;
      }
      
      const response = await updateProfile(payloadBody);
      const { token, name, email } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ name, email }));
      
      refreshUserData({ name, email });
      setFeedback({ msg: "Information saved successfully.", type: "good" });
      setProfileInputs((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      const errMsg = err.response?.data?.message || "An error occurred while saving.";
      setFeedback({ msg: errMsg, type: "bad" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2B26]/40 p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100">
        <div className="flex flex-col p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#0B2B26]">My Profile</h2>
              <p className="mt-1 text-sm text-slate-400">Update your account credentials.</p>
            </div>
            <button
              onClick={closeHandler}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-[#0B2B26]"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {feedback.msg && (
            <div className={`mb-5 rounded-xl px-4 py-3 text-sm font-medium ${feedback.type === "good" ? "bg-[#2DFF81]/10 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {feedback.msg}
            </div>
          )}

          <form onSubmit={executeSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0B2B26]" htmlFor="setName">Full Name</label>
              <input
                id="setName"
                type="text"
                required
                value={profileInputs.name}
                onChange={(e) => updateProp("name", e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0B2B26] transition-all focus:border-[#2DFF81] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2DFF81]/10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0B2B26]" htmlFor="setEmail">Email Address</label>
              <input
                id="setEmail"
                type="email"
                required
                value={profileInputs.email}
                onChange={(e) => updateProp("email", e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0B2B26] transition-all focus:border-[#2DFF81] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2DFF81]/10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0B2B26]" htmlFor="setPass">New Password</label>
              <input
                id="setPass"
                type="password"
                placeholder="Leave blank if no change"
                value={profileInputs.password}
                onChange={(e) => updateProp("password", e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0B2B26] placeholder:text-slate-400 transition-all focus:border-[#2DFF81] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2DFF81]/10"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={closeHandler}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 rounded-xl bg-[#0B2B26] py-2.5 text-sm font-semibold text-[#2DFF81] transition-colors hover:bg-[#071d1a] disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Update Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
