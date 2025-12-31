import { useState } from 'react';
import { Menu, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setProfileOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-header bg-background border-b border-border">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:bg-muted"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2">
                <img src="/Logo.svg" alt="Sus-Tech" className="w-20 h-20" />
              </div>

            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted px-2">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="bg-muted text-foreground text-sm">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <DropdownMenuItem
                  onClick={() => navigate('/dashboard/settings')}
                  className="flex items-center gap-2 text-foreground hover:bg-muted cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-heading">
                  {profileName ? getInitials(profileName) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setProfileOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
