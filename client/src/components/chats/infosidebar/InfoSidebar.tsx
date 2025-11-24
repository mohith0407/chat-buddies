import { useState, useMemo } from "react";
import { useChatState } from "../../../context/ChatProvider";
import { getSenderFull } from "../../../utils/chatLogics";
import { UserAvatar } from "../../UserAvatar";
import { X, UserPlus, Trash2, Edit2, Check, Mail, User as UserIcon } from "lucide-react";
import API from "../../../config/api";
import { toast } from "react-toastify";
import type { User } from "../../../types";

const InfoSidebar = () => {
  const { selectedChat, user, setIsProfileOpen, setSelectedChat } = useChatState();
  
  // State for Group Editing
  const [renameLoading, setRenameLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  
  // State for Adding Users
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // State for Viewing User Profile (Modal)
  const [viewUser, setViewUser] = useState<User | null>(null);

  if (!selectedChat || !user) return null;

  const isGroup = selectedChat.isGroupChat;
  const isAdmin = isGroup && selectedChat.groupAdmin?._id === user._id;
  const chatUser = !isGroup ? getSenderFull(user, selectedChat.users) : null;

  // --- UTILS ---

  // Sort users: Admin first, then the rest
  const sortedUsers = useMemo(() => {
    if (!isGroup) return [];
    return [...selectedChat.users].sort((a, b) => {
        const adminId = selectedChat.groupAdmin?._id;
        if (a._id === adminId) return -1; // a is admin, put first
        if (b._id === adminId) return 1;  // b is admin, put first
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
      setRenameLoading(false);
      toast.success("Group name updated");
    } catch (error) {
      toast.error("Failed to rename group");
      setRenameLoading(false);
    }
  };

  const handleRemoveUser = async (userIdToRemove: string) => {
    try {
      const { data } = await API.put("/chat/groupremove", {
        chatId: selectedChat._id,
        userId: userIdToRemove,
      });
      
      if(userIdToRemove === user._id) {
          setSelectedChat(null);
          setIsProfileOpen(false);
      } else {
          setSelectedChat(data);
      }
    } catch (error) {
      toast.error("Failed to remove user");
    }
  };

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
        setSearchResults([]);
        return;
    }
    try {
      setLoading(true);
      const { data } = await API.get(`/user?search=${query}`);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd: User) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast.error("User already in group");
      return;
    }
    try {
      const { data } = await API.put("/chat/groupadd", {
        chatId: selectedChat._id,
        userId: userToAdd._id,
      });
      setSelectedChat(data);
      toast.success(`${userToAdd.name} added`);
      setSearch("");
      setSearchResults([]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <>
        {/* 1. Main Sidebar Container */}
        <div className="h-full bg-gray-900 border-l border-gray-800 shadow-xl w-full md:w-80 flex flex-col relative z-10">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
            <h2 className="font-semibold text-lg text-white">{isGroup ? "Group Info" : "Contact Info"}</h2>
            <button onClick={() => setIsProfileOpen(false)} className="text-gray-400 hover:bg-gray-800 hover:text-white rounded-full p-1 transition">
            <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {/* Chat Profile Image & Name */}
            <div className="flex flex-col items-center mb-6">
            {isGroup ? (
                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-3xl text-blue-500 font-bold mb-3 shadow-lg border border-gray-700">
                    {selectedChat.chatName.charAt(0).toUpperCase()}
                </div>
            ) : (
                <img src={chatUser?.avatar} alt={chatUser?.name} className="w-24 h-24 rounded-full object-cover mb-3 shadow-lg border-2 border-gray-700" />
            )}

            {/* Name / Editable Name */}
            {isGroup && isAdmin && isEditingName ? (
                <div className="flex items-center gap-2 w-full">
                    <input 
                        value={groupName} 
                        onChange={(e) => setGroupName(e.target.value)}
                        className="bg-transparent border-b border-blue-500 outline-none flex-1 text-center pb-1 text-white placeholder-gray-500"
                        autoFocus
                    />
                    <button onClick={handleRename} disabled={renameLoading} className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full transition">
                        <Check size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">
                        {isGroup ? selectedChat.chatName : chatUser?.name}
                    </h2>
                    {isGroup && isAdmin && (
                        <Edit2 size={16} className="cursor-pointer text-gray-500 hover:text-blue-400 transition" onClick={() => {
                            setGroupName(selectedChat.chatName);
                            setIsEditingName(true);
                        }} />
                    )}
                </div>
            )}
            
            {!isGroup && <p className="text-gray-400">{chatUser?.email}</p>}
            </div>

            {/* Group Specific: Users List & Controls */}
            {isGroup && (
            <div className="space-y-6">
                {/* Participants List */}
                <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                    <h3 className="text-xs font-bold text-blue-400 uppercase mb-3 ml-1">
                        Participants ({selectedChat.users.length})
                    </h3>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
                        {sortedUsers.map((u) => (
                            <div 
                                key={u._id} 
                                onClick={() => setViewUser(u)}
                                className="flex items-center justify-between bg-gray-900/50 p-2 rounded-lg border border-gray-700/50 w-full cursor-pointer hover:bg-gray-700/50 transition group"
                            >
                                <div className="flex items-center gap-2">
                                    <UserAvatar user={u} />
                                    <div className="flex flex-col items-start">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-200">{u._id === user._id ? "You" : u.name}</p>
                                            {selectedChat.groupAdmin?._id === u._id && (
                                                <span className="text-[10px] font-bold text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded bg-green-500/10">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-500 truncate w-32">{u.email}</p>
                                    </div>
                                </div>

                                {/* Only Admin can remove, but cannot remove themselves here (use Exit instead) */}
                                {isAdmin && u._id !== user._id && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent opening profile modal
                                            handleRemoveUser(u._id);
                                        }} 
                                        className="text-gray-600 hover:text-red-400 transition p-1 opacity-0 group-hover:opacity-100"
                                        title="Remove User"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Admin: Add User */}
                {isAdmin && (
                    <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                        <h3 className="text-xs font-bold text-blue-400 uppercase mb-3 ml-1 flex items-center gap-2">
                            <UserPlus size={14}/> Add Members
                        </h3>
                        <input 
                            placeholder="Search users to add..." 
                            className="w-full p-2 text-sm bg-gray-900 border border-gray-600 rounded-lg mb-2 text-white focus:outline-none focus:border-blue-500 placeholder-gray-500"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {loading ? <div className="text-xs text-center text-gray-400">Loading...</div> : (
                            <div className="max-h-32 overflow-y-auto space-y-1 custom-scrollbar">
                                {searchResults.slice(0,4).map(u => (
                                    <div key={u._id} onClick={() => handleAddUser(u)} className="flex items-center gap-2 p-2 hover:bg-gray-700 cursor-pointer rounded-lg bg-gray-900 transition border border-transparent hover:border-gray-600">
                                        <UserAvatar user={u} />
                                        <div className="text-xs">
                                            <p className="font-bold text-gray-200">{u.name}</p>
                                            <p className="text-gray-500">{u.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Exit Group */}
                <button 
                    onClick={() => handleRemoveUser(user._id)} 
                    className="w-full flex items-center justify-center gap-2 text-red-400 bg-red-500/10 py-3 rounded-xl hover:bg-red-500/20 border border-red-500/20 transition font-medium"
                >
                    <Trash2 size={18} /> Exit Group
                </button>
            </div>
            )}
        </div>
        </div>

        {/* 2. User Info Modal (View Only) */}
        {viewUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all scale-100">
                    {/* Modal Header */}
                    <div className="h-24 bg-linear-to-r from-blue-600 to-purple-600 relative">
                        <button 
                            onClick={() => setViewUser(null)}
                            className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Modal Content */}
                    <div className="px-6 pb-6 relative">
                        <div className="-mt-12 mb-4 flex justify-center">
                            <div className="p-1 bg-gray-800 rounded-full">
                                <UserAvatar user={viewUser} className="w-24 h-24 text-2xl" />
                            </div>
                        </div>
                        
                        <div className="text-center space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                                    {viewUser.name}
                                    {isGroup && selectedChat.groupAdmin?._id === viewUser._id && (
                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">Admin</span>
                                    )}
                                </h3>
                                <p className="text-gray-400 text-sm">User Details</p>
                            </div>

                            <div className="bg-gray-900/50 rounded-xl p-4 space-y-3 text-left border border-gray-700/50">
                                <div className="flex items-center gap-3">
                                    <Mail size={18} className="text-blue-400" />
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-gray-500 uppercase">Email</p>
                                        <p className="text-sm text-gray-200 truncate" title={viewUser.email}>{viewUser.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <UserIcon size={18} className="text-purple-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">User ID</p>
                                        <p className="text-sm text-gray-200 font-mono">{viewUser._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default InfoSidebar;