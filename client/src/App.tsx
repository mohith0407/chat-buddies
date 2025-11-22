
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Homepage from "./pages/Homepage";

function App() {
  return (
  
        <div className="App font-sans text-gray-900">
          <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/chats" element={<ChatPage />} />
          </Routes>
          <ToastContainer position="bottom-right" />
        </div>
  );
}

export default App;