import React from "react";
import { X, Check, UserPlus } from "lucide-react";
import type { User } from "../../types";
import { UserAvatar } from "../UserAvatar";
import { toTitleCase } from "../../utils/toTitleCase";

interface GroupModalProps {
  show: boolean;
  onClose: () => void;
  groupName: string;
  setGroupName: (v: string) => void;

  searchText: string;
  onSearchTextChange: (v: string) => void;

  searchResults: User[];
  selectedUsers: User[];

  addUser: (u: User) => void;
  removeUser: (id: string) => void;

  createGroup: () => void;
  loading: boolean;
}

const GroupModal: React.FC<GroupModalProps> = ({
  show,
  onClose,
  groupName,
  setGroupName,
  searchText,
  onSearchTextChange,
  searchResults,
  selectedUsers,
  addUser,
  removeUser,
  createGroup,
  loading,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-5 animate-fadeIn">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">Create Group</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* ICON */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 text-blue-400 flex items-center justify-center text-3xl font-bold shadow-lg">
            {groupName ? groupName.charAt(0).toUpperCase() : "?"}
          </div>
        </div>

        {/* GROUP NAME INPUT */}
        <input
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(toTitleCase(e.target.value))}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none"
        />

        {/* SELECTED USERS */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 bg-gray-800 p-2 rounded-lg border border-gray-700 mt-4">
            {selectedUsers.map((u) => (
              <span
                key={u._id}
                className="flex items-center gap-2 bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full border border-blue-500/40 text-sm"
              >
                {u.name}
                <X
                  size={14}
                  className="cursor-pointer hover:text-white"
                  onClick={() => removeUser(u._id)}
                />
              </span>
            ))}
          </div>
        )}

        {/* ADD MEMBERS */}
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mt-4">
          <h3 className="text-xs font-bold text-blue-400 uppercase mb-3 flex items-center gap-2">
            <UserPlus size={14} /> Add Members
          </h3>

          <input
            value={searchText}
            placeholder="Search users..."
            onChange={(e) => onSearchTextChange(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
          />

          <div className="max-h-36 overflow-y-auto mt-3 space-y-2 custom-scrollbar">
            {searchText.length > 0 && searchResults.length === 0 && (
              <p className="text-gray-500 text-sm text-center">No results</p>
            )}

            {searchResults.slice(0, 6).map((u) => (
              <div
                key={u._id}
                onClick={() => addUser(u)}
                className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition cursor-pointer"
              >
                <UserAvatar user={u} />
                <div>
                  <p className="text-gray-200 text-sm font-semibold">{u.name}</p>
                  <p className="text-gray-500 text-xs">{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CREATE BUTTON */}
        <button
          onClick={createGroup}
          disabled={loading}
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-spin border-2 border-white/30 border-t-transparent w-4 h-4 rounded-full"></span>
          ) : (
            <Check size={18} />
          )}
          {loading
  ? "Creating..."
  : `Create Group (${selectedUsers.length})`}
        </button>

        {/* CANCEL */}
        <button
          onClick={onClose}
          className="w-full mt-2 bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GroupModal;
