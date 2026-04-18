import { useState, useEffect } from "react";
import { 
  Home, 
  Gamepad2, 
  User, 
  Info, 
  Mail, 
  MessageSquare, 
  Settings, 
  Moon, 
  Sun, 
  Bell,
  Menu,
  X,
  LogIn,
  UserPlus,
  BookOpen,
  Trophy
} from "lucide-react";
import { HomePage } from "./pages/HomePage";
import { GamesPage } from "./pages/GamesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ConnectFourPage } from "./pages/ConnectFourPage";
import { Game2048Page } from "./pages/Game2048Page";
import { TicTacToePage } from "./pages/TicTacToePage";
import { MemoryMatchPage } from "./pages/MemoryMatchPage";
import { BlackjackPage } from "./pages/BlackjackPage";
import { ChessMasterPage } from "./pages/ChessMasterPage";
import { PuzzleMasterPage } from "./pages/PuzzleMasterPage";
import { InstructionsPage } from "./pages/InstructionsPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";


export default function App() {
  const [page, setPage] = useState("login");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leaderboardInitialGame, setLeaderboardInitialGame] = useState<string | null>(null);

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Navigation items
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "games", label: "All Games", icon: Gamepad2 },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "instructions", label: "Instructions", icon: BookOpen },
    { id: "profile", label: "Profile", icon: User },
    { id: "about", label: "About Us", icon: Info },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const openLeaderboardForGame = (gameName: string | null) => {
    setLeaderboardInitialGame(gameName);
    setPage("leaderboard");
  };

  // Don't show sidebar on login/register pages
  if (page === "login" || page === "register") {
    return page === "login" ? 
      <LoginPage onNavigate={setPage} /> : 
      <RegisterPage onNavigate={setPage} />;
  }

  // Full-screen game pages
  if (page === "connect-four" || page === "2048" || page === "tic-tac-toe" || page === "memory-match" || page === "blackjack" || page === "chess" || page === "puzzle") {
    const handleBackToGames = () => setPage("games");
    const handleViewLeaderboard = (gameName: string) => openLeaderboardForGame(gameName);

    return page === "connect-four" ?
      <ConnectFourPage onBack={handleBackToGames} onViewLeaderboard={() => handleViewLeaderboard("Connect Four")} /> :
      page === "2048" ?
      <Game2048Page onBack={handleBackToGames} onViewLeaderboard={() => handleViewLeaderboard("2048")} /> :
      page === "tic-tac-toe" ?
      <TicTacToePage onBack={handleBackToGames} onViewLeaderboard={() => handleViewLeaderboard("Tic Tac Toe")} /> :
      page === "memory-match" ?
      <MemoryMatchPage onBack={handleBackToGames} onViewLeaderboard={() => handleViewLeaderboard("Memory Match")} /> :
      page === "blackjack" ?
      <BlackjackPage onBack={handleBackToGames} onViewLeaderboard={() => handleViewLeaderboard("Blackjack")} /> :
      page === "chess" ?
      <ChessMasterPage onBack={handleBackToGames} onViewLeaderboard={() => handleViewLeaderboard("Chess Master")} /> :
      <PuzzleMasterPage onBack={handleBackToGames} onViewLeaderboard={() => handleViewLeaderboard("Puzzle Master")} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
                PlayZone
              </h2>
              <p className="text-xs text-muted-foreground">Gaming Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = page === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "leaderboard") {
                        openLeaderboardForGame(null);
                      } else {
                        setPage(item.id);
                      }
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Auth links */}
            <div className="mt-6 pt-6 border-t space-y-1">
              <button
                onClick={() => {
                  setPage("login");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-foreground transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </button>
              <button
                onClick={() => {
                  setPage("register");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-foreground transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                <span>Register</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top nav */}
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
                PlayZone
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-accent rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--gaming-accent)]" />
              </button>

              <button 
                onClick={toggleTheme}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full">
                    <Avatar>
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Player1" />
                      <AvatarFallback>PZ</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setPage("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPage("settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setPage("login")}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {page === "home" && <HomePage onPlayGame={(gameId) => setPage(gameId)} />}
          {page === "games" && <GamesPage onPlayGame={(gameId) => setPage(gameId)} />}
          {page === "leaderboard" && <LeaderboardPage initialGame={leaderboardInitialGame} />}
          {page === "instructions" && <InstructionsPage />}
          {page === "profile" && <ProfilePage />}
          {page === "about" && <AboutPage />}
          {page === "contact" && <ContactPage />}
          {page === "feedback" && <FeedbackPage />}
          {page === "settings" && <SettingsPage isDark={darkMode} onToggleTheme={toggleTheme} />}
        </main>
      </div>
    </div>
  );
}