// AuthModal.tsx
import { useState, useEffect } from "react";
import Google from "../assets/google.svg"
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
type AuthMode = "login" | "signup";

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode: initialMode, onClose }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-black/60 z-[9999]">
      <div className="bg-white w-[85%] sm:w-full max-w-md rounded-2xl px-[32px] sm:px-[48px]  py-[40px] shadow-xl relative" data-aos = "fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl cursor-pointer">
          <AiOutlineClose color="#FA8B02"/>
        </button>

        <h2 className="text-2xl font-bold  mb-6">
          {mode === "signup" ? "Create Account" : "Login"}
        </h2>

        <form className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2.5">
                Name and Surname
              </label>
              <input
                type="text"
                placeholder="Enter your name and surname"
                className="w-full px-4 py-2  border border-[#33333333] outline-0 rounded-md"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2.5">Email Address</label>
            <input type="email" placeholder="Enter your email" className="w-full px-4 py-2  border border-[#33333333] outline-0 rounded-md" />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-400">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-4 py-2  border border-[#33333333] outline-0  rounded-md mt-2.5"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-8 right-3 text-gray-500 mt-2.5">
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          {mode === "signup" && (
            <div className="text-sm">
              <input type="checkbox" id="agree" className="mr-2" />
              <label htmlFor="agree" className="text-gray-400">
                I agree with <a href="#" className="text-orange">Terms <span className="text-gray-400">and</span> Privacy</a>
              </label>
            </div>
          )}

          {mode === "login" && (
            <div className="text-right text-sm">
              <a href="#" className="text-gray-400 underline">Forgot your password?</a>
            </div>
          )}

          <button className="w-full bg-orange hover:bg-orange-300 duration-200 cursor-pointer text-white font-semibold py-2 rounded-full">
            {mode === "signup" ? "Sign Up" : "Sign In"}
          </button>

          <div className="text-center text-sm text-gray-400">or</div>

          <button className="w-full flex items-center justify-center gap-2 border border-[#33333333] text-gray-400 cursor-pointer  rounded-full py-2">
            <Image src={Google} alt="google-icon"/>{mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
          </button>

          <div className="text-center text-sm text-gray-400 mt-4">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button className="text-orange font-semibold cursor-pointer" onClick={() => setMode("login")}>
                  Log in
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button className="text-orange font-semibold cursor-pointer" onClick={() => setMode("signup")}>
                  Sign up
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
