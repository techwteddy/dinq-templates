"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.svg";
import { NavData } from "@/localData/data";
import AuthModal from "./AuthModal";

const NavBar = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed z-50 transition-all  duration-300 ease-in-out ${
          scrolled
            ? "bg-darker top-6 left-1/2 -translate-x-1/2 rounded-full border-2 border-orange px-6 py-4 shadow-lg w-[95%] md:top-4 md:w-[90%] md:max-w-7xl md:px-6 md:py-3"
            : "top-0 left-0 w-full bg-[#FFFFFF33] px-6 py-4 rounded-none translate-x-0"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src={logo} alt="logo" width={100} height={40} className="w-[60px] sm:w-auto" />
          </Link>

          <div className="block lg:hidden">
            <button
              className="cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <HiX size={28} color="#FA8B02" />
              ) : (
                <HiMenu size={28} color="#FA8B02" />
              )}
            </button>
          </div>

          <ul className="hidden lg:flex items-center gap-10">
            {NavData?.map((link, index) => (
              <li key={index}>
                <Link
                  href={link?.link}
                  onClick={() => handleLinkClick(link?.link)}
                  className={`font-semibold text-[16px] 2xl:text-[20px] pb-2 hover:border-b-2 hover:border-orange ${
                    activeLink === link?.link
                      ? "border-b-2 border-orange"
                      : "border-b-2 border-transparent"
                  } transition-colors duration-300 text-white`}
                >
                  {link?.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-4 relative">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-white cursor-pointer"
              >
                Eng <MdKeyboardArrowDown color="#FA8B02" />
              </button>

              {langOpen && (
                <ul className="absolute left-1/2 -translate-x-1/2 mt-2 w-32 rounded shadow-lg z-10 flex flex-col items-center animate-dropdown bg-[#FFFFFF33] backdrop-blur-md">
                  <li className="w-full">
                    <button
                      onClick={() => setLangOpen(false)}
                      className="block w-full px-4 py-2 text-center text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                    >
                      English
                    </button>
                  </li>
                  <li className="w-full">
                    <button
                      onClick={() => setLangOpen(false)}
                      className="block w-full px-4 py-2 text-center text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                    >
                      Arabic
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <button
              onClick={() => openAuthModal("login")}
              className="text-[20px] font-semibold text-white cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => openAuthModal("signup")}
              className="px-6 py-2.5 bg-orange text-white rounded-3xl 2xl:text-[20px] font-semibold cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden absolute top-[80px] sm:top-[120px] left-[50%] w-[88%] translate-x-[-50%] transition-all duration-300 ease-in-out overflow-hidden z-40 ${
            menuOpen
              ? `max-h-96 opacity-100 visible rounded-bl-3xl rounded-br-3xl ${
                  scrolled ? "bg-darker" : "bg-[#FFFFFF33]"
                }`
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="px-6 py-4 flex flex-col items-center">
            <ul className="flex flex-col gap-4 text-white text-[20px] font-semibold w-full items-center">
              {NavData?.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link?.link}
                    onClick={() => handleLinkClick(link?.link)}
                    className={`block pb-2 hover:border-b-2 hover:border-orange ${
                      activeLink === link?.link
                        ? "border-b-2 border-orange"
                        : "border-b-2 border-transparent"
                    } transition-colors duration-300`}
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}

              <li className="w-full text-center relative">
                <button
                  onClick={() => setMobileLangOpen(!mobileLangOpen)}
                  className="flex items-center justify-center gap-1 w-full text-white cursor-pointer"
                >
                  Eng <MdKeyboardArrowDown color="#FA8B02" />
                </button>

                {mobileLangOpen && (
                  <ul className="mt-2 w-full bg-[#FFFFFF33] rounded backdrop-blur-md flex flex-col items-center animate-dropdown">
                    <li className="w-full">
                      <button
                        onClick={() => {
                          setMobileLangOpen(false);
                          setMenuOpen(false);
                        }}
                        className="block w-[80%] px-4 py-2 text-center text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                      >
                        English
                      </button>
                    </li>
                    <li className="w-full">
                      <button
                        onClick={() => {
                          setMobileLangOpen(false);
                          setMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-center text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                      >
                        Arabic
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-2 w-full items-center">
              <button
                onClick={() => {
                  openAuthModal("login");
                  setMenuOpen(false);
                }}
                className="text-white text-[18px] font-semibold cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => {
                  openAuthModal("signup");
                  setMenuOpen(false);
                }}
                className="px-6 py-2 bg-orange text-white text-[18px] font-semibold rounded-3xl cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {authModalOpen && <AuthModal mode={authMode} onClose={closeAuthModal} />}
    </>
  );
};

export default NavBar;
