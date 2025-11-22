import React from "react";
import { useChatState } from "../context/ChatProvider";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import InfoSidebar from "../components/InfoSidebar";

const ChatPage = () => {
  const { user, isProfileOpen, selectedChat } = useChatState();

  return (
    <div className="w-full h-screen flex overflow-hidden bg-gray-950">
      {user && <Sidebar />}
      
      <div className={`flex-1 flex h-full relative ${isProfileOpen ? "mr-0" : ""}`}>
        {user && <ChatBox />}
      </div>
      
      {user && selectedChat && isProfileOpen && (
        <div className="absolute inset-y-0 right-0 z-50 md:static md:z-0">
          <InfoSidebar />
        </div>
      )}
    </div>
  );
};

export default ChatPage;