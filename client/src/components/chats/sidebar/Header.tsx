import { useState } from "react";
import { useChatState } from "../../../context/ChatProvider";
import { UserAvatar } from "../../UserAvatar";
import { MoreVertical, Users, User as UserIcon, LogOut } from "lucide-react";
import type { User } from "../../../types";
import ViewUserModal from "../../ViewUserModel";
import EditProfileModal from "../../EditProfileModel";

interface HeaderProps {
    onCreateGroup: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateGroup }) => {
    const { user } = useChatState();
    const [openMenu, setOpenMenu] = useState(false);
    const [viewUser, setViewUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<boolean>(false);
    const logout = () => {
        localStorage.removeItem("userInfo");
        window.location.href = "/";
    };

    return (
        <div className="p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800 relative">

            {/* LEFT — Avatar + Name */}
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setViewUser(user!)}
            >
                <UserAvatar user={user ?? undefined} />
                <span className="font-bold text-gray-100 truncate max-w-[120px]">
                    {user?.name}
                </span>
            </div>

            {/* RIGHT — More Icon */}
            <div>
                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="p-2 hover:bg-gray-800 rounded-full text-gray-300"
                >
                    <MoreVertical size={20} />
                </button>

                {openMenu && (
                    <div className="absolute right-4 top-16 bg-gray-800 border border-gray-700 rounded-xl shadow-xl w-40 py-2 z-50">

                        {/* New Group */}
                        <button
                            className="w-full flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-gray-700"
                            onClick={() => {
                                setOpenMenu(false);
                                onCreateGroup();
                            }}
                        >
                            <Users size={16} /> New Group
                        </button>

                        {/* Edit Profile */}
                        <button
                            className="w-full flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-gray-700"
                            onClick={() => {
                                setOpenMenu(false);
                                setEditUser(true);
                            }}
                        >
                            <UserIcon size={16} /> Edit Profile
                        </button>


                        {/* Logout */}
                        <button
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700"
                            onClick={logout}
                        >
                            <LogOut size={16} /> Logout
                        </button>

                    </div>
                )}
            </div>

            {/* NEW USER MODAL (your component) */}
            {viewUser && (
                <ViewUserModal
                    user={viewUser}
                    onClose={() => setViewUser(null)}
                    isGroup={false}
                    groupAdminId={undefined}
                />
            )}

            {editUser && (
  <EditProfileModal user={user!} onClose={() => setEditUser(false)} />
)}

        </div>
    );
};

export default Header;
