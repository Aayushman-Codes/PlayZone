import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";

export function GameCard({ title, description, image, rating = 4.5, players, featured, onPlay }: {
  title: string;
  description: string;
  image: string;
  rating?: number;
  players: string;
  featured?: boolean;
  onPlay: () => void;
}) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-video">
        <ImageWithFallback
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform group-hover:scale-110"
        />
        {featured && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] border-0">
            Featured
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3>{title}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">{rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="flex justify-between items-center">
          {players && (
            <span className="text-sm text-muted-foreground">{players}</span>
          )}
          <button 
            onClick={onPlay}
            className="ml-auto px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Play Now
          </button>
        </div>
      </div>
    </Card>
  );
}