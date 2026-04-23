import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeScreen from "./pages/WelcomeScreen";
import ChatScreen from "./pages/ChatScreen";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app-container">
      {/* Background Orbs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ height: "100%", width: "100%" }}
          >
            <WelcomeScreen onJoin={setUser} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            style={{ height: "100%", width: "100%" }}
          >
            <ChatScreen user={user} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
