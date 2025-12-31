import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Bell, LogOut, Save, Check, Eye, EyeOff, CreditCard, Calendar, Calendar as CalendarIcon, Download } from 'lucide-react';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const { user, logout } = useAuth();

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [appUpdates, setAppUpdates] = useState(true);
  // Billing state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [cardCVC, setCardCVC] = useState('');
  const datePickerRef = useRef<ReactDatePicker>(null);

  const billingHistory = [
    { date: 'Dec 1, 2025', amount: '$29.00', status: 'Starter Plan', invoice: 'INV-001' },
    { date: 'Nov 1, 2025', amount: '$29.00', status: 'Starter Plan', invoice: 'INV-002' },
    { date: 'Oct 1, 2025', amount: '$29.00', status: 'Starter Plan', invoice: 'INV-003' },
  ];

  const downloadBillingHistory = () => {
    const content = `BILLING HISTORY\n================\n\n` +
      billingHistory.map(item =>
        `Date: ${item.date}\nAmount: ${item.amount}\nStatus: ${item.status}\nInvoice: ${item.invoice}\n----------------`
      ).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'billing_history.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Billing history downloaded as .txt');
  };

  const downloadInvoice = (item: any) => {
    const content = `INVOICE: ${item.invoice}\n================\nDate: ${item.date}\nAmount: ${item.amount}\nStatus: ${item.status}\n\nThank you for your business!`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_${item.invoice}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Invoice ${item.invoice} downloaded`);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Valid email is required');
      return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (!newPassword) {
      toast.error('New password is required');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password changed successfully!');
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    toast.success('Notification preferences saved!');
  };

  const handleSave = () => {
    if (activeTab === 'profile') {
      handleSaveProfile();
    } else if (activeTab === 'billing') {
      toast.success('Billing information saved!');
    } else {
      handleSaveNotifications();
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Horizontal Tabs */}
        <motion.div variants={itemVariants}>
          <div className="bg-card border border-border rounded-xl p-2">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 flex-shrink-0 whitespace-nowrap',
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
              <div className="flex-1" />
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-heading text-lg mb-1">Profile Information</h3>
                  <p className="text-sm text-muted-foreground">Update your account details</p>
                </div>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-heading text-lg mb-1">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
                </div>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-heading text-lg mb-1">Billing & Subscription</h3>
                  <p className="text-sm text-muted-foreground">Manage your subscription and payment methods</p>
                </div>

                {/* Current Plan */}
                <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-heading text-lg">Starter Plan</h4>
                        <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium">Current</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Basic features for personal use</p>
                    </div>
                    <div className="text-right">
                      <div className="font-heading text-2xl">$29</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                  </div>
                  <a href="https://sus-technology.com/pricing" target="_blank" rel="noopener noreferrer">
                    <Button variant="gradient" className="w-full sm:w-auto">
                      Upgrade to Pro
                    </Button>
                  </a>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Payment Method</h4>
                    <div className="flex gap-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          maxLength={19}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <div className="relative">
                          <DatePicker
                            id="expiry"
                            ref={datePickerRef}
                            selected={expiryDate}
                            onChange={(date: Date) => setExpiryDate(date)}
                            dateFormat="MM/yy"
                            showMonthYearPicker
                            showFullMonthYearPicker
                            minDate={new Date()}
                            placeholderText="MM/YY"
                            className={cn(
                              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                              'pl-10',
                              !expiryDate && 'text-muted-foreground'
                            )}
                          />
                          <CalendarIcon 
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                            onClick={() => datePickerRef.current?.setFocus()}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          type="password"
                          value={cardCVC}
                          onChange={(e) => setCardCVC(e.target.value)}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing History */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Billing History</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={downloadBillingHistory}
                    >
                      <Download className="h-4 w-4" />
                      Download All (.txt)
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {billingHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{item.date}</div>
                            <div className="text-xs text-muted-foreground">{item.status}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.amount}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => downloadInvoice(item)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-heading text-lg mb-1">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive updates via email</div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={(checked) => {
                        setEmailNotifications(checked);
                        toast.success(checked ? 'Email notifications enabled' : 'Email notifications disabled');
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-muted-foreground">Get notified in your browser</div>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={(checked) => {
                        setPushNotifications(checked);
                        toast.success(checked ? 'Push notifications enabled' : 'Push notifications disabled');
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">Weekly Digest</div>
                      <div className="text-sm text-muted-foreground">Summary of your weekly activity</div>
                    </div>
                    <Switch
                      checked={weeklyDigest}
                      onCheckedChange={(checked) => {
                        setWeeklyDigest(checked);
                        toast.success(checked ? 'Weekly digest enabled' : 'Weekly digest disabled');
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">App Updates</div>
                      <div className="text-sm text-muted-foreground">News about new features and updates</div>
                    </div>
                    <Switch
                      checked={appUpdates}
                      onCheckedChange={(checked) => {
                        setAppUpdates(checked);
                        toast.success(checked ? 'App update notifications enabled' : 'App update notifications disabled');
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-border flex justify-end">
            <Button variant="gradient" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Save className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
