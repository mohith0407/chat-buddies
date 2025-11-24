import { X, Mail, User as UserIcon } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import type { User } from "../types";

export interface ViewUserModalProps {
  user: User;
  isGroup?: boolean;
  groupAdminId?: string;
  onClose: () => void;
}

const ViewUserModal = ({ user, isGroup, groupAdminId, onClose }: ViewUserModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="h-24 bg-linear-to-r from-blue-600 to-purple-600 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white bg-black/20 rounded-full p-1 hover:bg-black/40 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 relative">
          <div className="-mt-12 mb-4 flex justify-center">
            <div className="p-1 bg-gray-800 rounded-full">
              <UserAvatar user={user} className="w-24 h-24" />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              {user.name}

              {isGroup && user._id === groupAdminId && (
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 
                rounded-full border border-green-500/30">
                  Admin
                </span>
              )}
            </h3>

            <div className="bg-gray-900/50 rounded-xl p-4 text-left border border-gray-700/50 space-y-3">

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Email</p>
                  <p className="text-sm text-gray-200">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <UserIcon size={18} className="text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">User ID</p>
                  <p className="text-sm text-gray-200 font-mono">
                    {user._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
