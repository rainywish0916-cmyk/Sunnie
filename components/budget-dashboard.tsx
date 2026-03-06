"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { InstallPrompt } from "@/components/install-prompt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  GraduationCap,
  Coffee,
  Home,
  Car,
  ShoppingBag,
  Utensils,
  Smartphone,
  Dumbbell,
  BookOpen,
  Pencil,
  Check,
  Calendar,
  Bell,
  AlertTriangle,
  Zap,
  Heart,
  Wifi,
  CreditCard,
  Fuel,
  Tv,
  Music,
  Film,
  Users,
  Lock,
  Sparkles,
  Gift,
  PartyPopper,
  Target,
  RefreshCw,
  Clock,
  Settings,
} from "lucide-react";

// Bill group types
type BillGroup = "fixed" | "control" | "personal";

type BillCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  group: BillGroup;
};

type Bill = {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  group: BillGroup;
  dueDate?: string;
  reminder: boolean;
  reminderDays?: number;
};

type Income = {
  id: string;
  source: string;
  amount: number;
};

type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
};

type SavingUpItem = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  categoryId: string;
  targetDate?: string;
};

// Saving up categories for personal expenses
const SAVING_UP_CATEGORIES = [
  { id: "beauty", name: "Hair/Nails/Beauty", icon: <Sparkles className="h-4 w-4" />, color: "#ec4899" },
  { id: "phone", name: "Phone Upgrade", icon: <Smartphone className="h-4 w-4" />, color: "#8b5cf6" },
  { id: "dinner", name: "Special Dinner/Celebration", icon: <Utensils className="h-4 w-4" />, color: "#f97316" },
  { id: "gift", name: "Birthday/Gift", icon: <Gift className="h-4 w-4" />, color: "#ef4444" },
  { id: "event", name: "Event/Concert/Show", icon: <PartyPopper className="h-4 w-4" />, color: "#06b6d4" },
  { id: "other", name: "Other", icon: <Target className="h-4 w-4" />, color: "#64748b" },
];

// Savings goal icons
const SAVINGS_GOAL_ICONS = [
  { id: "car", name: "New Car", icon: "🚗" },
  { id: "vacation", name: "Vacation", icon: "🏖️" },
  { id: "holiday", name: "Holiday Trip", icon: "✈️" },
  { id: "emergency", name: "Emergency Fund", icon: "🛡️" },
  { id: "laptop", name: "New Laptop", icon: "💻" },
  { id: "apartment", name: "Apartment Deposit", icon: "🏠" },
  { id: "general", name: "General Savings", icon: "💰" },
];

// Categories organized by bill group
const BILL_CATEGORIES: BillCategory[] = [
  // Fixed Expenses - Critical payments
  { id: "rent", name: "Rent/Housing", icon: <Home className="h-4 w-4" />, color: "#dc2626", group: "fixed" },
  { id: "tuition", name: "Tuition & Fees", icon: <GraduationCap className="h-4 w-4" />, color: "#ea580c", group: "fixed" },
  { id: "car-payment", name: "Car Payment", icon: <Car className="h-4 w-4" />, color: "#d97706", group: "fixed" },
  { id: "insurance", name: "Insurance", icon: <Lock className="h-4 w-4" />, color: "#ca8a04", group: "fixed" },
  { id: "utilities", name: "Utilities", icon: <Zap className="h-4 w-4" />, color: "#65a30d", group: "fixed" },
  { id: "internet", name: "Internet/Phone", icon: <Wifi className="h-4 w-4" />, color: "#16a34a", group: "fixed" },

  // Control Expenses - Variable but necessary
  { id: "gas", name: "Gas/Fuel", icon: <Fuel className="h-4 w-4" />, color: "#0891b2", group: "control" },
  { id: "food", name: "Food/Groceries", icon: <Utensils className="h-4 w-4" />, color: "#0284c7", group: "control" },
  { id: "credit-card", name: "Credit Card", icon: <CreditCard className="h-4 w-4" />, color: "#2563eb", group: "control" },
  { id: "supplies", name: "School Supplies", icon: <BookOpen className="h-4 w-4" />, color: "#4f46e5", group: "control" },
  { id: "health", name: "Health/Medical", icon: <Dumbbell className="h-4 w-4" />, color: "#7c3aed", group: "control" },

  // Personal Expenses - Discretionary
  { id: "streaming", name: "Streaming Services", icon: <Tv className="h-4 w-4" />, color: "#a855f7", group: "personal" },
  { id: "music", name: "Music/Subscriptions", icon: <Music className="h-4 w-4" />, color: "#c026d3", group: "personal" },
  { id: "entertainment", name: "Entertainment", icon: <Film className="h-4 w-4" />, color: "#db2777", group: "personal" },
  { id: "dining-out", name: "Dining Out", icon: <Coffee className="h-4 w-4" />, color: "#e11d48", group: "personal" },
  { id: "dates", name: "Dates/Social", icon: <Heart className="h-4 w-4" />, color: "#f43f5e", group: "personal" },
  { id: "shopping", name: "Shopping/Personal", icon: <ShoppingBag className="h-4 w-4" />, color: "#64748b", group: "personal" },
  { id: "memberships", name: "Memberships", icon: <Users className="h-4 w-4" />, color: "#78716c", group: "personal" },
];

