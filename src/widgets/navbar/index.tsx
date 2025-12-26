"use client";

import { RxExit } from "react-icons/rx";
import { FaCircleUser } from "react-icons/fa6";
import { MdChat } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { NavLink } from "@/src/widgets/shared/navlink";
import { logout } from "@/src/features/auth/logout";
import { FaArrowDownWideShort } from "react-icons/fa6";

interface NavBarProps {
  user: any;
}

export const NavBar = ({ user }: NavBarProps) => {
  return (
    <div className="w-[250px] fixed h-screen py-5 px-5 border-gray-200 border-r flex flex-col justify-between">
      <div>
        <div className="flex items-center pb-2 font-extrabold bg-linear-to-r from-blue-800 via-blue-950 to-blue-900 bg-clip-text text-transparent  text-3xl select-none">
          <FaArrowDownWideShort className="text-blue-900" />
          <h1 className="ml-2 font-medium">Shortify</h1>
        </div>

        {user ? (
          <div className="flex flex-col items-center border-t border-gray-200 pt-5">
            <img src={user.avatarUrl} width={50} height={50} alt="404" />
            <h2 className="text-lg font-normal capitalize">{user.username}</h2>
            <p className="text-gray-700 text-sm">{user.email}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center border-t border-gray-200 pt-5">
            <FaCircleUser className="text-[60px] text-gray-400" />
            <p className="text-gray-500 text-sm mt-1">Guest</p>
          </div>
        )}

        <div className="flex flex-col mt-5 gap-2">
          <NavLink href="/" exact>
            <MdChat />
            <span className="ml-2">Chat</span>
          </NavLink>

          <NavLink href="/settings" exact>
            <IoIosSettings />
            <span className="ml-2">Settings</span>
          </NavLink>
        </div>
      </div>

      {user && (
        <div className="border-t border-gray-200 pt-2">
          <button
            onClick={logout}
            className="flex justify-center py-1 rounded-lg items-center text-red-500 font-medium border hover:bg-red-500 hover:text-white transition w-full"
          >
            <RxExit />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};
