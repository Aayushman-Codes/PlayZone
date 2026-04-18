import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Trophy, Target, Gamepad2, Award, Edit2, Crown } from "lucide-react";

const achievements = [
  { name: "First Win", icon: "🏆", unlocked: true },
  { name: "10 Wins", icon: "⭐", unlocked: true },
  { name: "50 Wins", icon: "💫", unlocked: true },
  { name: "100 Games", icon: "🎮", unlocked: true },
  { name: "Speed Demon", icon: "⚡", unlocked: true },
  { name: "Perfect Score", icon: "💯", unlocked: true },
  { name: "Night Owl", icon: "🦉", unlocked: false },
  { name: "Streak Master", icon: "🔥", unlocked: false },
  { name: "500 Wins", icon: "👑", unlocked: false },
  { name: "Legendary", icon: "✨", unlocked: false },
];

export function ProfilePage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-primary">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Player1" />
                  <AvatarFallback>PZ</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h3>ProGamer123</h3>
            <p className="text-sm text-muted-foreground mb-4">Member since Oct 2025</p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Level 42
              </Badge>
              <Badge className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] border-0">
                Pro Player
              </Badge>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm">Total Games Played</h4>
                <Gamepad2 className="h-4 w-4 text-primary" />
              </div>
              <div className="text-3xl">1,247</div>
              <p className="text-xs text-muted-foreground mt-1">+23 from last week</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm">Win Rate</h4>
                <Trophy className="h-4 w-4 text-accent" />
              </div>
              <div className="text-3xl">68.5%</div>
              <p className="text-xs text-muted-foreground mt-1">Above average!</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--neon-blue)]/10 to-[var(--neon-blue)]/5 border-[var(--neon-blue)]/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm">Favorite Game</h4>
                <Target className="h-4 w-4" style={{ color: "var(--neon-blue)" }} />
              </div>
              <div className="text-xl">Connect Four</div>
              <p className="text-xs text-muted-foreground mt-1">342 games played</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--gaming-accent)]/10 to-[var(--gaming-accent)]/5 border-[var(--gaming-accent)]/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm">Achievements</h4>
                <Award className="h-4 w-4" style={{ color: "var(--gaming-accent)" }} />
              </div>
              <div className="text-3xl">24/50</div>
              <p className="text-xs text-muted-foreground mt-1">Keep unlocking!</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit form */}
      <Card>
        <div className="p-6">
          <h3 className="mb-2">Edit Profile</h3>
          <p className="text-sm text-muted-foreground mb-6">Update your personal information</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="ProGamer123" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="progamer@playzone.com" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" className="mt-2" />
            </div>
          </div>
          
          <button className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </div>
      </Card>

      {/* Achievements */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h3>Achievements & Badges</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Your gaming accomplishments</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {achievements.map((achievement, i) => (
              <div
                key={i}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? "border-primary bg-primary/5 hover:bg-primary/10"
                    : "border-dashed border-muted bg-muted/20 opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-xs text-center">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
