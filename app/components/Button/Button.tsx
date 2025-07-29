"use client";

import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  type?: "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "cursor-pointer",
  variant = "primary",
  type = "button",
}) => {
  const baseStyle =
    "px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base";

  const variants = {
    primary: "bg-cyan-950 text-white hover:bg-cyan-900 border border-cyan-950",
    outline: "border border-cyan-950 text-cyan-950 hover:bg-cyan-100",
    ghost: "text-cyan-950 hover:bg-cyan-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(baseStyle, variants[variant], className)}
    >
      {children}
    </button>
  );
};

export default Button;
