// src/components/UserAvatar.tsx
import type { User } from "../types";

export const UserAvatar = ({ user }: { user?: User }) => {
  return (
    <img
      src={user?.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
      alt={user?.name}
      className="w-10 h-10 rounded-full object-cover border border-gray-200"
    />
  );
};