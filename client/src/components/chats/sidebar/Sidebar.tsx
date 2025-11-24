import { useEffect, useState, useMemo } from "react";
import { useChatState } from "../../../context/ChatProvider";
import API from "../../../config/api";
import { toast } from "react-toastify";
import { Plus, Search, LogOut, Loader2, Users, User as UserIcon } from "lucide-react";
import { UserAvatar } from "../../UserAvatar";
import { getSender, getSenderFull } from "../../../utils/chatLogics";
import type { User, Chat } from "../../../types";
import GroupModal from "../groupmodel/GroupModel";


const Sidebar = () => {
  const { user, setSelectedChat, chats, setChats, selectedChat, notification, setNotification } = useChatState();
  const [search, setSearch] = useState("");
  const [searchResultUsers, setSearchResultUsers] = useState<User[]>([]);
  const [searchResultGroups, setSearchResultGroups] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupSearchText, setGroupSearchText] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState<User[]>([]);
  const fetchChats = async () => {
    try {
      const { data } = await API.get("/chat");
      setChats(data);
    } catch (error) {
      toast.error("Failed to Load Chats");
    }
  };

  useEffect(() => { fetchChats(); }, []);

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [chats]);

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
      setSearchResultUsers([]);
      setSearchResultGroups([]);
      return;
    }
    const filteredGroups = chats.filter(c => c.isGroupChat && c.chatName.toLowerCase().includes(query.toLowerCase()));
    setSearchResultGroups(filteredGroups);
    try {
      setLoading(true);
      const { data } = await API.get(`/user?search=${query}`);
      setLoading(false);
      setSearchResultUsers(data);
    } catch (error) { setLoading(false); }
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    const filteredNotifs = notification.filter(n => n.chat._id !== chat._id);
    setNotification(filteredNotifs);
    setSearch("");
    setSearchResultUsers([]);
    setSearchResultGroups([]);
  };

  const accessChat = async (userId: string) => {
    try {
      const { data } = await API.post("/chat", { userId });
      if (!chats.find((c) => c._id === data._id)) { setChats([data, ...chats]); }
      handleSelectChat(data);
    } catch (error) { toast.error("Error fetching chat"); }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length < 2) {
      toast.warning("Need name and at least 2 users");
      return;
    }
    if (chats.some((c) => c.isGroupChat && c.chatName.toLowerCase() === groupName.toLowerCase())) {
      return toast.error("A group with this name already exists");
    }
    try {
      const { data } = await API.post("/chat/group", {
        name: groupName,
        users: JSON.stringify(selectedUsers.map(u => u._id))
      });
      setChats([data, ...chats]);
      setShowGroupModal(false);
      setGroupName("");
      setSelectedUsers([]);
      setGroupSearchText("");
      setGroupSearchResults([]);
      toast.success("Group Created");
    } catch (error) { toast.error("Failed to create group"); }
  }

  const logout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const getNotificationCount = (chatId: string) => notification.filter((n) => n.chat._id === chatId).length;

  return (
    // 1. Sidebar Container: Dark BG, Dark Border
    <div className={`flex flex-col h-full bg-gray-900 border-r border-gray-800 ${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-1/3 lg:w-1/4`}>

      {/* 2. Header: Darker gray for distinction */}
      <div className="p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <UserAvatar user={user || undefined} />
          <span className="font-bold text-gray-100 truncate max-w-[120px]">{user?.name}</span>
        </div>
        <div className="flex gap-2">
          <button title="Create Group" onClick={() => setShowGroupModal(!showGroupModal)} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 transition"><Plus size={20} /></button>
          <button title="Logout" onClick={logout} className="p-2 hover:bg-gray-800 rounded-full text-red-400 transition"><LogOut size={20} /></button>
        </div>
      </div>

      {/* 3. Search Bar: Dark Input */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center bg-gray-800 rounded-xl px-3 py-2 border border-gray-700">
          <Search size={18} className="text-gray-500" />
          <input
            placeholder="Search users or groups..."
            className="bg-transparent border-none outline-none ml-2 w-full text-white placeholder-gray-500"
            onChange={(e) => handleSearch(e.target.value)}
            value={search}
          />
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {search ? (
          // --- SEARCH RESULTS (Dark Mode) ---
          <div className="p-2">
            {loading && <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-500" /></div>}

            {searchResultGroups.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase px-2 mb-2 flex items-center gap-1"><Users size={12} /> Groups</h4>
                {searchResultGroups.map(chat => (
                  <div key={chat._id} onClick={() => handleSelectChat(chat)} className="flex items-center p-3 hover:bg-gray-800 cursor-pointer rounded-lg transition">
                    <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                      {chat.chatName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-sm text-gray-200">{chat.chatName}</p>
                      <p className="text-xs text-gray-500">Group • {chat.users.length} members</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResultUsers.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-blue-400 uppercase px-2 mb-2 flex items-center gap-1"><UserIcon size={12} /> Contacts</h4>
                {searchResultUsers.map((u) => (
                  <div key={u._id} onClick={() => accessChat(u._id)} className="flex items-center p-3 hover:bg-gray-800 cursor-pointer rounded-lg transition">
                    <UserAvatar user={u} />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-200">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && searchResultUsers.length === 0 && searchResultGroups.length === 0 && (
              <div className="text-center text-gray-500 mt-5 text-sm">No users or groups found</div>
            )}
          </div>
        ) : (
          // --- CHAT LIST (Dark Mode) ---
          sortedChats.map((chat) => {
            const notifCount = getNotificationCount(chat._id);
            return (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                // Updated hover and active states for dark theme
                className={`flex items-center p-3 cursor-pointer border-b border-gray-800 transition hover:bg-gray-800 
                  ${selectedChat?._id === chat._id ? "bg-blue-900/20 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"}`}
              >
                {!chat.isGroupChat ? <UserAvatar user={getSenderFull(user, chat.users)} /> :
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-blue-400 font-bold border border-gray-600">
                    {chat.chatName.charAt(0).toUpperCase()}
                  </div>
                }
                <div className="ml-3 overflow-hidden flex-1">
                  <div className="flex justify-between items-center">
                    <p className={`font-semibold truncate text-sm ${selectedChat?._id === chat._id ? "text-white" : "text-gray-300"}`}>
                      {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                    </p>
                    {notifCount > 0 && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
                        {notifCount > 9 ? "9+" : notifCount}
                      </span>
                    )}
                  </div>

                  {chat.latestMessage ? (
                    <p className={`text-xs truncate ${notifCount > 0 ? "font-bold text-gray-100" : "text-gray-500"}`}>
                      <span className={notifCount > 0 ? "font-bold text-blue-400" : ""}>
                        {chat.latestMessage.sender._id === user?._id ? "You: " : chat.isGroupChat ? chat.latestMessage.sender.name + ": " : ""}
                      </span>
                      {chat.latestMessage.content.length > 50 ? chat.latestMessage.content.substring(0, 51) + "..." : chat.latestMessage.content}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600 italic">No messages yet</p>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 4. Group Modal: Dark Theme */}
      <GroupModal
        show={showGroupModal}
        onClose={() => {
          setShowGroupModal(false);
          setGroupSearchText("");
          setSelectedUsers([]);
        }}
        groupName={groupName}
        setGroupName={setGroupName}
        searchText={groupSearchText}
        onSearchTextChange={async (v) => {
          setGroupSearchText(v);
          if (!v) return setGroupSearchResults([]);
          try {
            const { data } = await API.get(`/user?search=${v}`);
            setGroupSearchResults(data);
          } catch { }
        }}
        searchResults={groupSearchResults}
        selectedUsers={selectedUsers}
        addUser={(u) => {
          if (!selectedUsers.find((x) => x._id === u._id)) {
            setSelectedUsers([...selectedUsers, u]);
          }
          setGroupSearchText("");
          setGroupSearchResults([]);
        }}
        removeUser={(id) =>
          setSelectedUsers(selectedUsers.filter((u) => u._id !== id))
        }
        createGroup={handleCreateGroup}
        loading={loading}
      />

    </div>
  );
};

export default Sidebar;