import { Card } from "../components/ui/card";
import { Gamepad2, Users, Target, Sparkles } from "lucide-react";

export function AboutPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-br from-primary to-accent">
            <Gamepad2 className="h-16 w-16 text-white" />
          </div>
        </div>
        <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          About PlayZone
        </h1>
        <p className="text-lg text-muted-foreground">
          Your ultimate destination for online gaming entertainment
        </p>
      </div>

      <Card className="border-2 hover:border-primary/50 transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3>Our Mission</h3>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              At PlayZone, our mission is to create a vibrant gaming community where players of all 
              skill levels can come together to enjoy classic and innovative games. We believe that 
              gaming should be accessible, fun, and bring people together.
            </p>
            <p>
              We're dedicated to providing a seamless gaming experience with a beautiful, modern 
              interface that works perfectly on any device. Whether you're a casual player looking 
              for a quick game or a competitive gamer seeking challenges, PlayZone has something for everyone.
            </p>
          </div>
        </div>
      </Card>

      <Card className="border-2 hover:border-accent/50 transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3>Our Vision</h3>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              We envision PlayZone as the go-to platform for online multiplayer gaming, where 
              innovation meets nostalgia. Our goal is to continuously expand our game library, 
              introduce new features, and foster a supportive community of gamers worldwide.
            </p>
            <p>
              Looking ahead, we plan to integrate advanced matchmaking systems, tournaments, 
              leaderboards, and social features that will make every gaming session more engaging 
              and rewarding. We're committed to listening to our community and evolving based on 
              your feedback.
            </p>
          </div>
        </div>
      </Card>

      <Card className="border-2 hover:border-[var(--neon-blue)]/50 transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5" style={{ color: "var(--neon-blue)" }} />
            <h3>Our Team</h3>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              PlayZone is built by a passionate team of developers, designers, and gaming enthusiasts 
              who understand what makes games fun and engaging. We work tirelessly to ensure that 
              every aspect of the platform is polished, responsive, and enjoyable.
            </p>
            <p>
              Our diverse team brings together expertise in game development, user experience design, 
              and community management to create an exceptional gaming platform that players love.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="p-6">
            <div className="text-4xl mb-2">1M+</div>
            <p className="text-muted-foreground">Active Players</p>
          </div>
        </Card>
        <Card className="text-center bg-gradient-to-br from-accent/10 to-accent/5">
          <div className="p-6">
            <div className="text-4xl mb-2">50+</div>
            <p className="text-muted-foreground">Games Available</p>
          </div>
        </Card>
        <Card className="text-center bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-purple)]/5">
          <div className="p-6">
            <div className="text-4xl mb-2">24/7</div>
            <p className="text-muted-foreground">Online Support</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
