"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check, Palette } from "lucide-react";

const COLOR_THEMES = [
  { id: "teal", label: "Teal", color: "bg-teal-500" },
  { id: "blue", label: "Blue", color: "bg-blue-500" },
  { id: "purple", label: "Purple", color: "bg-purple-500" },
  { id: "rose", label: "Rose", color: "bg-rose-500" },
  { id: "orange", label: "Orange", color: "bg-orange-500" },
  { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [colorTheme, setColorTheme] = useState("teal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load saved color theme
    const saved = localStorage.getItem("campuscash_color_theme");
    if (saved && COLOR_THEMES.some(t => t.id === saved)) {
      setColorTheme(saved);
      applyColorTheme(saved);
    }
  }, []);

  const applyColorTheme = (themeId: string) => {
    const html = document.documentElement;
    // Remove all theme classes
    COLOR_THEMES.forEach(t => {
      html.classList.remove(`theme-${t.id}`);
    });
    // Add new theme class (teal is default, no class needed)
    if (themeId !== "teal") {
      html.classList.add(`theme-${themeId}`);
    }
  };

  const handleColorThemeChange = (themeId: string) => {
    setColorTheme(themeId);
    applyColorTheme(themeId);
    localStorage.setItem("campuscash_color_theme", themeId);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9">
        <Palette className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Theme settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Mode</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </div>
          {theme === "light" && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </div>
          {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </div>
          {theme === "system" && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Color</DropdownMenuLabel>
        
        {COLOR_THEMES.map((t) => (
          <DropdownMenuItem 
            key={t.id}
            onClick={() => handleColorThemeChange(t.id)} 
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full ${t.color}`} />
              <span>{t.label}</span>
            </div>
            {colorTheme === t.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
