import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Eye, MoreVertical, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockApps, App } from '@/lib/mockData';
import { containerVariants, rowVariants } from '@/lib/animations';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function MyApps() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<App[]>(mockApps);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [newAppName, setNewAppName] = useState('');
  const [editAppName, setEditAppName] = useState('');

  const filteredApps = apps.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCreateApp = () => {
    if (!newAppName.trim()) {
      toast.error('Please enter an app name');
      return;
    }
    const newApp: App = {
      id: Date.now().toString(),
      name: newAppName.trim(),
      status: 'Draft',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      downloads: 0,
      icon: '📱',
    };
    setApps([newApp, ...apps]);
    setNewAppName('');
    setCreateDialogOpen(false);
    toast.success(`${newApp.name} created successfully!`);
  };

  const handleEditApp = () => {
    if (!selectedApp || !editAppName.trim()) {
      toast.error('Please enter an app name');
      return;
    }
    setApps(apps.map(app =>
      app.id === selectedApp.id
        ? { ...app, name: editAppName.trim(), lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
        : app
    ));
    setEditDialogOpen(false);
    setSelectedApp(null);
    setEditAppName('');
    toast.success('App updated successfully!');
  };

  const handleDeleteApp = () => {
    if (!selectedApp) return;
    setApps(apps.filter(app => app.id !== selectedApp.id));
    setDeleteDialogOpen(false);
    toast.success(`${selectedApp.name} deleted successfully!`);
    setSelectedApp(null);
  };

  const openEditDialog = (app: App) => {
    setSelectedApp(app);
    setEditAppName(app.name);
    setEditDialogOpen(true);
  };

  const openPreviewDialog = (app: App) => {
    setSelectedApp(app);
    setPreviewDialogOpen(true);
  };

  const openDeleteDialog = (app: App) => {
    setSelectedApp(app);
    setDeleteDialogOpen(true);
  };

  const openInBuilder = (app: App) => {
    toast.success(`Opening ${app.name} in App Builder...`);
    navigate('/dashboard/app-builder');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl">My Apps</h2>
          <p className="text-muted-foreground">Manage and monitor your mobile applications</p>
        </div>
        <Button variant="gradient" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />Create App
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search apps..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">App</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Last Updated</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Downloads</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredApps.map((app) => (
                  <motion.tr key={app.id} variants={rowVariants} initial="hidden" animate="visible" exit="exit" layout className="border-t border-border hover:bg-muted/30 transition-colors duration-150">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{app.icon}</span>
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-sm text-muted-foreground sm:hidden">{app.status} • {app.lastUpdated}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${app.status === 'Live' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${app.status === 'Live' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{app.lastUpdated}</td>
                    <td className="p-4 text-muted-foreground hidden lg:table-cell">{app.downloads?.toLocaleString() || '—'}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => openEditDialog(app)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => openPreviewDialog(app)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem onClick={() => openEditDialog(app)} className="sm:hidden"><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openPreviewDialog(app)} className="sm:hidden"><Eye className="h-4 w-4 mr-2" />Preview</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openInBuilder(app)}><Edit className="h-4 w-4 mr-2" />Open in Builder</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(app)} className="text-destructive focus:text-white focus:bg-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredApps.length === 0 && <div className="p-12 text-center"><p className="text-muted-foreground">No apps found</p></div>}
      </div>

      {/* Create App Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New App</DialogTitle>
            <DialogDescription>Enter a name for your new mobile application.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-app-name">App Name</Label>
              <Input
                id="new-app-name"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                placeholder="Enter app name"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateApp()}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleCreateApp}>Create App</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit App Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit App</DialogTitle>
            <DialogDescription>Update the app details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <span className="text-5xl">{selectedApp?.icon}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-app-name">App Name</Label>
              <Input
                id="edit-app-name"
                value={editAppName}
                onChange={(e) => setEditAppName(e.target.value)}
                placeholder="Enter app name"
                onKeyDown={(e) => e.key === 'Enter' && handleEditApp()}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 font-medium">{selectedApp?.status}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Downloads:</span>
                <span className="ml-2 font-medium">{selectedApp?.downloads?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleEditApp}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview App Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>App Preview</DialogTitle>
            <DialogDescription>Preview of {selectedApp?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mx-auto w-48 aspect-[9/16] bg-muted rounded-2xl border-4 border-foreground/20 flex flex-col items-center justify-center p-4">
              <span className="text-5xl mb-4">{selectedApp?.icon}</span>
              <h3 className="font-heading text-lg text-center">{selectedApp?.name}</h3>
              <span className={`mt-2 px-2 py-0.5 rounded-full text-xs ${selectedApp?.status === 'Live' ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                {selectedApp?.status}
              </span>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                {selectedApp?.downloads?.toLocaleString() || 0} downloads
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>Close</Button>
            <Button variant="gradient" onClick={() => {
              setPreviewDialogOpen(false);
              if (selectedApp) openInBuilder(selectedApp);
            }}>
              Open in Builder
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete App</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedApp?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Trash2 className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteApp}>Delete App</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
