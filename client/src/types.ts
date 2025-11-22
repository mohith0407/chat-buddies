// src/types.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  token?: string;
}

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage?: Message;
  groupAdmin?: User;
  updatedAt: string;
}

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
  createdAt: string;
}