import { useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Mail, MapPin, Phone, Send, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { submitContactForm } from "../services/api";

export function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = `${firstName} ${lastName}`;

    const res = await submitContactForm({
      name: fullName,
      email,
      subject,
      message,
    });

    if (res.success) {
      alert("Message sent successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-2">Contact Us</h1>
          <p className="text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <Card className="lg:col-span-2">
            <div className="p-6">
              <h3 className="mb-2">Send us a message</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="mt-2"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="mt-2"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="mt-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    className="mt-2"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[150px] mt-2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </div>
          </Card>

          {/* Contact info */}
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>support@playzone.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[var(--neon-blue)]/10">
                      <MapPin className="h-5 w-5" style={{ color: "var(--neon-blue)" }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p>
                        123 Gaming Street
                        <br />
                        San Francisco, CA 94102
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="p-6">
                <h3 className="mb-2">Follow Us</h3>
                <p className="text-sm text-muted-foreground mb-4">Stay connected on social media</p>
                <div className="flex gap-3">
                  <button className="p-2 border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors">
                    <Facebook className="h-5 w-5" />
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-colors">
                    <Instagram className="h-5 w-5" />
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-[var(--gaming-accent)] hover:text-white hover:border-[var(--gaming-accent)] transition-colors">
                    <Youtube className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
