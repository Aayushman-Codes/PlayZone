import { useState } from "react";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Star, MessageSquare, CheckCircle2 } from "lucide-react";
import { submitFeedback } from "../services/api";

export function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState("");
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await submitFeedback({
      name,
      rating,
      category,
      feedback,
    });

    if (res.success) {
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setCategory("");
        setFeedback("");
        setName("");
      }, 3000);
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="mb-2">We Value Your Feedback</h1>
          <p className="text-muted-foreground">
            Help us improve PlayZone by sharing your thoughts and experiences
          </p>
        </div>

        {submitted ? (
          <Card className="border-2 border-primary">
            <div className="p-12 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <CheckCircle2 className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h2>Thank You!</h2>
              <p className="text-muted-foreground">
                Your feedback has been successfully submitted. We appreciate your time and input!
              </p>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3>Share Your Experience</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Tell us what you think about PlayZone and how we can improve
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <Label>Your Name (optional)</Label>
                  <input
                    type="text"
                    className="w-full mt-2 px-3 py-2 rounded-lg border bg-card"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                {/* Rating */}
                <div>
                  <Label>Overall Rating</Label>
                  <div className="flex gap-2 items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-10 w-10 transition-colors ${
                            star <= (hovered || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-none text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-muted-foreground">
                        {rating === 1 && "Poor"}
                        {rating === 2 && "Fair"}
                        {rating === 3 && "Good"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Feedback Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-lg border bg-card"
                  >
                    <option value="">Select a category</option>
                    <option value="general">General Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="gameplay">Gameplay Experience</option>
                    <option value="ui">User Interface</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your detailed thoughts..."
                    className="min-h-[200px] mt-2"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Please be as detailed as possible.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={rating === 0}
                  className="w-full px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </Card>
        )}

        {/* Quick options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="p-6 text-center">
              <div className="text-3xl mb-2">🎮</div>
              <p>Love the games!</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:border-accent/50 transition-colors cursor-pointer">
            <div className="p-6 text-center">
              <div className="text-3xl mb-2">🐛</div>
              <p>Report a bug</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-[var(--neon-purple)]/5 to-[var(--neon-purple)]/10 border-[var(--neon-purple)]/20 hover:border-[var(--neon-purple)]/50 transition-colors cursor-pointer">
            <div className="p-6 text-center">
              <div className="text-3xl mb-2">💡</div>
              <p>Suggest a feature</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
