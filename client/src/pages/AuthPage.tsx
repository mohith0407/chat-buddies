import React, { useEffect, useState } from "react";
import API from "../config/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, User, Image as ImageIcon, ArrowRight, Loader2 } from "lucide-react";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Determine initial state from URL
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle Avatar Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setAvatar(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/user/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Login Successful");
      navigate("/chats");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const { data } = await API.post("/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Registration Successful");
      navigate("/chats");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setName("");
    setAvatar(null);
    setAvatarPreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-800 p-8 relative z-10">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-400 text-sm">
                {isLogin ? "Enter your details to access your chats" : "Get started with your free account"}
            </p>
        </div>
        
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
          
          {!isLogin && (
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-500 group-focus-within:text-blue-500 transition" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                />
            </div>
          )}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-gray-500 group-focus-within:text-blue-500 transition" size={20} />
            </div>
            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-500 group-focus-within:text-blue-500 transition" size={20} />
            </div>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
            />
          </div>

          {!isLogin && (
            <div className="flex items-center gap-4">
                <div className="shrink-0">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="h-12 w-12 object-cover rounded-full border-2 border-blue-500" />
                    ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500">
                            <ImageIcon size={20} />
                        </div>
                    )}
                </div>
                <label className="block w-full">
                    <span className="sr-only">Choose profile photo</span>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-xs file:font-semibold
                        file:bg-blue-500/10 file:text-blue-400
                        hover:file:bg-blue-500/20
                        cursor-pointer"
                    />
                </label>
            </div>
          )}
          
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? (
                <Loader2 className="animate-spin" size={20} />
            ) : (
                <>
                    {isLogin ? "Sign In" : "Sign Up"} <ArrowRight size={18} />
                </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-blue-400 font-medium hover:text-blue-300 ml-1 transition focus:outline-none"
              onClick={toggleMode}
            >
              {isLogin ? "Register now" : "Login here"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;