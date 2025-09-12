import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { VoiceController } from "@/components/voice/VoiceController";
import { useTranslation } from 'react-i18next';
import {
  Home,
  BarChart3,
  FileText,
  AlertTriangle,
  BookOpen,
  FileSpreadsheet,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Report", href: "/report", icon: FileText },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Awareness", href: "/awareness", icon: BookOpen },
  { name: "Reports", href: "/reports", icon: FileSpreadsheet },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover-lift">
            <div className="flex flex-col leading-tight">
              <h1 className="text-lg font-bold text-foreground whitespace-nowrap">
                Swastha Sarthi
              </h1>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                Health Monitoring System
              </p>
            </div>

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "hero" : "minimal"}
                    size="sm"
                    className={cn(
                      "flex items-center space-x-2",
                      isActive && "animate-pulse-glow"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t(item.name.toLowerCase())}</span>
                  </Button>
                </Link>
              );
            })}


            {/* Voice Controller */}
            <VoiceController />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <Button
              variant="minimal"
              size="icon"
              onClick={toggleTheme}
              className="ml-2"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="minimal"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "hero" : "minimal"}
                      className={cn(
                        "w-full justify-start space-x-3",
                        isActive && "animate-pulse-glow"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t(item.name.toLowerCase())}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}