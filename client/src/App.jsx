import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomeScreen";
import ChatScreen from "./pages/ChatScreen";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import useAuthStore from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";

function App() {
  const { user, loading, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <div className="loading-text">LUMINA</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Toaster position="top-right"/>
      {/* Background Orbs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname.split("/")[1] || "root"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ height: "100%", width: "100%" }}
        >
          <Routes location={location}>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<WelcomeScreen />} />
            </Route>

            {/* Private Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/chat/:chatId"
                element={<ChatScreen />}
              />
              <Route
                path="/chat"
                element={<ChatScreen />}
              />
            </Route>

            {/* Default Redirects */}
            <Route
              path="/"
              element={
                <Navigate to={user ? "/chat" : "/login"} replace />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
