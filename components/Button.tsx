"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = "primary", 
  children, 
  className = "", 
  ...props 
}) => {
  const baseStyles = "px-8 py-3 rounded-full font-medium transition-all duration-250 ease-out transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-lg shadow-primary/10 hover:shadow-primary/20",
    secondary: "bg-surface-high text-foreground hover:bg-surface-container",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
