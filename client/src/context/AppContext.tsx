import { createContext, ReactNode, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "axios"

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Define the shape of the context
interface AppContextType {
  axios: typeof axios;
  navigate: ReturnType<typeof useNavigate>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  blogs: any[]; // Replace 'any' with your Blog type later
  setBlogs: React.Dispatch<React.SetStateAction<any[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [input, setInput] = useState<string>("");

  const fetchBlogs = async()=>{
    try {
        const { data } =  await axios.get('/api/blog/all')
        data.success ? setBlogs(data.blogs): toast.error(data.message)
    } catch (error: any) {
        toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchBlogs();
    const token = localStorage.getItem('token');
    if(token){
        setToken(token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  },[token])

  const value: AppContextType = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context safely
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
