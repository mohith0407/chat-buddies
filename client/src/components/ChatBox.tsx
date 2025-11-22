import React, { useEffect, useState, useRef } from "react";
import { useChatState } from "../context/ChatProvider";
import API from "../config/api";
import { Send, Info, ArrowLeft, Trash2, CheckSquare, Square, X, Check } from "lucide-react";
import io, { Socket } from "socket.io-client";
import { getSenderFull, getSender } from "../utils/chatLogics";
import type { Message } from "../types";
import { format } from "date-fns";
import { toast } from "react-toastify";

const ENDPOINT = "http://localhost:4000";
let socket: Socket;

const ChatBox = () => {
    const { user, selectedChat, setSelectedChat, notification, setNotification, setChats, chats, setIsProfileOpen } = useChatState();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    
    // Typing states
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Selection / Delete States
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- SOCKET & SETUP ---
    useEffect(() => {
        if (!user) return;
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        return () => { socket.disconnect(); };
    }, [user]);

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            setLoading(true);
            const { data } = await API.get(`/message/${selectedChat._id}`);
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast.error("Failed to load messages");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        setIsTyping(false); 
        setTyping(false);
        // Reset selection on chat change
        setIsSelectionMode(false);
        setSelectedMessageIds([]);
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved: Message) => {
            if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setChats(chats.map(c => c._id === newMessageRecieved.chat._id ? { ...c, latestMessage: newMessageRecieved } : c));
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
        return () => { socket.off("message recieved"); };
    });

    // --- SENDING LOGIC ---
    const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const sendMessage = async (e: React.KeyboardEvent | React.MouseEvent) => {
        if ((e.type === 'keydown' && (e as React.KeyboardEvent).key === "Enter" && newMessage) || (e.type === 'click' && newMessage)) {
            socket.emit("stop typing", selectedChat._id); 
            setTyping(false);
            try {
                const { data } = await API.post("/message", {
                    content: newMessage,
                    chatId: selectedChat?._id,
                });
                setNewMessage("");
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast.error("Failed to send message");
            }
        }
    };

    // --- DELETION LOGIC ---

    // Toggle Selection Mode
    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedMessageIds([]);
    };

    // Handle selecting a message
    const handleSelectMessage = (msgId: string) => {
        if (selectedMessageIds.includes(msgId)) {
            setSelectedMessageIds(selectedMessageIds.filter(id => id !== msgId));
        } else {
            setSelectedMessageIds([...selectedMessageIds, msgId]);
        }
    };

    // Delete Single Message
    const handleDeleteSingle = async (msgId: string) => {
        if(!window.confirm("Delete this message?")) return;
        try {
            await API.delete(`/message/delete/${msgId}`);
            setMessages(messages.filter(m => m._id !== msgId));
            toast.success("Message deleted");
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    // Delete Multiple Messages
    const handleDeleteBulk = async () => {
        if(selectedMessageIds.length === 0) return;
        if(!window.confirm(`Delete ${selectedMessageIds.length} messages?`)) return;

        try {
            setDeleteLoading(true);
            await API.put("/message/delete/bulk", { messages: selectedMessageIds });
            
            // Remove from UI locally
            setMessages(messages.filter(m => !selectedMessageIds.includes(m._id)));
            
            setSelectedMessageIds([]);
            setIsSelectionMode(false);
            setDeleteLoading(false);
            toast.success("Messages deleted");
        } catch (error) {
            setDeleteLoading(false);
            toast.error("Failed to delete messages");
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // --- RENDER ---

    if (!selectedChat) {
        return (
            <div className="hidden w-full md:flex flex-col items-center justify-center h-full bg-gray-900 text-center p-6">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 border-2 border-blue-500/30">
                   <Send size={40} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
                <p className="text-gray-400">Select a chat to start messaging securely.</p>
            </div>
        );
    }

    return (
        <div className={`flex flex-col w-full h-full bg-gray-950 ${!selectedChat ? "hidden" : "flex"}`}>
            
            {/* 1. Header: Dynamic based on Selection Mode */}
            <div className={`p-3 flex items-center justify-between shadow-md z-10 border-b border-gray-800 transition-colors duration-300 ${isSelectionMode ? "bg-blue-900/30 backdrop-blur-md" : "bg-gray-900"}`}>
                
                {/* Left Side */}
                <div className="flex items-center w-full">
                    {isSelectionMode ? (
                        // Bulk Action Toolbar
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                <button onClick={toggleSelectionMode} className="text-gray-300 hover:text-white p-2">
                                    <X size={24} />
                                </button>
                                <span className="text-white font-bold text-lg">{selectedMessageIds.length} Selected</span>
                            </div>
                            <button 
                                onClick={handleDeleteBulk} 
                                disabled={selectedMessageIds.length === 0 || deleteLoading}
                                className={`flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition ${selectedMessageIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Trash2 size={18} />
                                {deleteLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    ) : (
                        // Normal Header
                        <>
                             <button onClick={(e) => { e.stopPropagation(); setSelectedChat(null); setIsProfileOpen(false); }} className="md:hidden mr-2 text-gray-300">
                                <ArrowLeft />
                            </button>
                            
                            <div className="flex items-center cursor-pointer flex-1" onClick={() => setIsProfileOpen(true)}>
                                {!selectedChat.isGroupChat ? (
                                    <>
                                       <img src={getSenderFull(user, selectedChat.users)?.avatar} className="w-10 h-10 rounded-full mr-3 object-cover ring-2 ring-blue-500/30"/>
                                       <div className="flex flex-col">
                                           <span className="font-bold text-gray-100 leading-tight">{getSender(user, selectedChat.users)}</span>
                                           <span className="text-xs text-blue-400">Click for info</span>
                                       </div>
                                    </>
                                ) : (
                                    <>
                                       <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 font-bold text-blue-400 border border-gray-600">
                                           {selectedChat.chatName.charAt(0).toUpperCase()}
                                       </div>
                                       <div className="flex flex-col">
                                           <span className="font-bold text-gray-100 uppercase leading-tight">{selectedChat.chatName}</span>
                                           <span className="text-xs text-gray-400">
                                              {selectedChat.users.map(u => u.name).join(", ").slice(0, 30)}...
                                           </span>
                                       </div>
                                    </>
                                )}
                            </div>

                            {/* Header Actions */}
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={toggleSelectionMode} 
                                    className="text-gray-400 hover:bg-gray-800 hover:text-blue-400 p-2 rounded-full transition"
                                    title="Select Messages"
                                >
                                    <CheckSquare size={20} />
                                </button>
                                <button onClick={() => setIsProfileOpen(true)} className="text-gray-400 hover:bg-gray-800 hover:text-white p-2 rounded-full transition">
                                    <Info size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 2. Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-950 relative">
                {loading ? (
                    <div className="flex justify-center mt-10"><div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div></div>
                ) : (
                    messages.map((m, i) => {
                        const isMe = m.sender._id === user?._id;
                        const isSelected = selectedMessageIds.includes(m._id);
                        
                        return (
                            <div 
                                key={m._id} 
                                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"} group`}
                            >
                                {/* Selection Checkbox (Only for own messages in selection mode) */}
                                {isSelectionMode && isMe && (
                                    <button 
                                        onClick={() => handleSelectMessage(m._id)}
                                        className="mb-4 text-gray-500 hover:text-blue-500 transition"
                                    >
                                        {isSelected ? <CheckSquare className="text-blue-500" size={20} /> : <Square size={20} />}
                                    </button>
                                )}

                                {/* Message Bubble */}
                                <div 
                                    onClick={() => {
                                        if (isSelectionMode && isMe) handleSelectMessage(m._id);
                                    }}
                                    className={`
                                        max-w-[75%] px-4 py-2 rounded-lg shadow-md relative cursor-pointer transition-all
                                        ${isMe ? "rounded-tr-none" : "rounded-tl-none"}
                                        ${isSelected ? "ring-2 ring-blue-500 bg-blue-900/50" : (isMe ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200")}
                                    `}
                                >
                                    {(selectedChat.isGroupChat && !isMe) && <p className="text-xs font-bold text-blue-300 mb-1">{m.sender.name}</p>}
                                    
                                    <span className="text-sm">{m.content}</span>
                                    
                                    <span className={`text-[10px] block text-right mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                                        {format(new Date(m.createdAt), "HH:mm")}
                                    </span>

                                    {/* Single Delete Icon (Hover) - Only if NOT in selection mode */}
                                    {isMe && !isSelectionMode && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSingle(m._id);
                                            }}
                                            className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/50 rounded-full"
                                            title="Delete Message"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                
                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 px-4 py-2 rounded-lg rounded-tl-none shadow-sm">
                            <div className="flex space-x-1 items-center h-6">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 3. Input Area (Hide if Selection Mode is Active) */}
            {!isSelectionMode && (
                <div className="p-3 bg-gray-900 border-t border-gray-800 flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={typingHandler} 
                        onKeyDown={sendMessage} 
                    />
                    <button onClick={sendMessage} className="bg-blue-600 p-3 rounded-xl text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                        <Send size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatBox;