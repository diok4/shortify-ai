"use client";

import { RxExit } from "react-icons/rx";
import { FaCircleUser } from "react-icons/fa6";
import { MdChat } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { NavLink } from "@/src/widgets/shared/navlink";
import { logout } from "@/src/features/auth/logout";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

interface NavBarProps {
  user: any;
}

export const NavBar = ({ user }: NavBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true);
      else setIsOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = () => {
    if (isMobile) setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    if (isMobile) setIsOpen(false);
  };

  return (
    <div>
      {isMobile && (
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-50 p-2 bg-[#1a1a1a] rounded-lg shadow-lg border border-[#252525] hover:bg-[#1a1a1a] transition-all"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      <div
        className={`
          fixed h-screen py-5 px-5 border-[#252525] border-r flex flex-col justify-between
          bg-[#1a1a1a] z-40 transition-all duration-300
          ${isMobile ? "w-[280px]" : "w-[250px]"}
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <div>
          <div className="flex items-center pb-2 font-extrabold bg-linear-to-r from-[#3631ca] via-[#4641d3] to-[#3631ca] bg-clip-text text-transparent text-3xl select-none">
            <FaArrowDownWideShort className="text-[#3631ca]" />
            <h1 className="ml-2 font-medium">Shortify</h1>
          </div>

          {user ? (
            <div className="flex flex-col items-center border-t border-[#252525] pt-5">
              <img
                src={user.avatarUrl}
                width={50}
                height={50}
                alt="Profile"
                className="rounded-full"
              />
              <h2 className="text-lg font-normal capitalize mt-2 text-gray-200">
                {user.username}
              </h2>
              <p className="text-gray-200 text-sm">{user.email}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center border-t border-gray-200 pt-5">
              <FaCircleUser className="text-[60px] text-gray-200" />
              <p className="text-gray-500 text-sm mt-1">Guest</p>
            </div>
          )}

          <div className="flex flex-col mt-5 gap-2">
            <span onClick={() => handleNavClick}>
              <NavLink href="/" exact>
                <MdChat />
                <span className="ml-2">Chat</span>
              </NavLink>
            </span>
            <span onClick={handleNavClick}>
              <NavLink href="/settings" exact>
                <IoIosSettings />
                <span className="ml-2">Settings</span>
              </NavLink>
            </span>
          </div>
        </div>

        {user && (
          <div className="border-t border-[#2d2d2d] pt-2">
            <button
              onClick={handleLogout}
              className="flex justify-center py-2 rounded-lg items-center text-gray-200 font-medium border border-[#2d2d2d]  hover:bg-[#383838] hover:text-gray-100 transition w-full"
            >
              <RxExit />
              <span className="ml-2">Logout</span>
            </button>
          </div>
        )}
      </div>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
