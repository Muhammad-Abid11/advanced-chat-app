import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { getMeApi, logoutApi } from "./api/auth/auth.api";
import WelcomeScreen from "./pages/WelcomeScreen";
import ChatScreen from "./pages/ChatScreen";
import { connectWebSocket } from "./config/socket";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔁 Load user on refresh
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getMeApi();
        setUser(res.data.user);

        // connect socket AFTER user is valid
        connectWebSocket(token);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);

    const token = localStorage.getItem("token");
    connectWebSocket(token);
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if API fails, clear local state
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <div className="app-container">
      {/* Background Orbs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loader-container"
          >
            <div className="loader"></div>
            <div className="loading-text">LUMINA</div>
          </motion.div>
        ) : (
          <motion.div
            key={user ? "app" : "auth"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ height: "100%", width: "100%" }}
          >
            <Routes location={location}>
              <Route 
                path="/login" 
                element={
                  !user ? (
                    <WelcomeScreen onJoin={handleAuth} />
                  ) : (
                    <Navigate to="/chat/general" />
                  )
                } 
              />
              <Route 
                path="/chat/:chatId" 
                element={
                  user ? (
                    <ChatScreen user={user} onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" />
                  )
                } 
              />
              <Route path="/" element={<Navigate to={user ? "/chat/general" : "/login"} />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
