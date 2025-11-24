import { useState, useMemo } from "react";
import { useChatState } from "../../../context/ChatProvider";
import { getSenderFull } from "../../../utils/chatLogics";
import { UserAvatar } from "../../UserAvatar";
import { X, UserPlus, Trash2, Edit2, Check } from "lucide-react";
import API from "../../../config/api";
import { toast } from "react-toastify";
import type { User } from "../../../types";
import ViewUserModal from "../../ViewUserModel";

const InfoSidebar = () => {
  const { selectedChat, user, setIsProfileOpen, setSelectedChat } = useChatState();

  const [renameLoading, setRenameLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [viewUser, setViewUser] = useState<User | null>(null);

  if (!selectedChat || !user) return null;

  const isGroup = selectedChat.isGroupChat;
  const isAdmin = isGroup && selectedChat.groupAdmin?._id === user._id;

  const chatUser = !isGroup ? getSenderFull(user, selectedChat.users) : null;

  const sortedUsers = useMemo(() => {
    if (!isGroup) return [];
    const adminId = selectedChat.groupAdmin?._id;

    return [...selectedChat.users].sort((a, b) => {
      if (a._id === adminId) return -1;
      if (b._id === adminId) return 1;
      return 0;
    });
  }, [selectedChat.users, selectedChat.groupAdmin, isGroup]);

  // ----------------------
  // HANDLERS
  // ----------------------

  const handleRename = async () => {
    if (!groupName) return;

    try {
      setRenameLoading(true);

      const { data } = await API.put("/chat/rename", {
        chatId: selectedChat._id,
        chatName: groupName,
      });

      setSelectedChat(data);
      setIsEditingName(false);
      toast.success("Group name updated");
    } catch {
      toast.error("Failed to rename");
    } finally {
      setRenameLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const { data } = await API.put("/chat/groupremove", {
        chatId: selectedChat._id,
        userId,
      });

      if (userId === user._id) {
        setSelectedChat(null);
        setIsProfileOpen(false);
      } else {
        setSelectedChat(data);
      }
    } catch {
      toast.error("Failed to remove user");
    }
  };

  const handleSearch = async (query: string) => {
    setSearch(query);

    if (!query) return setSearchResults([]);

    try {
      setLoading(true);
      const { data } = await API.get(`/user?search=${query}`);
      setSearchResults(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (u: User) => {
    if (selectedChat.users.some((x) => x._id === u._id)) {
      toast.error("User already in group");
      return;
    }

    try {
      const { data } = await API.put("/chat/groupadd", {
        chatId: selectedChat._id,
        userId: u._id,
      });

      setSelectedChat(data);
      setSearch("");
      setSearchResults([]);
      toast.success(`${u.name} added`);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to add user");
    }
  };

  // ----------------------


  return (
    <>
      <div className="h-full bg-gray-900 border-l border-gray-800 shadow-xl w-full md:w-80 flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
          <h2 className="font-semibold text-lg text-white">
            {isGroup ? "Group Info" : "Contact Info"}
          </h2>
          <button onClick={() => setIsProfileOpen(false)} className="text-gray-400 hover:bg-gray-800 hover:text-white rounded-full p-1">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            {isGroup ? (
              <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-3xl text-blue-500 font-bold mb-3">
                {selectedChat.chatName.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img src={chatUser?.avatar} className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-gray-700" />
            )}

            {/* Group Name / Edit */}
            {isGroup && isAdmin && isEditingName ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="bg-transparent border-b border-blue-500 outline-none flex-1 text-center text-white"
                  autoFocus
                />
                <button onClick={handleRename} disabled={renameLoading} className="bg-blue-600 text-white p-1 rounded-full">
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">
                  {isGroup ? selectedChat.chatName : chatUser?.name}
                </h2>
                {isGroup && isAdmin && (
                  <Edit2 size={16} className="cursor-pointer text-gray-500 hover:text-blue-400"
                    onClick={() => {
                      setGroupName(selectedChat.chatName);
                      setIsEditingName(true);
                    }}
                  />
                )}
              </div>
            )}

            {!isGroup && <p className="text-gray-400">{chatUser?.email}</p>}
          </div>

          {/* GROUP USERS */}
          {isGroup && (
            <div className="space-y-6">

              {/* PARTICIPANTS */}
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                <h3 className="text-xs font-bold text-blue-400 uppercase mb-3">Participants ({selectedChat.users.length})</h3>

                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {sortedUsers.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => setViewUser(u)}
                    >
                      <div className="flex items-center gap-2">
                        <UserAvatar user={u} />
                        <div>
                          <p className="text-sm text-gray-200">
                            {u._id === user._id ? "You" : u.name}
                          </p>
                          <p className="text-[10px] text-gray-500">{u.email}</p>
                        </div>
                      </div>

                      {isAdmin && u._id !== user._id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveUser(u._id);
                          }}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ADD USERS */}
              {isAdmin && (
                <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">

                  <h3 className="text-xs font-bold text-blue-400 uppercase mb-3 flex items-center gap-2">
                    <UserPlus size={14} /> Add Members
                  </h3>

                  <input
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  {loading ? (
                    <p className="text-xs text-center text-gray-400 mt-2">Loading...</p>
                  ) : (
                    <div className="max-h-32 overflow-y-auto mt-2 space-y-1">
                      {searchResults.slice(0, 4).map((u) => (
                        <div
                          key={u._id}
                          onClick={() => handleAddUser(u)}
                          className="flex items-center gap-2 p-2 bg-gray-900 border border-transparent hover:border-gray-600 rounded-lg cursor-pointer"
                        >
                          <UserAvatar user={u} />
                          <div>
                            <p className="text-sm text-gray-200">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* EXIT GROUP */}
              <button
                onClick={() => handleRemoveUser(user._id)}
                className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20"
              >
                <Trash2 size={18} className="inline-block mr-2" /> Exit Group
              </button>

            </div>
          )}

        </div>
      </div>

      {viewUser && (
        <ViewUserModal
          user={viewUser}
          isGroup={isGroup}
          groupAdminId={selectedChat.groupAdmin?._id}
          onClose={() => setViewUser(null)}
        />
      )}
    </>
  );
};

export default InfoSidebar;
