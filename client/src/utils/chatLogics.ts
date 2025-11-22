// src/utils/chatLogic.ts
import type { User, Message } from "../types";

export const getSender = (loggedUser: User | null, users: User[]) => {
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};

export const getSenderFull = (loggedUser: User | null, users: User[]) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

export const isSameSender = (messages: Message[], m: Message, i: number, userId: string) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};