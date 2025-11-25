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

  const [selectedToAdd, setSelectedToAdd] = useState<User[]>([]);
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
    try {
      const { data } = await API.put("/chat/groupadd", {
        chatId: selectedChat._id,
        userId: u._id,
      });

      setSelectedChat(data);
      toast.success(`${u.name} added`);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to add user");
    }
  };

  const handleRemoveUser = async (userId: string, userName?: string) => {
  // -------------------- CONFIRMATION --------------------
  let message;

  if (isAdmin && userId === user._id) {
    message = "As admin, exiting will DELETE the group permanently. Continue?";
  } else if (userId === user._id) {
    message = "Are you sure you want to exit this group?";
  } else {
    message = `Remove ${userName || "this user"} from the group?`;
  }

  const confirmed = window.confirm(message);
  if (!confirmed) return;
  // ------------------------------------------------------

  try {
    // If admin is removing THEMSELVES → delete group
    if (isAdmin && userId === user._id && isGroup) {
      await API.delete("/chat/group/delete", {
        data: { chatId: selectedChat._id },
      });

      setSelectedChat(null);
      setIsProfileOpen(false);
      toast.success("Group deleted permanently");
      return;
    }

    // Normal removal
    const { data } = await API.put("/chat/groupremove", {
      chatId: selectedChat._id,
      userId,
    });

    // If YOU removed yourself → close chat
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



  const deleteGroupUI = async () => {
    const ok = window.confirm(
      "Are you sure you want to delete this group?\nThis will delete all messages and remove the group from everyone."
    );
    if (!ok) return;

    try {
      await API.delete("/chat/group/delete", {
        data: { chatId: selectedChat._id },
      });

      toast.success("Group deleted");
      setSelectedChat(null);
      setIsProfileOpen(false);
    } catch (err) {
      toast.error("Failed to delete group");
    }
  };

  // -------------------------

  return (
    <>
      <div className="h-full bg-gray-900 border-l border-gray-800 shadow-xl w-full md:w-80 flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
          <h2 className="font-semibold text-lg text-white">
            {isGroup ? "Group Info" : "Contact Info"}
          </h2>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="text-gray-400 hover:bg-gray-800 hover:text-white rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar w-full min-w-0">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            {isGroup ? (
              <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-3xl text-blue-500 font-bold mb-3">
                {selectedChat.chatName.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img
                src={chatUser?.avatar}
                className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-gray-700"
              />
            )}

            {/* Group Name */}
            {isGroup && isAdmin && isEditingName ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="bg-transparent border-b border-blue-500 outline-none flex-1 text-center text-white"
                  autoFocus
                />
                <button
                  onClick={handleRename}
                  disabled={renameLoading}
                  className="bg-blue-600 text-white p-1 rounded-full"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">
                  {isGroup ? selectedChat.chatName : chatUser?.name}
                </h2>

                {isGroup && isAdmin && (
                  <Edit2
                    size={16}
                    className="cursor-pointer text-gray-500 hover:text-blue-400"
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
                <h3 className="text-xs font-bold text-blue-400 uppercase mb-3">
                  Participants ({selectedChat.users.length})
                </h3>

                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {sortedUsers.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => setViewUser(u)}
                    >
                      <div className="flex items-center gap-2">
                        <UserAvatar user={u} />
                        <div>
                          <p className="text-sm text-gray-200 flex items-center gap-1">
                            {u._id === user._id ? "You" : u.name}

                            {u._id === selectedChat.groupAdmin?._id && (
                              <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1 py-px rounded">
                                Admin
                              </span>
                            )}
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

                  {/* Selected Chips */}
                  {selectedToAdd.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedToAdd.map((u) => (
                        <span
                          key={u._id}
                          className="flex items-center gap-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-1 rounded-full text-xs"
                        >
                          {u.name}
                          <button
                            className="text-blue-300 hover:text-red-300"
                            onClick={() =>
                              setSelectedToAdd(
                                selectedToAdd.filter((x) => x._id !== u._id)
                              )
                            }
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <input
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  {loading ? (
                    <p className="text-xs text-center text-gray-400 mt-2">
                      Loading...
                    </p>
                  ) : (
                    <div className="max-h-32 overflow-y-auto mt-2 space-y-1 custom-scrollbar">
                      {searchResults.slice(0, 5).map((u) => {
                        const alreadySelected = selectedToAdd.some(
                          (x) => x._id === u._id
                        );
                        const alreadyInGroup = selectedChat.users.some(
                          (x) => x._id === u._id
                        );

                        return (
                          <div
                            key={u._id}
                            onClick={() => {
                              if (alreadyInGroup)
                                return toast.error("User already in group");
                              if (!alreadySelected)
                                setSelectedToAdd([...selectedToAdd, u]);
                            }}
                            className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${
                              alreadySelected
                                ? "bg-gray-700 border-gray-600"
                                : "bg-gray-900 hover:border-gray-600 border-transparent"
                            }`}
                          >
                            <UserAvatar user={u} />
                            <div>
                              <p className="text-sm text-gray-200">{u.name}</p>
                              <p className="text-xs text-gray-500">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedToAdd.length > 0 && (
                    <button
                      onClick={async () => {
                        for (let u of selectedToAdd) {
                          await handleAddUser(u);
                        }
                        setSelectedToAdd([]);
                        setSearch("");
                        setSearchResults([]);
                      }}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg mt-3 hover:bg-blue-700"
                    >
                      Add {selectedToAdd.length} Members
                    </button>
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

              {/* DELETE GROUP (Admin only) */}
              {isAdmin && (
                <button
                  onClick={deleteGroupUI}
                  className="w-full py-3 bg-red-600/20 text-red-400 border border-red-600/30 rounded-xl hover:bg-red-600/30"
                >
                  Delete Group
                </button>
              )}
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
