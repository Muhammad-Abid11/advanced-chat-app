import { motion } from "framer-motion";

const colors = {
    error: "#ef4444",
    success: "#22c55e",
    warning: "#f59e0b",
};

const ErrorMessage = ({ message, type = "error" }) => {
    if (!message) return null;

    const color = colors[type];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                padding: "12px",
                background: `${color}1A`,
                border: `1px solid ${color}33`,
                borderRadius: "12px",
                color,
                fontSize: "0.9rem",
                marginBottom: "24px",
                fontWeight: "500",
            }}
        >
            {message}
        </motion.div>
    );
};

export default ErrorMessage;