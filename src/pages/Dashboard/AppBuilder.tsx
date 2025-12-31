import { useState, forwardRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Smartphone, Settings, Layers, GripVertical, X, ChevronRight, ChevronDown, Trash2, Edit2, Check, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Screen {
    id: string;
    name: string;
    components: AppComponent[];
}

interface AppComponent {
    id: string;
    type: string;
    props: Record<string, string>;
}

const availableComponents = [
    { id: 'header', name: 'Header', defaultProps: { title: 'Header Title', subtitle: 'Subtitle text' } },
    { id: 'button', name: 'Button', defaultProps: { text: 'Click Me', color: 'primary' } },
    { id: 'input', name: 'Text Input', defaultProps: { placeholder: 'Enter text...', label: 'Input Label' } },
    { id: 'image', name: 'Image', defaultProps: { src: 'placeholder.jpg', alt: 'Image' } },
    { id: 'list', name: 'List View', defaultProps: { items: '3', title: 'List Items' } },
    { id: 'card', name: 'Card', defaultProps: { title: 'Card Title', description: 'Card description' } },
    { id: 'nav', name: 'Navigation', defaultProps: { items: 'Home, Profile, Settings' } },
    { id: 'form', name: 'Form', defaultProps: { fields: 'Name, Email, Message' } },
];

const createComponent = (type: string): AppComponent => ({
    id: `${type}-${Date.now()}`,
    type,
    props: { ...(availableComponents.find(c => c.id === type)?.defaultProps || {}) },
});

export default function AppBuilder() {
    const [screens, setScreens] = useState<Screen[]>([
        { id: '1', name: 'Home', components: [createComponent('header'), createComponent('list')] },
        { id: '2', name: 'Profile', components: [createComponent('header'), createComponent('image'), createComponent('form')] },
        { id: '3', name: 'Settings', components: [createComponent('header'), createComponent('nav')] },
    ]);
    const [selectedScreen, setSelectedScreen] = useState<string>('1');
    const [showSettings, setShowSettings] = useState(false);
    const [appName, setAppName] = useState('My New App');
    const [selectedTheme, setSelectedTheme] = useState('#66B0EE');
    const [editingScreenId, setEditingScreenId] = useState<string | null>(null);
    const [editingScreenName, setEditingScreenName] = useState('');
    const [mobileScreensOpen, setMobileScreensOpen] = useState(true);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<AppComponent | null>(null);
    const [componentEditOpen, setComponentEditOpen] = useState(false);

    const currentScreen = screens.find(s => s.id === selectedScreen);

    const addScreen = () => {
        const newScreen: Screen = {
            id: Date.now().toString(),
            name: `Screen ${screens.length + 1}`,
            components: [],
        };
        setScreens([...screens, newScreen]);
        setSelectedScreen(newScreen.id);
        toast.success('New screen added');
    };

    const deleteScreen = (screenId: string) => {
        if (screens.length <= 1) {
            toast.error('Cannot delete the last screen');
            return;
        }
        const newScreens = screens.filter(s => s.id !== screenId);
        setScreens(newScreens);
        if (selectedScreen === screenId) {
            setSelectedScreen(newScreens[0].id);
        }
        toast.success('Screen deleted');
    };

    const startEditingScreen = (screen: Screen) => {
        setEditingScreenId(screen.id);
        setEditingScreenName(screen.name);
    };

    const saveScreenName = () => {
        if (editingScreenId && editingScreenName.trim()) {
            setScreens(screens.map(s =>
                s.id === editingScreenId ? { ...s, name: editingScreenName.trim() } : s
            ));
            setEditingScreenId(null);
            setEditingScreenName('');
            toast.success('Screen renamed');
        }
    };

    const addComponent = (componentType: string) => {
        if (!currentScreen) return;
        const newComponent = createComponent(componentType);
        setScreens(screens.map(s =>
            s.id === selectedScreen
                ? { ...s, components: [...s.components, newComponent] }
                : s
        ));
        toast.success(`${availableComponents.find(c => c.id === componentType)?.name} added`);
    };

    const removeComponent = (componentId: string) => {
        if (!currentScreen) return;
        const component = currentScreen.components.find(c => c.id === componentId);
        const componentName = availableComponents.find(c => c.id === component?.type)?.name;
        setScreens(screens.map(s =>
            s.id === selectedScreen
                ? { ...s, components: s.components.filter(c => c.id !== componentId) }
                : s
        ));
        toast.success(`${componentName} removed`);
    };

    const openComponentEdit = (component: AppComponent) => {
        setSelectedComponent(component);
        setComponentEditOpen(true);
    };

    const updateComponentProp = (key: string, value: string) => {
        if (!selectedComponent || !currentScreen) return;
        setScreens(screens.map(s =>
            s.id === selectedScreen
                ? {
                    ...s,
                    components: s.components.map(c =>
                        c.id === selectedComponent.id
                            ? { ...c, props: { ...c.props, [key]: value } }
                            : c
                    ),
                }
                : s
        ));
        setSelectedComponent(prev => prev ? { ...prev, props: { ...prev.props, [key]: value } } : null);
    };

    const setComponents = (newComponents: AppComponent[]) => {
        if (!selectedScreen) return;
        setScreens(screens.map(s =>
            s.id === selectedScreen ? { ...s, components: newComponents } : s
        ));
    };

    const handleSave = () => {
        toast.success('App saved successfully!');
    };

    const handlePreview = () => {
        setPreviewOpen(true);
    };

    const ScreenList = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className={cn('space-y-1', isMobile ? 'mt-2' : 'overflow-y-auto flex-1 scrollbar-thin')}>
            {screens.map((screen) => (
                <div
                    key={screen.id}
                    className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 group',
                        selectedScreen === screen.id
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                >
                    {editingScreenId === screen.id ? (
                        <div className="flex items-center gap-2 flex-1">
                            <Input
                                value={editingScreenName}
                                onChange={(e) => setEditingScreenName(e.target.value)}
                                className="h-7 text-sm"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && saveScreenName()}
                            />
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={saveScreenName}>
                                <Check className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setSelectedScreen(screen.id)}
                                className="flex items-center gap-2 flex-1 min-w-0"
                            >
                                <Smartphone className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{screen.name}</span>
                            </button>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => startEditingScreen(screen)}
                                >
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={() => deleteScreen(screen.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                            {selectedScreen === screen.id && (
                                <ChevronRight className="h-4 w-4 flex-shrink-0" />
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );

    const SettingsPanel = forwardRef<HTMLDivElement>((_, ref) => (
        <div ref={ref} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="appName">App Name</Label>
                <Input
                    id="appName"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label>Theme Color</Label>
                <div className="flex gap-2 flex-wrap">
                    {['#66B0EE', '#CDAFF5', '#4ADE80', '#F97316', '#EF4444', '#8B5CF6'].map((color) => (
                        <button
                            key={color}
                            onClick={() => {
                                setSelectedTheme(color);
                                toast.success('Theme updated');
                            }}
                            className={cn(
                                'w-8 h-8 rounded-lg border-2 transition-all duration-150',
                                selectedTheme === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'
                            )}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label>Current Screen</Label>
                <Input
                    value={currentScreen?.name || ''}
                    onChange={(e) => setScreens(screens.map(s =>
                        s.id === selectedScreen ? { ...s, name: e.target.value } : s
                    ))}
                />
            </div>
            <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">App Preview</p>
                <div
                    className="w-full aspect-[9/16] rounded-lg border-4 border-foreground/20 flex items-center justify-center"
                    style={{ backgroundColor: selectedTheme + '20' }}
                >
                    <div className="text-center">
                        <div
                            className="w-12 h-12 rounded-xl mx-auto mb-2"
                            style={{ backgroundColor: selectedTheme }}
                        />
                        <p className="text-sm font-medium">{appName}</p>
                        <p className="text-xs text-muted-foreground">{screens.length} screens</p>
                    </div>
                </div>
            </div>
        </div>
    ));
    SettingsPanel.displayName = 'SettingsPanel';

    // Render component preview
    const renderComponentPreview = (component: AppComponent) => {
        const meta = availableComponents.find(c => c.id === component.type);
        return (
            <div className="p-2 bg-muted/50 rounded-lg text-xs">
                {component.type === 'header' && (
                    <div className="text-center" style={{ borderBottom: `2px solid ${selectedTheme}` }}>
                        <div className="font-bold">{component.props.title}</div>
                        <div className="text-muted-foreground">{component.props.subtitle}</div>
                    </div>
                )}
                {component.type === 'button' && (
                    <div className="flex justify-center">
                        <div className="px-3 py-1 rounded text-primary-foreground text-xs" style={{ backgroundColor: selectedTheme }}>
                            {component.props.text}
                        </div>
                    </div>
                )}
                {component.type === 'input' && (
                    <div>
                        <div className="text-xs mb-1">{component.props.label}</div>
                        <div className="bg-background border rounded px-2 py-1 text-muted-foreground">{component.props.placeholder}</div>
                    </div>
                )}
                {component.type === 'image' && (
                    <div className="flex justify-center">
                        <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">🖼️</div>
                    </div>
                )}
                {component.type === 'list' && (
                    <div className="space-y-1">
                        <div className="font-medium">{component.props.title}</div>
                        {Array.from({ length: parseInt(component.props.items) || 3 }).map((_, i) => (
                            <div key={i} className="bg-background rounded px-2 py-1">Item {i + 1}</div>
                        ))}
                    </div>
                )}
                {component.type === 'card' && (
                    <div className="bg-background rounded p-2 border">
                        <div className="font-medium">{component.props.title}</div>
                        <div className="text-muted-foreground">{component.props.description}</div>
                    </div>
                )}
                {component.type === 'nav' && (
                    <div className="flex gap-2 justify-center">
                        {component.props.items?.split(',').map((item, i) => (
                            <div key={i} className="text-xs" style={{ color: i === 0 ? selectedTheme : undefined }}>{item.trim()}</div>
                        ))}
                    </div>
                )}
                {component.type === 'form' && (
                    <div className="space-y-1">
                        {component.props.fields?.split(',').map((field, i) => (
                            <div key={i} className="bg-background border rounded px-2 py-1">{field.trim()}</div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="h-[calc(100vh-theme(spacing.header)-3rem)] flex flex-col"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h2 className="font-heading text-xl sm:text-2xl">App Builder</h2>
                    <p className="text-sm text-muted-foreground">Build your app visually</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Mobile Settings Button */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="md:hidden">
                                <Settings className="h-4 w-4" />
                                <span className="ml-2">Settings</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                            <SheetHeader>
                                <SheetTitle>App Settings</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                                <SettingsPanel />
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Desktop Settings Toggle */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSettings(!showSettings)}
                        className={cn('hidden md:flex', showSettings && 'bg-muted')}
                    >
                        <Settings className="h-4 w-4" />
                        <span className="ml-2">Settings</span>
                    </Button>

                    <Button variant="gradient" size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Save</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePreview}>
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">Preview</span>
                    </Button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
                {/* Mobile/Tablet Screens Collapsible */}
                <div className="lg:hidden">
                    <Collapsible open={mobileScreensOpen} onOpenChange={setMobileScreensOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                <span className="flex items-center gap-2">
                                    <Layers className="h-4 w-4" />
                                    Screens ({screens.length})
                                </span>
                                <ChevronDown className={cn('h-4 w-4 transition-transform', mobileScreensOpen && 'rotate-180')} />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 bg-card border border-border rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">All Screens</span>
                                <Button variant="ghost" size="sm" onClick={addScreen}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                </Button>
                            </div>
                            <ScreenList isMobile />
                        </CollapsibleContent>
                    </Collapsible>
                </div>

                {/* Desktop Screens Panel */}
                <motion.div
                    variants={itemVariants}
                    className="hidden lg:flex w-48 xl:w-56 flex-shrink-0 bg-card border border-border rounded-xl p-3 flex-col"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-sm">Screens</h3>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={addScreen}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <ScreenList />
                </motion.div>

                {/* Canvas Area */}
                <motion.div
                    variants={itemVariants}
                    className="flex-1 bg-card border border-border rounded-xl p-3 sm:p-4 flex flex-col min-w-0 min-h-[300px] lg:min-h-0"
                >
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {currentScreen?.name} — {currentScreen?.components.length || 0} components
                        </span>
                    </div>

                    <div className="flex-1 bg-muted/30 rounded-lg border border-dashed border-border p-3 sm:p-4 overflow-y-auto scrollbar-thin">
                        <Reorder.Group axis="y" values={currentScreen?.components || []} onReorder={setComponents} className="space-y-2">
                            <AnimatePresence mode="popLayout">
                                {currentScreen?.components.map((comp) => {
                                    const component = availableComponents.find(c => c.id === comp.type);
                                    return (
                                        <Reorder.Item
                                            key={comp.id}
                                            value={comp}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.15 }}
                                            className="flex items-center gap-3 bg-card border border-border rounded-lg p-3 group cursor-grab active:cursor-grabbing hover:border-primary/50 relative overflow-hidden"
                                            onClick={() => openComponentEdit(comp)}
                                        >
                                            <div className="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span className="flex-1 text-sm font-medium truncate select-none">{component?.name}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive z-10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeComponent(comp.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </Reorder.Item>
                                    );
                                })}
                            </AnimatePresence>
                        </Reorder.Group>
                        {(!currentScreen || currentScreen.components.length === 0) && (
                            <div className="h-full min-h-[100px] flex items-center justify-center text-muted-foreground text-sm text-center p-4">
                                No components yet. Add components below.
                            </div>
                        )}
                    </div>

                    {/* Add Components */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                        <h4 className="text-sm font-heading mb-3 uppercase tracking-wider text-muted-foreground">Add Component</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
                            {availableComponents.map((component) => (
                                <Button
                                    key={component.id}
                                    variant="outline"
                                    onClick={() => addComponent(component.id)}
                                    className="justify-start h-10 px-4 text-sm font-medium hover:bg-primary/5 hover:border-primary/30 transition-all font-heading"
                                >
                                    {component.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Desktop Settings Panel */}
                <AnimatePresence>
                    {showSettings && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="hidden md:block w-64 xl:w-72 flex-shrink-0 bg-card border border-border rounded-xl p-4 overflow-y-auto scrollbar-thin"
                        >
                            <h3 className="font-medium mb-4">App Settings</h3>
                            <SettingsPanel />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Preview Dialog */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>App Preview - {appName}</DialogTitle>
                        <DialogDescription>Preview of your app with {screens.length} screens</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="mx-auto w-56 aspect-[9/16] bg-background rounded-2xl border-4 overflow-hidden" style={{ borderColor: selectedTheme }}>
                            <div className="h-full flex flex-col">
                                {/* Status bar */}
                                <div className="h-6 flex items-center justify-center text-xs" style={{ backgroundColor: selectedTheme }}>
                                    <span className="text-primary-foreground font-medium">{currentScreen?.name}</span>
                                </div>
                                {/* Content */}
                                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                                    {currentScreen?.components.map((comp) => (
                                        <div key={comp.id}>
                                            {renderComponentPreview(comp)}
                                        </div>
                                    ))}
                                    {currentScreen?.components.length === 0 && (
                                        <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                                            Empty screen
                                        </div>
                                    )}
                                </div>
                                {/* Navigation */}
                                <div className="h-10 border-t flex items-center justify-around px-4" style={{ borderColor: selectedTheme + '40' }}>
                                    {screens.slice(0, 4).map((screen) => (
                                        <button
                                            key={screen.id}
                                            onClick={() => setSelectedScreen(screen.id)}
                                            className={cn(
                                                'text-xs transition-colors',
                                                selectedScreen === screen.id ? 'font-medium' : 'text-muted-foreground'
                                            )}
                                            style={{ color: selectedScreen === screen.id ? selectedTheme : undefined }}
                                        >
                                            {screen.name.slice(0, 4)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Component Edit Dialog */}
            <Dialog open={componentEditOpen} onOpenChange={setComponentEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Edit {availableComponents.find(c => c.id === selectedComponent?.type)?.name}
                        </DialogTitle>
                        <DialogDescription>Update the component properties below.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {selectedComponent && Object.entries(selectedComponent.props).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={`prop-${key}`} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                                <Input
                                    id={`prop-${key}`}
                                    value={value}
                                    onChange={(e) => updateComponentProp(key, e.target.value)}
                                />
                            </div>
                        ))}
                        <div className="pt-2">
                            <Label className="text-muted-foreground text-xs">Preview</Label>
                            {selectedComponent && renderComponentPreview(selectedComponent)}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setComponentEditOpen(false)}>Cancel</Button>
                        <Button variant="gradient" onClick={() => {
                            setComponentEditOpen(false);
                            toast.success('Component updated!');
                        }}>Save Changes</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