const BILL_GROUP_INFO = {
  fixed: {
    title: "Fixed Expenses",
    subtitle: "Critical payments - Missing these could seriously impact you",
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    description: "This group is for bills that if missed can have a massive impact on your situation and credit. Do Not Miss these.",
  },
  control: {
    title: "Control Expenses",
    subtitle: "Necessary expenses you can adjust the amount",
    icon: <Zap className="h-5 w-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "These bills you have some control, you should still pay these but you can control how much you pay. Be mindful don't let these get out of hand.",
  },
  personal: {
    title: "Personal Expenses",
    subtitle: "Discretionary spending - Can pause or cancel anytime",
    icon: <Heart className="h-5 w-5" />,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    description: "This group is for expenses for your well being. Expenses that are nice to have but important. Maybe some of these can be paused or cancelled if not being used.",
  },
};

export function BudgetDashboard() {
  const [incomes, setIncomes] = useState<Income[]>([
    { id: "1", source: "Part-time Job", amount: 800 },
    { id: "2", source: "Financial Aid", amount: 1200 },
  ]);

  const [bills, setBills] = useState<Bill[]>([
    { id: "1", description: "Apartment Rent", amount: 650, categoryId: "rent", group: "fixed", dueDate: "2024-03-01", reminder: true, reminderDays: 3 },
    { id: "2", description: "Car Insurance", amount: 120, categoryId: "insurance", group: "fixed", dueDate: "2024-03-15", reminder: true, reminderDays: 5 },
    { id: "3", description: "Weekly Groceries", amount: 200, categoryId: "food", group: "control", reminder: false },
    { id: "4", description: "Visa Card Min Payment", amount: 50, categoryId: "credit-card", group: "control", dueDate: "2024-03-20", reminder: true, reminderDays: 2 },
    { id: "5", description: "Netflix + Spotify", amount: 25, categoryId: "streaming", group: "personal", dueDate: "2024-03-10", reminder: false },
    { id: "6", description: "Going out fund", amount: 80, categoryId: "entertainment", group: "personal", reminder: false },
  ]);

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    { id: "1", name: "Emergency Fund", targetAmount: 1000, currentAmount: 250, icon: "🛡️" },
  ]);

  const [savingUpItems, setSavingUpItems] = useState<SavingUpItem[]>([
    { id: "1", name: "Birthday dinner for friend", targetAmount: 75, currentAmount: 30, categoryId: "dinner" },
  ]);

  const [newIncome, setNewIncome] = useState({ source: "", amount: "" });
  const [newBill, setNewBill] = useState({
    description: "",
    amount: "",
    categoryId: "",
    group: "" as BillGroup | "",
    dueDate: "",
    reminder: false,
    reminderDays: "3",
  });
  const [addBillDialogOpen, setAddBillDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<BillGroup | "">("");

  const [newSavingsGoal, setNewSavingsGoal] = useState({ name: "", targetAmount: "", icon: "💰" });
  const [addGoalDialogOpen, setAddGoalDialogOpen] = useState(false);

  const [newSavingUp, setNewSavingUp] = useState({ name: "", targetAmount: "", categoryId: "", targetDate: "" });
  const [addSavingUpDialogOpen, setAddSavingUpDialogOpen] = useState(false);

  const [appTitle, setAppTitle] = useState("CampusCash");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  // Review reminder system
  const [showReviewReminder, setShowReviewReminder] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewSettingsOpen, setReviewSettingsOpen] = useState(false);
  const [reviewIntervalDays, setReviewIntervalDays] = useState(60);

  // Check review reminder on mount
  useEffect(() => {
    // Load review interval from localStorage
    const storedInterval = localStorage.getItem("campuscash_review_interval");
    if (storedInterval) {
      setReviewIntervalDays(parseInt(storedInterval));
    }

    // FOR TESTING: Clear old data and set signup date to 61 days ago to trigger reminder
    localStorage.removeItem("campuscash_last_review");
    const testDate = new Date();
    testDate.setDate(testDate.getDate() - 61);
    const signupDate = testDate.toISOString();
    localStorage.setItem("campuscash_signup_date", signupDate);

    // Check if review is due (will be true since we set 61 days ago)
    const referenceDate = new Date(signupDate);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const interval = storedInterval ? parseInt(storedInterval) : 60;
    setShowReviewReminder(daysSince >= interval);
  }, []);

  const handleReviewComplete = useCallback(() => {
    localStorage.setItem("campuscash_last_review", new Date().toISOString());
    setShowReviewReminder(false);
    setReviewDialogOpen(false);
  }, []);

  const handleIntervalChange = useCallback((days: number) => {
    setReviewIntervalDays(days);
    localStorage.setItem("campuscash_review_interval", days.toString());
    setReviewSettingsOpen(false);
  }, []);

  const totalIncome = useMemo(
    () => incomes.reduce((sum, inc) => sum + inc.amount, 0),
    [incomes]
  );

  const totalExpenses = useMemo(
    () => bills.reduce((sum, bill) => sum + bill.amount, 0),
    [bills]
  );

  const expensesByGroup = useMemo(() => {
    const groups: Record<BillGroup, number> = { fixed: 0, control: 0, personal: 0 };
    bills.forEach((bill) => {
      groups[bill.group] += bill.amount;
    });
    return groups;
  }, [bills]);

  const balance = totalIncome - totalExpenses;
  
  const totalSavingsTarget = useMemo(
    () => savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0),
    [savingsGoals]
  );
  
  const totalSavingsProgress = useMemo(
    () => savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0),
    [savingsGoals]
  );

  const expensesByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    bills.forEach((bill) => {
      grouped[bill.categoryId] = (grouped[bill.categoryId] || 0) + bill.amount;
    });
    return BILL_CATEGORIES.filter((cat) => grouped[cat.id]).map((cat) => ({
      name: cat.name,
      value: grouped[cat.id],
      color: cat.color,
    }));
  }, [bills]);

  const addIncome = () => {
    if (newIncome.source && newIncome.amount) {
      setIncomes([
        ...incomes,
        {
          id: Date.now().toString(),
          source: newIncome.source,
          amount: parseFloat(newIncome.amount),
        },
      ]);
      setNewIncome({ source: "", amount: "" });
    }
  };

  const addBill = () => {
    if (newBill.description && newBill.amount && newBill.categoryId && newBill.group) {
      setBills([
        ...bills,
        {
          id: Date.now().toString(),
          description: newBill.description,
          amount: parseFloat(newBill.amount),
          categoryId: newBill.categoryId,
          group: newBill.group as BillGroup,
          dueDate: newBill.dueDate || undefined,
          reminder: newBill.reminder,
          reminderDays: newBill.reminder ? parseInt(newBill.reminderDays) : undefined,
        },
      ]);
      setNewBill({
        description: "",
        amount: "",
        categoryId: "",
        group: "",
        dueDate: "",
        reminder: false,
        reminderDays: "3",
      });
      setAddBillDialogOpen(false);
    }
  };

  const addSavingsGoal = () => {
    if (newSavingsGoal.name && newSavingsGoal.targetAmount) {
      setSavingsGoals([
        ...savingsGoals,
        {
          id: Date.now().toString(),
          name: newSavingsGoal.name,
          targetAmount: parseFloat(newSavingsGoal.targetAmount),
          currentAmount: 0,
          icon: newSavingsGoal.icon,
        },
      ]);
      setNewSavingsGoal({ name: "", targetAmount: "", icon: "💰" });
      setAddGoalDialogOpen(false);
    }
  };

  const updateGoalAmount = (goalId: string, amount: number) => {
    setSavingsGoals(savingsGoals.map(goal => 
      goal.id === goalId ? { ...goal, currentAmount: Math.max(0, goal.currentAmount + amount) } : goal
    ));
  };

  const removeGoal = (id: string) => {
    setSavingsGoals(savingsGoals.filter(goal => goal.id !== id));
  };

  const addSavingUpItem = () => {
    if (newSavingUp.name && newSavingUp.targetAmount && newSavingUp.categoryId) {
      setSavingUpItems([
        ...savingUpItems,
        {
          id: Date.now().toString(),
          name: newSavingUp.name,
          targetAmount: parseFloat(newSavingUp.targetAmount),
          currentAmount: 0,
          categoryId: newSavingUp.categoryId,
          targetDate: newSavingUp.targetDate || undefined,
        },
      ]);
      setNewSavingUp({ name: "", targetAmount: "", categoryId: "", targetDate: "" });
      setAddSavingUpDialogOpen(false);
    }
  };

  const updateSavingUpAmount = (itemId: string, amount: number) => {
    setSavingUpItems(savingUpItems.map(item => 
      item.id === itemId ? { ...item, currentAmount: Math.max(0, item.currentAmount + amount) } : item
    ));
  };

  const removeSavingUp = (id: string) => {
    setSavingUpItems(savingUpItems.filter(item => item.id !== id));
  };

  const removeIncome = (id: string) => {
    setIncomes(incomes.filter((inc) => inc.id !== id));
  };

  const removeBill = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  const getCategoryById = (id: string) =>
    BILL_CATEGORIES.find((cat) => cat.id === id);

  const getCategoriesByGroup = (group: BillGroup) =>
    BILL_CATEGORIES.filter((cat) => cat.group === group);

  const getBillsByGroup = (group: BillGroup) =>
    bills.filter((bill) => bill.group === group);

  const getSavingUpCategory = (id: string) =>
    SAVING_UP_CATEGORIES.find((cat) => cat.id === id);

  const openAddBillDialog = (group: BillGroup) => {
    setSelectedGroup(group);
    setNewBill({ ...newBill, group });
    setAddBillDialogOpen(true);
  };

  const formatDueDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const generateCalendarLink = (bill: Bill) => {
    if (!bill.dueDate) return "";
    const date = new Date(bill.dueDate);
    const title = encodeURIComponent(`Bill Due: ${bill.description}`);
    const details = encodeURIComponent(`Amount: $${bill.amount}`);
    const dateStr = date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}/${dateStr}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="h-9 w-full max-w-[180px] text-base sm:text-lg font-bold"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setAppTitle(tempTitle || "CampusCash");
                        setIsEditingTitle(false);
                      } else if (e.key === "Escape") {
                        setIsEditingTitle(false);
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      setAppTitle(tempTitle || "CampusCash");
                      setIsEditingTitle(false);
                    }}
                  >
                    <Check className="h-4 w-4 text-primary" />
                    <span className="sr-only">Save title</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="group flex items-center gap-1">
                    <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">{appTitle}</h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 opacity-70 sm:opacity-0 transition-opacity sm:group-hover:opacity-100"
                      onClick={() => {
                        setTempTitle(appTitle);
                        setIsEditingTitle(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="sr-only">Edit title</span>
                    </Button>
                  </div>
                  {showReviewReminder && (
                    <button
                      onClick={() => setReviewDialogOpen(true)}
                      className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-amber-600 hover:bg-amber-500/20 transition-colors animate-pulse text-xs sm:text-sm"
                    >
                      <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      <span className="font-medium hidden sm:inline">Time to check expenses</span>
                      <span className="font-medium sm:hidden">Review</span>
                    </button>
                  )}
                </div>
              )}
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Smart budgeting for students
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <InstallPrompt />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Summary Cards */}
        <div className="mb-6 sm:mb-8 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    Total Income
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">
                    ${totalIncome.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    Total Expenses
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">
                    ${totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <TrendingDown className="h-4 w-4 sm:h-6 sm:w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    Balance
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">
                    ${balance.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    Savings
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-primary whitespace-nowrap">
                    ${totalSavingsProgress} / ${totalSavingsTarget}
                  </p>
                </div>
                <Progress value={totalSavingsTarget > 0 ? (totalSavingsProgress / totalSavingsTarget) * 100 : 0} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {savingsGoals.length} goal{savingsGoals.length !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bill Group Summary */}
        <div className="mb-6 sm:mb-8 grid gap-2 sm:gap-4 grid-cols-3">
          {(["fixed", "control", "personal"] as BillGroup[]).map((group) => {
            const info = BILL_GROUP_INFO[group];
            return (
              <Card key={group} className={`border ${info.borderColor}`}>
                <CardContent className="p-2 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-3">
                    <div className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full ${info.bgColor}`}>
                      <span className={info.color}>{info.icon}</span>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] sm:text-sm font-medium text-muted-foreground leading-tight">{info.title.replace(" Expenses", "")}</p>
                      <p className="text-sm sm:text-xl font-bold text-primary">${expensesByGroup[group].toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column - Income & Bills */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            {/* Income Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Income Form */}
                <div className="flex flex-col gap-2 sm:gap-3 rounded-lg bg-muted/50 p-3 sm:p-4 sm:flex-row">
                  <div className="flex-1">
                    <Label htmlFor="income-source" className="sr-only">
                      Source
                    </Label>
                    <Input
                      id="income-source"
                      placeholder="Income source"
                      value={newIncome.source}
                      onChange={(e) =>
                        setNewIncome({ ...newIncome, source: e.target.value })
                      }
                      className="h-10 sm:h-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 sm:w-28 sm:flex-none">
                      <Label htmlFor="income-amount" className="sr-only">
                        Amount
                      </Label>
                      <Input
                        id="income-amount"
                        type="number"
                        placeholder="Amount"
                        value={newIncome.amount}
                        onChange={(e) =>
                          setNewIncome({ ...newIncome, amount: e.target.value })
                        }
                        className="h-10 sm:h-9"
                      />
                    </div>
                    <Button onClick={addIncome} className="shrink-0 h-10 sm:h-9 px-4">
                      <Plus className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Add</span>
                    </Button>
                  </div>
                </div>

                {/* Income List */}
                <div className="space-y-2">
                  {incomes.map((income) => (
                    <div
                      key={income.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-2.5 sm:p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground text-sm sm:text-base truncate">
                          {income.source}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className="font-semibold text-primary text-sm sm:text-base">
                          +${income.amount.toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-destructive"
                          onClick={() => removeIncome(income.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bill Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  Monthly Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" defaultValue={["fixed", "control", "personal"]} className="space-y-4">
                  {(["fixed", "control", "personal"] as BillGroup[]).map((group) => {
                    const info = BILL_GROUP_INFO[group];
                    const groupBills = getBillsByGroup(group);
                    
                    return (
                      <AccordionItem key={group} value={group} className={`rounded-lg border ${info.borderColor} px-4`}>
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${info.bgColor}`}>
                              <span className={info.color}>{info.icon}</span>
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-foreground">{info.title}</p>
                              <p className="text-xs text-muted-foreground">{info.subtitle}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-3">
                            {/* Add Bill Button */}
                            <Button
                              variant="outline"
                              className="w-full border-dashed"
                              onClick={() => openAddBillDialog(group)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add {info.title.replace(" Bills", "").replace(" Expenses", "")} Expense
                            </Button>

                            {/* Bills List */}
                            {groupBills.map((bill) => {
                              const category = getCategoryById(bill.categoryId);
                              return (
                                <div
                                  key={bill.id}
                                  className="rounded-lg border border-border bg-card p-3 sm:p-4 transition-colors hover:bg-muted/30"
                                >
                                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                                    <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                                      <div
                                        className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full"
                                        style={{ backgroundColor: `${category?.color}20` }}
                                      >
                                        <span style={{ color: category?.color }}>
                                          {category?.icon}
                                        </span>
                                      </div>
                                      <div className="space-y-0.5 sm:space-y-1 min-w-0">
                                        <p className="font-medium text-foreground text-sm sm:text-base truncate">
                                          {bill.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {category?.name}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                          {bill.dueDate && (
                                            <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0">
                                              <Calendar className="mr-0.5 sm:mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                              {formatDueDate(bill.dueDate)}
                                            </Badge>
                                          )}
                                          {bill.reminder && (
                                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 hidden sm:flex">
                                              <Bell className="mr-1 h-3 w-3" />
                                              {bill.reminderDays}d
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 sm:gap-2 shrink-0">
                                      <span className="font-semibold text-destructive text-sm sm:text-base">
                                        -${bill.amount.toLocaleString()}
                                      </span>
                                      <div className="flex items-center">
                                        {bill.dueDate && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-primary"
                                            onClick={() => window.open(generateCalendarLink(bill), "_blank")}
                                            title="Add to Calendar"
                                          >
                                            <Calendar className="h-4 w-4" />
                                            <span className="sr-only">Add to Calendar</span>
                                          </Button>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-destructive"
                                          onClick={() => removeBill(bill.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Remove</span>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {groupBills.length === 0 && (
                              <p className="text-center text-sm text-muted-foreground py-4">
                                No {info.title.toLowerCase()} added yet
                              </p>
                            )}

                            {/* Group Total */}
                            {groupBills.length > 0 && (
                              <div className={`flex items-center justify-between rounded-lg ${info.bgColor} p-3`}>
                                <span className="text-sm font-medium text-muted-foreground">
                                  {info.title} Total
                                </span>
                                <span className={`font-bold ${info.color}`}>
                                  ${expensesByGroup[group].toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>

            {/* Saving Up Section */}
            <Card className="border-pink-500/30">
              <CardHeader className="pb-2 sm:pb-4">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                    Saving Up For
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-pink-500/30 text-pink-500 hover:bg-pink-500/10 h-8 px-2 sm:px-3"
                    onClick={() => setAddSavingUpDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Item</span>
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Save for special personal expenses
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {savingUpItems.map((item) => {
                    const category = getSavingUpCategory(item.categoryId);
                    const progress = (item.currentAmount / item.targetAmount) * 100;
                    return (
                      <div
                        key={item.id}
                        className="rounded-lg border border-border bg-card p-3 sm:p-4"
                      >
                        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div
                              className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full"
                              style={{ backgroundColor: `${category?.color}20` }}
                            >
                              <span style={{ color: category?.color }}>
                                {category?.icon}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground text-sm sm:text-base truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{category?.name}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeSavingUp(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-muted-foreground">
                              ${item.currentAmount} / ${item.targetAmount}
                            </span>
                            <span className="font-medium text-pink-500">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex gap-1.5 sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs sm:text-sm"
                              onClick={() => updateSavingUpAmount(item.id, 10)}
                            >
                              +$10
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs sm:text-sm"
                              onClick={() => updateSavingUpAmount(item.id, 25)}
                            >
                              +$25
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs sm:text-sm"
                              onClick={() => updateSavingUpAmount(item.id, -10)}
                            >
                              -$10
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {savingUpItems.length === 0 && (
                    <p className="text-center text-xs sm:text-sm text-muted-foreground py-4">
                      No items yet. Add something special!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chart & Savings */}
          <div className="space-y-4 sm:space-y-6">
            {/* Expense Breakdown Chart */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {expensesByCategory.length > 0 ? (
                  <div className="h-56 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expensesByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {expensesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            `$${value.toLocaleString()}`,
                            "Amount",
                          ]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center text-muted-foreground">
                    Add expenses to see your breakdown
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Savings Goals */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg">Savings Goals</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddGoalDialogOpen(true)}
                    className="h-8 px-2 sm:px-3"
                  >
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Goal</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {savingsGoals.map((goal) => {
                  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                  return (
                    <div key={goal.id} className="rounded-lg border border-border p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl sm:text-2xl shrink-0">{goal.icon}</span>
                          <span className="font-medium text-foreground text-sm sm:text-base truncate">{goal.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove goal</span>
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">
                            ${goal.currentAmount} / ${goal.targetAmount}
                          </span>
                          <span className="font-medium text-primary">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex gap-1.5 sm:gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs sm:text-sm"
                            onClick={() => updateGoalAmount(goal.id, 25)}
                          >
                            +$25
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs sm:text-sm"
                            onClick={() => updateGoalAmount(goal.id, 50)}
                          >
                            +$50
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs sm:text-sm"
                            onClick={() => updateGoalAmount(goal.id, 100)}
                          >
                            +$100
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {savingsGoals.length === 0 && (
                  <p className="text-center text-xs sm:text-sm text-muted-foreground py-4">
                    No savings goals yet. Add one!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Budget Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    <span><strong className="text-foreground">Fixed Expenses First:</strong> Always pay these before anything else - they protect your credit and housing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <span><strong className="text-foreground">Control What You Can:</strong> Meal prep to reduce food costs, carpool to save on gas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                    <span><strong className="text-foreground">Review Personal Expenses:</strong> Cancel subscriptions you don&apos;t use regularly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span><strong className="text-foreground">Pay Yourself First:</strong> Save at least 10% of income before spending on wants.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span><strong className="text-foreground">Set Calendar Reminders:</strong> Never miss a bill payment - use the calendar button!</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Bill Dialog */}
      <Dialog open={addBillDialogOpen} onOpenChange={setAddBillDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              {selectedGroup && (
                <>
                  <span className={BILL_GROUP_INFO[selectedGroup].color}>
                    {BILL_GROUP_INFO[selectedGroup].icon}
                  </span>
                  Add {BILL_GROUP_INFO[selectedGroup].title.replace(" Bills", "").replace(" Expenses", "")} Expense
                </>
              )}
            </DialogTitle>
            {selectedGroup && (
              <DialogDescription className={`rounded-lg p-2 sm:p-3 text-xs sm:text-sm ${BILL_GROUP_INFO[selectedGroup].bgColor}`}>
                {BILL_GROUP_INFO[selectedGroup].description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 pt-2">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="bill-desc" className="text-sm">Description</Label>
              <Input
                id="bill-desc"
                placeholder="e.g., Monthly rent payment"
                value={newBill.description}
                onChange={(e) =>
                  setNewBill({ ...newBill, description: e.target.value })
                }
                className="h-10"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="bill-amount" className="text-sm">Amount ($)</Label>
              <Input
                id="bill-amount"
                type="number"
                placeholder="0.00"
                value={newBill.amount}
                onChange={(e) =>
                  setNewBill({ ...newBill, amount: e.target.value })
                }
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-category">Category</Label>
              <Select
                value={newBill.categoryId}
                onValueChange={(value) =>
                  setNewBill({ ...newBill, categoryId: value })
                }
              >
                <SelectTrigger id="bill-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {selectedGroup &&
                    getCategoriesByGroup(selectedGroup).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <span style={{ color: cat.color }}>{cat.icon}</span>
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-due">Due Date (optional)</Label>
              <Input
                id="bill-due"
                type="date"
                value={newBill.dueDate}
                onChange={(e) =>
                  setNewBill({ ...newBill, dueDate: e.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="bill-reminder">Set Reminder</Label>
                <p className="text-xs text-muted-foreground">
                  Get reminded before due date
                </p>
              </div>
              <Switch
                id="bill-reminder"
                checked={newBill.reminder}
                onCheckedChange={(checked) =>
                  setNewBill({ ...newBill, reminder: checked })
                }
              />
            </div>
            {newBill.reminder && (
              <div className="space-y-2">
                <Label htmlFor="reminder-days">Remind me (days before)</Label>
                <Select
                  value={newBill.reminderDays}
                  onValueChange={(value) =>
                    setNewBill({ ...newBill, reminderDays: value })
                  }
                >
                  <SelectTrigger id="reminder-days">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day before</SelectItem>
                    <SelectItem value="2">2 days before</SelectItem>
                    <SelectItem value="3">3 days before</SelectItem>
                    <SelectItem value="5">5 days before</SelectItem>
                    <SelectItem value="7">1 week before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button onClick={addBill} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Savings Goal Dialog */}
      <Dialog open={addGoalDialogOpen} onOpenChange={setAddGoalDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Add Savings Goal</DialogTitle>
            <DialogDescription>
              Create a new savings goal to track your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="goal-icon">Icon</Label>
              <Select
                value={newSavingsGoal.icon}
                onValueChange={(value) =>
                  setNewSavingsGoal({ ...newSavingsGoal, icon: value })
                }
              >
                <SelectTrigger id="goal-icon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SAVINGS_GOAL_ICONS.map((item) => (
                    <SelectItem key={item.id} value={item.icon}>
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        {item.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-name">Goal Name</Label>
              <Input
                id="goal-name"
                placeholder="e.g., New laptop for school"
                value={newSavingsGoal.name}
                onChange={(e) =>
                  setNewSavingsGoal({ ...newSavingsGoal, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-target">Target Amount ($)</Label>
              <Input
                id="goal-target"
                type="number"
                placeholder="1000"
                value={newSavingsGoal.targetAmount}
                onChange={(e) =>
                  setNewSavingsGoal({ ...newSavingsGoal, targetAmount: e.target.value })
                }
              />
            </div>
            <Button onClick={addSavingsGoal} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Saving Up Dialog */}
      <Dialog open={addSavingUpDialogOpen} onOpenChange={setAddSavingUpDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
              Save Up For Something
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Plan for personal expenses like beauty, phone upgrades, gifts, or events.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="savingup-category">Category</Label>
              <Select
                value={newSavingUp.categoryId}
                onValueChange={(value) =>
                  setNewSavingUp({ ...newSavingUp, categoryId: value })
                }
              >
                <SelectTrigger id="savingup-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {SAVING_UP_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <span style={{ color: cat.color }}>{cat.icon}</span>
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="savingup-name">What are you saving for?</Label>
              <Input
                id="savingup-name"
                placeholder="e.g., Hair appointment, Birthday gift"
                value={newSavingUp.name}
                onChange={(e) =>
                  setNewSavingUp({ ...newSavingUp, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="savingup-target">Target Amount ($)</Label>
              <Input
                id="savingup-target"
                type="number"
                placeholder="100"
                value={newSavingUp.targetAmount}
                onChange={(e) =>
                  setNewSavingUp({ ...newSavingUp, targetAmount: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="savingup-date">Target Date (optional)</Label>
              <Input
                id="savingup-date"
                type="date"
                value={newSavingUp.targetDate}
                onChange={(e) =>
                  setNewSavingUp({ ...newSavingUp, targetDate: e.target.value })
                }
              />
            </div>
            <Button onClick={addSavingUpItem} className="w-full bg-pink-500 hover:bg-pink-600">
              <Plus className="mr-2 h-4 w-4" />
              Start Saving
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Reminder Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              Time to Review Your Budget
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm pt-2">
              Expenses change over time. Review your budget so you don&apos;t miss payments or can remove paid-off expenses.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 pt-2">
            <div className="rounded-lg bg-amber-500/10 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300">
                <strong>Quick checklist:</strong>
              </p>
              <ul className="mt-2 space-y-1 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  Any new bills or subscriptions?
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  Did you pay off any credit cards or loans?
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  Any price changes on existing bills?
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  Any subscriptions you no longer use?
                </li>
              </ul>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <Button 
                onClick={handleReviewComplete}
                className="flex-1 h-10"
              >
                <Check className="mr-1.5 sm:mr-2 h-4 w-4" />
                <span className="text-sm">Reviewed</span>
              </Button>
              <Button 
                variant="outline"
                className="h-10 w-10 sm:w-auto sm:px-3"
                onClick={() => setReviewSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Timer Settings Dialog */}
      <Dialog open={reviewSettingsOpen} onOpenChange={setReviewSettingsOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Reminder Settings
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Choose how often to be reminded to check your budget.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 sm:space-y-3 pt-2">
            {[
              { days: 14, label: "Every 2 weeks" },
              { days: 30, label: "Every month" },
              { days: 60, label: "Every 2 months (Recommended)" },
              { days: 90, label: "Every 3 months" },
              { days: 180, label: "Every 6 months" },
              { days: 365, label: "Every year" },
            ].map((option) => (
              <button
                key={option.days}
                onClick={() => handleIntervalChange(option.days)}
                className={`w-full flex items-center justify-between rounded-lg border p-3 sm:p-4 transition-colors ${
                  reviewIntervalDays === option.days 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="font-medium text-sm sm:text-base">{option.label}</span>
                {reviewIntervalDays === option.days && (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
