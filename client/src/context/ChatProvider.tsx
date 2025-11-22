import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User, Chat } from "../types";

interface ChatContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  selectedChat: Chat | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  // Chats state
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  // State for notifications
  notification: any[];
  setNotification: React.Dispatch<React.SetStateAction<any[]>>;
  // State for Info Sidebar
  isProfileOpen: boolean;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [notification, setNotification] = useState<any[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Default closed
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    setUser(userInfo);

    if (!userInfo && window.location.pathname !== "/auth") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        isProfileOpen,
        setIsProfileOpen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatState = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatState must be used within ChatProvider");
  return context;
};