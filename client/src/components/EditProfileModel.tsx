import React, { useState } from "react";
import { X, Loader2, Image as ImageIcon, User as UserIcon } from "lucide-react";
import type { User } from "../types";
import { useChatState } from "../context/ChatProvider";
import API from "../config/api";

interface Props {
  user: User;
  onClose: () => void;
}

const EditProfileModal: React.FC<Props> = ({ user, onClose }) => {
  const { setUser } = useChatState();

  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user.avatar || null);
  const [loading, setLoading] = useState(false);

  // ------------------ Handle avatar change ------------------
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ------------------ Submit update ------------------
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (avatar) formData.append("avatar", avatar);

      const { data } = await API.put("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update local storage + global context
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 w-full max-w-md rounded-2xl border border-gray-800 p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Edit Profile</h2>

        <form onSubmit={handleUpdate} className="space-y-5">

          {/* Avatar Preview + Upload */}
          <div className="flex items-center gap-4">
            <div className="shrink-0">
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
            </div>

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
                  hover:file:bg-blue-500/20 cursor-pointer"
              />
            </label>
          </div>

          {/* Name Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon
                size={20}
                className="text-gray-500 group-focus-within:text-blue-500"
              />
            </div>
            <input
              type="text"
              value={name}
              placeholder="Full Name"
              onChange={(e) =>
                setName(
                  e.target.value.replace(/\b\w/g, (char) => char.toUpperCase())
                )
              }
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 
                rounded-xl text-white placeholder-gray-500 
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Update Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl 
                transition duration-200 font-semibold flex items-center 
                justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
