import React, { useState } from "react";
import { X, Loader2, Image as ImageIcon, User as UserIcon,Lock,Trash2 } from "lucide-react";
import type { User } from "../types";
import { useChatState } from "../context/ChatProvider";
import API from "../config/api";



interface Props {
  user: User;
  onClose: () => void;
}

const EditProfileModal: React.FC<Props> = ({ user, onClose }) => {
  const { setUser } = useChatState();

  // ------------------ Profile State ------------------
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user.avatar || null);
  const [loading, setLoading] = useState(false);

  // ------------------ Password State ------------------
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // ------------------ Delete State ------------------
  const [deleting, setDeleting] = useState(false);

  // ------------------ Avatar Change ------------------
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ------------------ Update Profile ------------------
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", name);
      if (avatar) form.append("avatar", avatar);

      const { data } = await API.put("/user/profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Update Password ------------------
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingPassword(true);

    try {
      await API.put("/user/updatePassword", {
        oldPassword,
        newPassword,
      });

      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Password update failed");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // ------------------ Delete User Account ------------------
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action is permanent.")) return;

    setDeleting(true);

    try {
      await API.delete("/user/deletePassword");

      // Clear all data and logout
      localStorage.removeItem("userInfo");
      window.location.href = "/";
    } catch (error: any) {
      alert(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 w-full max-w-lg rounded-2xl border border-gray-800 p-6 relative overflow-y-auto max-h-[90vh]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

        {/* ------------------- UPDATE PROFILE SECTION ------------------- */}
        <h3 className="text-lg font-semibold text-gray-200 mb-3">Profile Info</h3>

        <form onSubmit={handleUpdateProfile} className="space-y-5 mb-10">

          {/* Avatar */}
          <div className="flex items-center gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover border border-gray-700"
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-800 text-gray-500 border border-gray-700">
                <ImageIcon size={22} />
              </div>
            )}

            <label className="block w-full cursor-pointer">
              <span className="text-gray-400 text-sm">Change Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-2 block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-blue-500/10 file:text-blue-400
                  hover:file:bg-blue-500/20"
              />
            </label>
          </div>

          {/* Name */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <UserIcon size={20} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value.replace(/\b\w/g, (char) => char.toUpperCase()))
              }
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 
              rounded-xl text-white placeholder-gray-500 focus:border-blue-500 
              focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
          </button>
        </form>

        {/* ------------------- CHANGE PASSWORD SECTION ------------------- */}
        <h3 className="text-lg font-semibold text-gray-200 mb-3">Change Password</h3>

        <form onSubmit={handlePasswordUpdate} className="space-y-5 mb-10">

          {/* Old Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 
              rounded-xl text-white placeholder-gray-500 focus:border-blue-500 
              focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* New Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 
              rounded-xl text-white placeholder-gray-500 focus:border-blue-500 
              focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            disabled={updatingPassword}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            {updatingPassword ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        {/* ------------------- DELETE ACCOUNT SECTION ------------------- */}
        <h3 className="text-lg font-semibold text-gray-200 mb-3">Danger Zone</h3>

        <button
          disabled={deleting}
          onClick={handleDeleteAccount}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {deleting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Trash2 size={18} /> Delete Account
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EditProfileModal;

