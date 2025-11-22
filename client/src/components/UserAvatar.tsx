import type { User } from "../types";

interface UserAvatarProps {
  user?: User,
  className?: string
}
export const UserAvatar = ({ user, className }: UserAvatarProps) => {
  return (
    <img
      src={user?.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
      alt={user?.name}
      className={`w-10 h-10 rounded-full object-cover border border-gray-200 ${className}`}
    />
  );
};