import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Shield, MoreVertical, Search, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockTeamMembers, TeamMember } from '@/lib/mockData';
import { containerVariants, itemVariants } from '@/lib/animations';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const roleColors: Record<string, string> = { Owner: 'bg-primary/20 text-primary', Admin: 'bg-secondary/20 text-secondary', Editor: 'bg-muted text-foreground', Viewer: 'bg-muted text-muted-foreground' };

export default function Collaboration() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('Viewer');

  // Dialog states for "Send Message" and "Change Role"
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Form states
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [newRole, setNewRole] = useState<string>('');

  const filteredMembers = members.filter(member => member.name.toLowerCase().includes(searchQuery.toLowerCase()) || member.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const getInitials = (name: string) => name.split(' ').map(n => (n ? n[0] : '')).join('').toUpperCase().slice(0, 2);

  const handleInvite = () => {
    if (!inviteEmail) return;
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole as TeamMember['role'],
      isOnline: false,
      lastAction: 'Just invited'
    };
    setMembers([newMember, ...members]);
    setInviteEmail('');
    setInviteRole('Viewer');
    setIsInviteOpen(false);
    toast.success(`Invitation sent to ${newMember.email}`);
  };

  const openMessageDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setMessageSubject('');
    setMessageBody('');
    setIsMessageOpen(true);
  };

  const handleSendMessage = () => {
    if (!selectedMember) return;
    if (!messageSubject.trim() || !messageBody.trim()) {
      toast.error('Please fill in both subject and message body');
      return;
    }

    // In a real app, this would make an API call
    toast.success(`Message sent to ${selectedMember.name}`);
    setIsMessageOpen(false);
    setSelectedMember(null);
  };

  const openRoleDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setIsRoleOpen(true);
  };

  const handleChangeRole = () => {
    if (!selectedMember || !newRole) return;

    setMembers(members.map(m =>
      m.id === selectedMember.id ? { ...m, role: newRole as TeamMember['role'] } : m
    ));

    toast.success(`Role for ${selectedMember.name} updated to ${newRole}`);
    setIsRoleOpen(false);
    setSelectedMember(null);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h2 className="font-heading text-2xl">Team Collaboration</h2><p className="text-muted-foreground">Manage your team members and permissions</p></div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild><Button variant="gradient"><UserPlus className="h-4 w-4" />Invite Member</Button></DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="font-heading">Invite Team Member</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" placeholder="colleague@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} /></div>
              <div className="space-y-2"><Label>Role</Label><Select value={inviteRole} onValueChange={setInviteRole}><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger><SelectContent className="bg-card border-border"><SelectItem value="Admin">Admin</SelectItem><SelectItem value="Editor">Editor</SelectItem><SelectItem value="Viewer">Viewer</SelectItem></SelectContent></Select></div>
              <Button variant="gradient" className="w-full" onClick={handleInvite}>Send Invitation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search team members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>

      <motion.div variants={containerVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <motion.div key={member.id} variants={itemVariants} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative"><Avatar className="h-12 w-12 border border-border"><AvatarFallback className="bg-muted text-foreground">{getInitials(member.name)}</AvatarFallback></Avatar><span className={cn('absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card', member.isOnline ? 'bg-primary animate-pulse-glow' : 'bg-muted-foreground')} /></div>
                <div><div className="font-medium">{member.name}</div><div className="text-sm text-muted-foreground">{member.email}</div></div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem onClick={() => openMessageDialog(member)}>
                    <Mail className="h-4 w-4 mr-2 " />
                    Send message
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openRoleDialog(member)}>
                    <Shield className="h-4 w-4 mr-2" />
                    Change role
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center justify-between"><span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', roleColors[member.role])}>{member.role}</span><span className="text-xs text-muted-foreground">{member.lastAction}</span></div>
          </motion.div>
        ))}
      </motion.div>
      {filteredMembers.length === 0 && <div className="py-12 text-center"><p className="text-muted-foreground">No team members found</p></div>}

      {/* Send Message Dialog */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message {selectedMember?.name}</DialogTitle>
            <DialogDescription>Send a direct message to this team member.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Message Subject"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2 mb-3">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                rows={4}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:space-x-0">
            <Button variant="outline" onClick={() => setIsMessageOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleSendMessage}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isRoleOpen} onOpenChange={setIsRoleOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>Select a new role for {selectedMember?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">Role</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 sm:space-x-0">
            <Button variant="outline" onClick={() => setIsRoleOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleChangeRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
}
