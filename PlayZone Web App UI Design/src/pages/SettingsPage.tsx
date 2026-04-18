import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Slider } from "../components/ui/slider";
import { Bell, Volume2, Monitor, Settings } from "lucide-react";

export function SettingsPage({ isDark, onToggleTheme }) {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Appearance */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="h-5 w-5 text-primary" />
              <h3>Appearance</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Customize how PlayZone looks and feels</p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <Switch checked={isDark} onCheckedChange={onToggleTheme} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reduce Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations for better performance</p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Display more content on screen</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-5 w-5 text-accent" />
              <h3>Notifications</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Choose what notifications you want to receive</p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about game invites and updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get updates and newsletters via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Game Updates</Label>
                  <p className="text-sm text-muted-foreground">Notify me when new games are available</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Friend Requests</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone sends you a friend request</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </Card>

        {/* Sound */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-5 w-5" style={{ color: "var(--neon-purple)" }} />
              <h3>Sound & Audio</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Adjust sound effects and music volume</p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable in-game sound effects</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Master Volume</Label>
                  <span className="text-sm text-muted-foreground">80%</span>
                </div>
                <Slider defaultValue={[80]} max={100} step={1} />
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Music Volume</Label>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Slider defaultValue={[60]} max={100} step={1} />
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Effects Volume</Label>
                  <span className="text-sm text-muted-foreground">90%</span>
                </div>
                <Slider defaultValue={[90]} max={100} step={1} />
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-5 w-5" style={{ color: "var(--neon-blue)" }} />
              <h3>Privacy & Security</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Control your privacy and security settings</p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Allow others to view your profile and stats</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Online Status</Label>
                  <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Friend Requests</Label>
                  <p className="text-sm text-muted-foreground">Enable others to send you friend requests</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
