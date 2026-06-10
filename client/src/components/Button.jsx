import { useState } from "react";

const Button = ({ children, onClick, color = "#1a1a2e", textColor = "white", size = "md", disabled = false, minWidth }) => {
    const [hovered, setHovered] = useState(false);

    const sizes = {
        sm: { padding: "6px 12px", fontSize: "13px" },
        md: { padding: "8px 16px", fontSize: "14px" },
        lg: { padding: "10px 20px", fontSize: "15px" },
    };

    const style = {
        ...sizes[size],
        backgroundColor: hovered ? darken(color) : color,
        color: textColor,
        border: "none",
        borderRadius: "6px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.2s ease",
        transform: hovered && !disabled ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered && !disabled ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
        fontWeight: "500",
        whiteSpace: "nowrap",
        minWidth,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
    };

    return (
        <button
            style={style}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </button>
    );
};

// Simple darken helper
const darken = (hex) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, (num >> 16) - 30);
    const g = Math.max(0, ((num >> 8) & 0xff) - 30);
    const b = Math.max(0, (num & 0xff) - 30);
    return `rgb(${r},${g},${b})`;
};

export default Button;