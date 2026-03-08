"use client";

import { useState, useMemo } from "react";
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
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="h-8 w-48 text-lg font-bold"
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
                    className="h-8 w-8"
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
                <div className="group flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{appTitle}</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      setTempTitle(appTitle);
                      setIsEditingTitle(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="sr-only">Edit title</span>
                  </Button>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Smart budgeting for students
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <InstallPrompt />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Income
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ${totalIncome.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ${totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Balance
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      balance >= 0 ? "text-primary" : "text-destructive"
                    }`}
                  >
                    ${balance.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Savings Progress
                  </p>
                  <p className="text-sm font-medium text-primary">
                    ${totalSavingsProgress} / ${totalSavingsTarget}
                  </p>
                </div>
                <Progress value={totalSavingsTarget > 0 ? (totalSavingsProgress / totalSavingsTarget) * 100 : 0} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {savingsGoals.length} active goal{savingsGoals.length !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bill Group Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {(["fixed", "control", "personal"] as BillGroup[]).map((group) => {
            const info = BILL_GROUP_INFO[group];
            return (
              <Card key={group} className={`border ${info.borderColor}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${info.bgColor}`}>
                        <span className={info.color}>{info.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{info.title}</p>
                        <p className="text-xl font-bold text-foreground">${expensesByGroup[group].toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Income & Bills */}
          <div className="space-y-6 lg:col-span-2">
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
                <div className="flex flex-col gap-3 rounded-lg bg-muted/50 p-4 sm:flex-row">
                  <div className="flex-1">
                    <Label htmlFor="income-source" className="sr-only">
                      Source
                    </Label>
                    <Input
                      id="income-source"
                      placeholder="Income source (e.g., Part-time job)"
                      value={newIncome.source}
                      onChange={(e) =>
                        setNewIncome({ ...newIncome, source: e.target.value })
                      }
                    />
                  </div>
                  <div className="w-full sm:w-32">
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
                    />
                  </div>
                  <Button onClick={addIncome} className="shrink-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>

                {/* Income List */}
                <div className="space-y-2">
                  {incomes.map((income) => (
                    <div
                      key={income.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {income.source}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-primary">
                          +${income.amount.toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
                                  className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                      <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                                        style={{ backgroundColor: `${category?.color}20` }}
                                      >
                                        <span style={{ color: category?.color }}>
                                          {category?.icon}
                                        </span>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="font-medium text-foreground">
                                          {bill.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {category?.name}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2">
                                          {bill.dueDate && (
                                            <Badge variant="outline" className="text-xs">
                                              <Calendar className="mr-1 h-3 w-3" />
                                              Due: {formatDueDate(bill.dueDate)}
                                            </Badge>
                                          )}
                                          {bill.reminder && (
                                            <Badge variant="secondary" className="text-xs">
                                              <Bell className="mr-1 h-3 w-3" />
                                              Reminder: {bill.reminderDays}d before
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      <span className="font-semibold text-destructive">
                                        -${bill.amount.toLocaleString()}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        {bill.dueDate && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
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
                                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-pink-500" />
                    Saving Up For
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-pink-500/30 text-pink-500 hover:bg-pink-500/10"
                    onClick={() => setAddSavingUpDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Save up for special personal expenses - hair, phone upgrades, celebrations, gifts, and events
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savingUpItems.map((item) => {
                    const category = getSavingUpCategory(item.categoryId);
                    const progress = (item.currentAmount / item.targetAmount) * 100;
                    return (
                      <div
                        key={item.id}
                        className="rounded-lg border border-border bg-card p-4"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-full"
                              style={{ backgroundColor: `${category?.color}20` }}
                            >
                              <span style={{ color: category?.color }}>
                                {category?.icon}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{category?.name}</p>
                              {item.targetDate && (
                                <p className="text-xs text-muted-foreground">
                                  Target: {formatDueDate(item.targetDate)}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeSavingUp(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              ${item.currentAmount} / ${item.targetAmount}
                            </span>
                            <span className="font-medium text-pink-500">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => updateSavingUpAmount(item.id, 10)}
                            >
                              +$10
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => updateSavingUpAmount(item.id, 25)}
                            >
                              +$25
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
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
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No items to save up for yet. Add something special!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chart & Savings */}
          <div className="space-y-6">
            {/* Expense Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {expensesByCategory.length > 0 ? (
                  <div className="h-64">
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
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Savings Goals</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddGoalDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Goal
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {savingsGoals.map((goal) => {
                  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                  return (
                    <div key={goal.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{goal.icon}</span>
                          <span className="font-medium text-foreground">{goal.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove goal</span>
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            ${goal.currentAmount} / ${goal.targetAmount}
                          </span>
                          <span className="font-medium text-primary">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => updateGoalAmount(goal.id, 25)}
                          >
                            +$25
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => updateGoalAmount(goal.id, 50)}
                          >
                            +$50
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
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
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No savings goals yet. Add one to start saving!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
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
              <DialogDescription className={`rounded-lg p-3 ${BILL_GROUP_INFO[selectedGroup].bgColor}`}>
                {BILL_GROUP_INFO[selectedGroup].description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="bill-desc">Description</Label>
              <Input
                id="bill-desc"
                placeholder="e.g., Monthly rent payment"
                value={newBill.description}
                onChange={(e) =>
                  setNewBill({ ...newBill, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-amount">Amount ($)</Label>
              <Input
                id="bill-amount"
                type="number"
                placeholder="0.00"
                value={newBill.amount}
                onChange={(e) =>
                  setNewBill({ ...newBill, amount: e.target.value })
                }
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
        <DialogContent className="sm:max-w-md">
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              Save Up For Something Special
            </DialogTitle>
            <DialogDescription>
              Plan ahead for personal expenses like beauty treatments, phone upgrades, celebrations, gifts, or events.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
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
    </div>
  );
}
