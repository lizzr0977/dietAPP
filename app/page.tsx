use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DISHES } from '@/data/dishes';
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Droplets,
  Eye,
  Languages,
  Plus,
  RefreshCw,
  ShoppingCart,
  Trash2,
  Undo2,
  UserPlus,
  X,
} from 'lucide-react';

type Lang = 'es' | 'en';
type UnitMode = 'kg' | 'lb';
type Profile = any;
type Plan = any;
type Meal = any;

type MarketItem = {
  key: string;
  name: string;
  amount: number;
  unit: string;
  display: string;
  found: boolean;
  missing: boolean;
  replacement: string;
  suggestions: string[];
  usedSummary: string[];
};

const DAYS_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const UI = {
  es: {
    loading: 'Cargando DietApp...',
    by: 'by: Roberto Figueroa',
    home: 'Hoy',
    week: 'Semana',
    market: 'Super',
    settings: 'Config.',
    history: 'Historial',
    todayMeals: 'Tu comida de hoy',
    viewWeek: 'Ver semana',
    generateWeek: 'Generar semana',
    generateNormal: 'Generar lunes a domingo',
    generateFromDate: 'Generar desde fecha',
    startDate: 'Fecha de inicio',
    duration: 'Duración',
    days: 'días',
    planExistsTitle: 'Ya tienes un plan generado',
    planExistsBody: 'Puedes cambiar plato por plato si algo no te gusta. ¿Quieres reemplazar todo el plan?',
    noPlan: 'Aún no hay plan',
    noPlanDesc: 'Genera una semana para ver comidas, recetas y mandado.',
    todayDone: 'Comidas ya realizadas',
    markEaten: 'Ya comí',
    eaten: 'Comido',
    undo: 'Deshacer',
    recipe: 'Ver receta',
    changeDish: 'Cambiar plato',
    confirmDishChange: '¿Seguro que quieres cambiar este plato?',
    workDay: 'Día de trabajo',
    offDay: 'Descanso',
    workMeal: 'Comida de trabajo',
    profile: 'Perfil',
    diet: 'Dieta',
    portable: 'Para llevar',
    waterToday: 'Hidratación de hoy',
    waterGoal: 'Meta',
    addWater: 'Agregar agua',
    undoWater: 'Deshacer agua',
    weeklyPlan: 'Plan semanal',
    weekRange: 'Semana',
    allProfiles: 'Todos',
    selectedProfiles: 'Perfiles seleccionados',
    shoppingDesc: 'Selecciona perfiles y DietApp suma ingredientes de la semana.',
    updateShopping: 'Actualizar mandado',
    sendWhats: 'Enviar WhatsApp',
    addManual: 'Agregar manual',
    list: 'Lista',
    markReady: 'Marcar listo',
    ready: 'Listo',
    notFound: 'No encontrado',
    replace: 'Reemplazar',
    chosenReplacement: 'Reemplazo elegido',
    replacementNote: 'Esto actualiza tu mandado. Si quieres cambiar la receta, usa Cambiar plato en el plan.',
    relatedRecipes: 'Ver recetas relacionadas',
    foundItems: 'Productos listos',
    showFound: 'Mostrar listos',
    hideFound: 'Ocultar listos',
    shoppingEmpty: 'Selecciona uno o más perfiles y toca “Actualizar mandado”.',
    analyze: 'Analizar producto',
    analyzeDesc: 'Toma foto del frente, Nutrition Facts e ingredientes.',
    analyzeBtn: 'Analizar producto',
    configuration: 'Configuración',
    configDesc: 'Administra perfiles, rutinas, recordatorios, hidratación y preferencias.',
    profiles: 'Perfiles',
    profilesDesc: 'Los detalles quedan ocultos hasta que quieras editarlos.',
    addProfile: 'Agregar perfil',
    edit: 'Editar',
    close: 'Cerrar',
    save: 'Guardar',
    delete: 'Eliminar',
    name: 'Nombre',
    currentWeight: 'Peso actual',
    goalWeight: 'Peso meta',
    goalType: 'Meta',
    lose: 'Bajar',
    maintain: 'Mantener',
    gain: 'Subir',
    goalDate: 'Quiero lograrlo para',
    height: 'Estatura',
    age: 'Edad',
    sex: 'Sexo',
    male: 'Hombre',
    female: 'Mujer',
    other: 'Otro',
    activity: 'Actividad',
    activityLow: 'Baja',
    activityNormal: 'Normal',
    activityHigh: 'Alta',
    routine: 'Rutina',
    worksNow: '¿Actualmente trabaja?',
    wakeWork: 'Despierto trabajo',
    startWork: 'Entrada',
    breakWork: 'Break',
    endWork: 'Salida',
    wakeOff: 'Despierto descanso',
    sleepOff: 'Dormir descanso',
    workDays: 'Días de trabajo',
    mealsWork: 'Comidas en día de trabajo',
    mealsOff: 'Comidas en día libre',
    dietInfo: 'Ver en qué consiste esta dieta',
    restrictions: 'Preferencias y restricciones',
    omitFoods: 'Omitir alimentos',
    preferFoods: 'Preferir alimentos',
    addFood: 'Agregar',
    hydrationReminder: 'Recordatorios e hidratación',
    waterEnabled: 'Recordatorios de agua',
    mealEnabled: 'Recordatorios de comida',
    mealBefore: 'Avisar antes de comida',
    waterEvery: 'Agua cada',
    hydrationGoal: 'Meta diaria de agua',
    workPrep: 'Recordar preparar comida para trabajo',
    groceryReminder: 'Recordar hacer mandado',
    weightReminder: 'Recordar registrar peso',
    minutes: 'min',
    hours: 'horas',
    historyTitle: 'Historial',
    historyDesc: 'Calorías, agua, IMC y avance hacia tu meta.',
    logException: 'Registrar excepción',
    addReminder: 'Agregar recordatorio',
    newReminder: 'Nuevo recordatorio',
    newException: 'Registrar excepción',
    title: 'Título',
    date: 'Fecha',
    time: 'Hora',
    note: 'Nota',
    caloriesOptional: 'Calorías aproximadas',
    cancel: 'Cancelar',
    caloriesToday: 'Calorías de hoy',
    proteinToday: 'Proteína de hoy',
    bmi: 'IMC',
    bmr: 'BMR',
    tdee: 'TDEE',
    target: 'Objetivo',
    bmrExplain: 'BMR: calorías que tu cuerpo usa en reposo.',
    tdeeExplain: 'TDEE: gasto aproximado diario incluyendo actividad.',
    targetExplain: 'Objetivo: calorías sugeridas para acercarte a tu meta. Es una referencia, no diagnóstico médico.',
    chart: 'Gráfica simple',
    daily: 'Día',
    weekly: 'Semana',
    monthly: 'Mes',
    footer: 'dietAPP by: Roberto Figueroa',
    welcome: 'Bienvenido a DietApp',
    welcomeDesc: 'Crea un perfil, define tu meta, genera tu plan y usa el mandado.',
    createFirstProfile: 'Crear primer perfil',
    saved: 'Guardado ✅',
    created: 'Creado ✅',
    deleted: 'Eliminado ✅',
    updated: 'Actualizado ✅',
    generated: 'Plan generado ✅',
    mealLogged: 'Comida marcada ✅',
    waterLogged: 'Agua agregada ✅',
    reminderSaved: 'Recordatorio guardado ✅',
    exceptionSaved: 'Excepción registrada ✅',
    productAdded: 'Producto agregado ✅',
    noCompatible: 'No hay platillos compatibles con este perfil.',
    noItems: 'Sin datos todavía.',
    closeRecipe: 'Cerrar',
    ingredients: 'Ingredientes',
    utensils: 'Utensilios',
    stepByStep: 'Paso a paso',
    tips: 'Tips para ahorrar tiempo',
    recipeImageNote: 'Imagen referencial del platillo',
  },
  en: {
    loading: 'Loading DietApp...',
    by: 'by: Roberto Figueroa',
    home: 'Today',
    week: 'Week',
    market: 'Groceries',
    settings: 'Settings',
    history: 'History',
    todayMeals: 'Your food today',
    viewWeek: 'View week',
    generateWeek: 'Generate week',
    generateNormal: 'Generate Monday to Sunday',
    generateFromDate: 'Generate from date',
    startDate: 'Start date',
    duration: 'Duration',
    days: 'days',
    planExistsTitle: 'You already have a plan',
    planExistsBody: 'You can change meals one by one if you dislike something. Replace the whole plan?',
    noPlan: 'No plan yet',
    noPlanDesc: 'Generate a week to see meals, recipes and groceries.',
    todayDone: 'Meals already eaten',
    markEaten: 'I ate this',
    eaten: 'Eaten',
    undo: 'Undo',
    recipe: 'View recipe',
    changeDish: 'Change meal',
    confirmDishChange: 'Are you sure you want to change this meal?',
    workDay: 'Work day',
    offDay: 'Off day',
    workMeal: 'Work meal',
    profile: 'Profile',
    diet: 'Diet',
    portable: 'Portable',
    waterToday: 'Hydration today',
    waterGoal: 'Goal',
    addWater: 'Add water',
    undoWater: 'Undo water',
    weeklyPlan: 'Weekly plan',
    weekRange: 'Week',
    allProfiles: 'All',
    selectedProfiles: 'Selected profiles',
    shoppingDesc: 'Select profiles and DietApp adds all ingredients for the week.',
    updateShopping: 'Update groceries',
    sendWhats: 'Send WhatsApp',
    addManual: 'Add manual',
    list: 'List',
    markReady: 'Mark ready',
    ready: 'Ready',
    notFound: 'Not found',
    replace: 'Replace',
    chosenReplacement: 'Chosen replacement',
    replacementNote: 'This updates your grocery list. To change the recipe, use Change meal in the plan.',
    relatedRecipes: 'See related recipes',
    foundItems: 'Ready items',
    showFound: 'Show ready',
    hideFound: 'Hide ready',
    shoppingEmpty: 'Select one or more profiles and tap “Update groceries”.',
    analyze: 'Analyze product',
    analyzeDesc: 'Take photos of front, Nutrition Facts and ingredients.',
    analyzeBtn: 'Analyze product',
    configuration: 'Settings',
    configDesc: 'Manage profiles, routines, reminders, hydration and preferences.',
    profiles: 'Profiles',
    profilesDesc: 'Details stay hidden until you want to edit them.',
    addProfile: 'Add profile',
    edit: 'Edit',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    name: 'Name',
    currentWeight: 'Current weight',
    goalWeight: 'Goal weight',
    goalType: 'Goal',
    lose: 'Lose',
    maintain: 'Maintain',
    gain: 'Gain',
    goalDate: 'Goal date',
    height: 'Height',
    age: 'Age',
    sex: 'Sex',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    activity: 'Activity',
    activityLow: 'Low',
    activityNormal: 'Normal',
    activityHigh: 'High',
    routine: 'Routine',
    worksNow: 'Currently working?',
    wakeWork: 'Wake up work day',
    startWork: 'Start work',
    breakWork: 'Break',
    endWork: 'End work',
    wakeOff: 'Wake up day off',
    sleepOff: 'Sleep day off',
    workDays: 'Work days',
    mealsWork: 'Meals on work day',
    mealsOff: 'Meals on day off',
    dietInfo: 'See what this diet means',
    restrictions: 'Preferences and restrictions',
    omitFoods: 'Avoid foods',
    preferFoods: 'Prefer foods',
    addFood: 'Add',
    hydrationReminder: 'Reminders and hydration',
    waterEnabled: 'Water reminders',
    mealEnabled: 'Meal reminders',
    mealBefore: 'Remind before meal',
    waterEvery: 'Water every',
    hydrationGoal: 'Daily water goal',
    workPrep: 'Remind to prep work meals',
    groceryReminder: 'Remind groceries',
    weightReminder: 'Remind weigh-in',
    minutes: 'min',
    hours: 'hours',
    historyTitle: 'History',
    historyDesc: 'Calories, water, BMI and progress toward your goal.',
    logException: 'Log exception',
    addReminder: 'Add reminder',
    newReminder: 'New reminder',
    newException: 'Log exception',
    title: 'Title',
    date: 'Date',
    time: 'Time',
    note: 'Note',
    caloriesOptional: 'Approx calories',
    cancel: 'Cancel',
    caloriesToday: 'Calories today',
    proteinToday: 'Protein today',
    bmi: 'BMI',
    bmr: 'BMR',
    tdee: 'TDEE',
    target: 'Target',
    bmrExplain: 'BMR: calories your body uses at rest.',
    tdeeExplain: 'TDEE: estimated daily burn including activity.',
    targetExplain: 'Target: suggested calories to move toward your goal. It is a reference, not medical advice.',
    chart: 'Simple chart',
    daily: 'Day',
    weekly: 'Week',
    monthly: 'Month',
    footer: 'dietAPP by: Roberto Figueroa',
    welcome: 'Welcome to DietApp',
    welcomeDesc: 'Create a profile, define your goal, generate your plan and use groceries.',
    createFirstProfile: 'Create first profile',
    saved: 'Saved ✅',
    created: 'Created ✅',
    deleted: 'Deleted ✅',
    updated: 'Updated ✅',
    generated: 'Plan generated ✅',
    mealLogged: 'Meal logged ✅',
    waterLogged: 'Water added ✅',
    reminderSaved: 'Reminder saved ✅',
    exceptionSaved: 'Exception saved ✅',
    productAdded: 'Product added ✅',
    noCompatible: 'No compatible meals for this profile.',
    noItems: 'No data yet.',
    closeRecipe: 'Close',
    ingredients: 'Ingredients',
    utensils: 'Utensils',
    stepByStep: 'Step by step',
    tips: 'Time-saving tips',
    recipeImageNote: 'Reference meal image',
  },
};

const defaultRoutine = {
  worksNow: true,
  workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves'],
  wakeWork: '15:00',
  startWork: '18:00',
  breakWork: '22:00',
  endWork: '04:30',
  wakeOff: '09:00',
  sleepOff: '23:00',
  mealsWork: 3,
  mealsOff: 3,
  reminders: {
    enabledMeal: true,
    mealReminderMinutes: 15,
    enabledWater: true,
    waterEveryHours: 2,
    prepWorkMeal: true,
    groceryReminder: false,
    weightReminder: false,
    dailyWaterMl: 3000,
  },
  avoidedFoods: [],
  preferredFoods: [],
  goalType: 'lose',
  goalDate: '',
  activityLevel: 'normal',
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function datePlus(dateISO: string, days: number) {
  const d = new Date(`${dateISO}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function mondayISO(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
  return date.toISOString().slice(0, 10);
}

function formatLong(dateISO: string, lang: Lang) {
  const d = new Date(`${dateISO}T12:00:00`);
  const locale = lang === 'es' ? 'es-US' : 'en-US';
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(d);
  const rest = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${rest}`;
}

function formatShortRange(startISO: string, days: number, lang: Lang) {
  const endISO = datePlus(startISO, days - 1);
  const locale = lang === 'es' ? 'es-US' : 'en-US';
  const a = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long' }).format(new Date(`${startISO}T12:00:00`));
  const b = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${endISO}T12:00:00`));
  return `${a} — ${b}`;
}

function formatTime12(time: string) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h || 0, m || 0, 0, 0);
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
}

function dayNameFromDate(dateISO: string, lang: Lang) {
  const idx = (new Date(`${dateISO}T12:00:00`).getDay() + 6) % 7;
  return lang === 'es' ? DAYS_ES[idx] : DAYS_EN[idx];
}

function normalizeDay(day: string) {
  const x = String(day || '').toLowerCase();
  const map: Record<string, string> = {
    lunes: 'Lunes', monday: 'Lunes',
    martes: 'Martes', tuesday: 'Martes',
    miércoles: 'Miércoles', miercoles: 'Miércoles', wednesday: 'Miércoles',
    jueves: 'Jueves', thursday: 'Jueves',
    viernes: 'Viernes', friday: 'Viernes',
    sábado: 'Sábado', sabado: 'Sábado', saturday: 'Sábado',
    domingo: 'Domingo', sunday: 'Domingo',
  };
  return map[x] || day;
}

function kgToLb(kg: number) {
  return kg * 2.2046226218;
}

function lbToKg(lb: number) {
  return lb / 2.2046226218;
}

function clean(n: number) {
  if (Number.isNaN(n)) return '0';
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, '');
}

function unitLabel(mode: UnitMode) {
  return mode === 'kg' ? 'kg' : 'lb';
}

function formatWeight(kg: number, mode: UnitMode) {
  return mode === 'kg' ? `${clean(kg)} kg` : `${clean(kgToLb(kg))} lb`;
}

function formatSolid(amountG: number, mode: UnitMode) {
  if (mode === 'kg') {
    if (amountG >= 1000) return `${clean(amountG / 1000)} kg`;
    return `${clean(amountG)} g`;
  }
  const lb = amountG / 453.592;
  if (lb >= 0.25) return `${clean(lb)} lb`;
  return `${clean(amountG / 28.3495)} oz`;
}

function formatIngredientAmount(amount: number, unit: string, mode: UnitMode, lang: Lang) {
  if (unit === 'g') return formatSolid(amount, mode);
  if (unit === 'cucharadita') return mode === 'kg' ? `${clean(amount)} cdta` : `${clean(amount)} tsp`;
  if (unit === 'cucharada') return mode === 'kg' ? `${clean(amount)} cda` : `${clean(amount)} tbsp`;
  if (unit === 'taza') return mode === 'kg' ? `${clean(amount)} taza${amount === 1 ? '' : 's'}` : `${clean(amount)} cup${amount === 1 ? '' : 's'}`;
  if (unit === 'pieza' || unit === 'piezas') return `${clean(amount)} ${amount === 1 ? (lang === 'es' ? 'pieza' : 'piece') : (lang === 'es' ? 'piezas' : 'pieces')}`;
  if (unit === 'lata') return `${clean(amount)} ${amount === 1 ? (lang === 'es' ? 'lata' : 'can') : (lang === 'es' ? 'latas' : 'cans')}`;
  if (unit === 'porción') return `${clean(amount)} ${lang === 'es' ? 'porción' : 'serving'}`;
  if (unit === 'al gusto') return lang === 'es' ? 'al gusto' : 'to taste';
  return `${clean(amount)} ${unit}`;
}

function dishName(d: any, lang: Lang) {
  return lang === 'es' ? d?.name_es || d?.name_en : d?.name_en || d?.name_es;
}

function dietLabel(diet: string, lang: Lang) {
  const es: Record<string, string> = {
    carnivore_strict: 'Carnívora estricta',
    carnivore_flexible: 'Carnívora flexible',
    animal_based: 'Animal-based',
    keto_carnivore: 'Keto carnívora',
    lacto_ovo_vegetarian: 'Lacto-ovo vegetariana',
    lacto_vegetarian: 'Lacto vegetariana',
    ovo_vegetarian: 'Ovo vegetariana',
    vegan: 'Vegana',
  };
  const en: Record<string, string> = {
    carnivore_strict: 'Strict carnivore',
    carnivore_flexible: 'Flexible carnivore',
    animal_based: 'Animal-based',
    keto_carnivore: 'Keto carnivore',
    lacto_ovo_vegetarian: 'Lacto-ovo vegetarian',
    lacto_vegetarian: 'Lacto vegetarian',
    ovo_vegetarian: 'Ovo vegetarian',
    vegan: 'Vegan',
  };
  return (lang === 'es' ? es : en)[diet] || diet;
}

function dietInfo(diet: string, lang: Lang) {
  const info: Record<string, any> = {
    carnivore_strict: ['Se enfoca casi por completo en carne, huevos, pescado y grasas animales.', 'Focuses mostly on meat, eggs, fish and animal fats.'],
    carnivore_flexible: ['Base carnívora con un poco más de flexibilidad según tolerancia.', 'Carnivore-based with a little more flexibility.'],
    animal_based: ['Prioriza alimentos animales y puede permitir frutas/miel simples.', 'Prioritizes animal foods and may allow simple fruit/honey.'],
    keto_carnivore: ['Muy baja en carbohidratos, con enfoque carnívoro o casi carnívoro.', 'Very low carb with carnivore or near-carnivore focus.'],
    lacto_ovo_vegetarian: ['Sin carne ni pescado. Permite lácteos y huevos.', 'No meat or fish. Allows dairy and eggs.'],
    lacto_vegetarian: ['Sin carne, pescado ni huevo. Permite lácteos.', 'No meat, fish or eggs. Allows dairy.'],
    ovo_vegetarian: ['Sin carne, pescado ni lácteos. Permite huevos.', 'No meat, fish or dairy. Allows eggs.'],
    vegan: ['Sin alimentos de origen animal.', 'No animal foods.'],
  };
  return info[diet]?.[lang === 'es' ? 0 : 1] || '';
}

function bmi(profile: Profile) {
  const kg = Number(profile?.current_weight_kg || 0);
  const m = Number(profile?.height_cm || 0) / 100;
  if (!kg || !m) return 0;
  return kg / (m * m);
}

function bmr(profile: Profile) {
  const kg = Number(profile?.current_weight_kg || 0);
  const cm = Number(profile?.height_cm || 0);
  const age = Number(profile?.age || 30);
  const sex = profile?.sex || 'other';
  if (!kg || !cm) return 0;
  const base = 10 * kg + 6.25 * cm - 5 * age;
  if (sex === 'female') return base - 161;
  return base + 5;
}

function activityFactor(level: string) {
  if (level === 'low') return 1.35;
  if (level === 'high') return 1.75;
  return 1.55;
}

function targetCalories(profile: Profile) {
  const routine = profile?.routine || {};
  const tdee = bmr(profile) * activityFactor(routine.activityLevel || 'normal');
  const goalType = routine.goalType || 'lose';
  if (goalType === 'gain') return Math.round(tdee + 300);
  if (goalType === 'maintain') return Math.round(tdee);
  return Math.max(1200, Math.round(tdee - 500));
}

function isSameDay(a: string, b: string) {
  return String(a).slice(0, 10) === String(b).slice(0, 10);
}

function shiftDateByIndex(startISO: string, index: number) {
  return datePlus(startISO, index);
}

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [lang, setLang] = useState<Lang>('es');
  const [unitMode, setUnitMode] = useState<UnitMode>('kg');
  const [tab, setTab] = useState('today');
  const [todayMode, setTodayMode] = useState<'today' | 'week'>('today');
  const [householdId, setHouseholdId] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planStart, setPlanStart] = useState(mondayISO());
  const [planDays, setPlanDays] = useState(7);
  const [mealLogs, setMealLogs] = useState<any[]>([]);
  const [waterLogs, setWaterLogs] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [marketProfiles, setMarketProfiles] = useState<string[]>([]);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [toast, setToast] = useState('');
  const [lastSwap, setLastSwap] = useState<any>(null);
  const [lastWaterId, setLastWaterId] = useState('');
  const [editingProfiles, setEditingProfiles] = useState<Record<string, boolean>>({});
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [modalForm, setModalForm] = useState<any>({});
  const [productPhotos, setProductPhotos] = useState<string[]>([]);
  const [productResult, setProductResult] = useState('');

  const L = UI[lang];

  useEffect(() => {
    const savedLang = (localStorage.getItem('dietapp_lang') as Lang) || 'es';
    const savedUnit = (localStorage.getItem('dietapp_unit') as UnitMode) || 'kg';
    setLang(savedLang);
    setUnitMode(savedUnit);

    const splashTimer = setTimeout(() => setShowSplash(false), 1900);

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) location.href = '/login';
      else setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) location.href = '/login';
      else setSession(nextSession);
    });

    return () => {
      clearTimeout(splashTimer);
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) boot();
  }, [session, planStart]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const activePlan = plans.find((p) => p.profile_id === activeProfileId && p.week_start === planStart);

  const todayMealLogs = mealLogs.filter((m) => isSameDay(m.meal_date, todayISO()) && (!activeProfileId || m.profile_id === activeProfileId));
  const todayWaterMl = waterLogs
    .filter((w) => isSameDay(w.log_date, todayISO()) && (!activeProfileId || w.profile_id === activeProfileId))
    .reduce((sum, w) => sum + Number(w.amount_ml || 0), 0);

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 2600);
  }

  async function boot() {
    const { data: member, error } = await supabase
      .from('household_members')
      .select('household_id')
      .eq('user_id', session.user.id)
      .limit(1)
      .single();

    if (error || !member?.household_id) {
      notify('No pude cargar tu hogar. Revisa Supabase.');
      return;
    }

    setHouseholdId(member.household_id);
    await loadAll(member.household_id);
  }

  async function loadAll(hid = householdId) {
    if (!hid) return;

    const [profilesRes, plansRes, mealsRes, waterRes, remindersRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('household_id', hid).order('created_at'),
      supabase.from('weekly_plans').select('*').eq('household_id', hid).eq('week_start', planStart),
      supabase.from('meal_logs').select('*').eq('household_id', hid).gte('meal_date', datePlus(todayISO(), -35)),
      supabase.from('water_logs').select('*').eq('household_id', hid).gte('log_date', datePlus(todayISO(), -35)),
      supabase.from('reminders').select('*').eq('household_id', hid).eq('done', false).order('remind_at'),
    ]);

    setProfiles(profilesRes.data || []);
    setPlans(plansRes.data || []);
    setMealLogs(mealsRes.data || []);
    setWaterLogs(waterRes.data || []);
    setReminders(remindersRes.data || []);

    if ((profilesRes.data || []).length && !activeProfileId) {
      setActiveProfileId((profilesRes.data || [])[0].id);
    }
  }

  function dishById(id: string) {
    return (DISHES as any).find((d: any) => d.id === id);
  }

  function compatibleDishes(profile: Profile) {
    const diet = profile?.diet_type || 'carnivore_flexible';
    const avoided = profile?.routine?.avoidedFoods || [];
    const preferred = profile?.routine?.preferredFoods || [];

    let list = (DISHES as any).filter((d: any) => {
      const tags = d.diet_tags || [];
      let ok = false;

      if (diet === 'vegan') ok = tags.includes('vegan');
      else if (diet.includes('carnivore') || diet === 'animal_based') {
        ok = diet === 'carnivore_strict'
          ? tags.includes('carnivore_strict')
          : tags.some((x: string) => x.includes('carnivore') || x === 'animal_based' || x === 'keto_carnivore');
      } else {
        ok = tags.some((x: string) => ['lacto_ovo_vegetarian', 'lacto_vegetarian', 'ovo_vegetarian', 'vegan'].includes(x));
      }

      if (!ok) return false;

      const text = [...(d.ingredients_es || []), ...(d.ingredients_en || []), d.name_es || '', d.name_en || ''].join(' ').toLowerCase();
      return !avoided.some((a: string) => text.includes(String(a).toLowerCase()));
    });

    if (preferred.length) {
      list = list.sort((a: any, b: any) => {
        const at = [...(a.ingredients_es || []), ...(a.ingredients_en || []), a.name_es || '', a.name_en || ''].join(' ').toLowerCase();
        const bt = [...(b.ingredients_es || []), ...(b.ingredients_en || []), b.name_es || '', b.name_en || ''].join(' ').toLowerCase();
        const as = preferred.filter((p: string) => at.includes(String(p).toLowerCase())).length;
        const bs = preferred.filter((p: string) => bt.includes(String(p).toLowerCase())).length;
        return bs - as;
      });
    }

    return list;
  }

  async function addProfile() {
    const tempName = profiles.length ? `Perfil ${profiles.length + 1}` : 'ROB';
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        household_id: householdId,
        name: tempName,
        sex: 'other',
        age: 30,
        height_cm: 170,
        current_weight_kg: 90,
        goal_weight_kg: 80,
        pace_lb_per_week: 1,
        diet_type: profiles.length === 0 ? 'carnivore_flexible' : 'lacto_ovo_vegetarian',
        unit_prefs: { bodyWeight: unitMode, solid: unitMode },
        routine: defaultRoutine,
      })
      .select()
      .single();

    if (error) return notify(`No se pudo crear: ${error.message}`);

    setActiveProfileId(data.id);
    setEditingProfiles((prev) => ({ ...prev, [data.id]: true }));
    await loadAll();
    notify(L.created);
  }

  async function saveProfile(profile: Profile) {
    const { error } = await supabase.from('profiles').update(profile).eq('id', profile.id);
    if (error) return notify(`No se pudo guardar: ${error.message}`);
    setEditingProfiles((prev) => ({ ...prev, [profile.id]: false }));
    await loadAll();
    notify(L.saved);
  }

  async function deleteProfile(id: string) {
    if (!confirm(lang === 'es' ? '¿Eliminar perfil?' : 'Delete profile?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) return notify(`No se pudo eliminar: ${error.message}`);
    await loadAll();
    notify(L.deleted);
  }

  async function toggleLanguage() {
    const next = lang === 'es' ? 'en' : 'es';
    setLang(next);
    localStorage.setItem('dietapp_lang', next);
  }

  async function toggleUnitMode() {
    const next = unitMode === 'kg' ? 'lb' : 'kg';
    setUnitMode(next);
    localStorage.setItem('dietapp_unit', next);
    await Promise.all(
      profiles.map((p) =>
        supabase
          .from('profiles')
          .update({ unit_prefs: { ...(p.unit_prefs || {}), bodyWeight: next, solid: next } })
          .eq('id', p.id)
      )
    );
    await loadAll();
    buildMarket(marketProfiles, true, next);
  }

  async function generatePlan(profile: Profile, startISO = planStart, duration = planDays) {
    const existing = plans.find((p) => p.profile_id === profile.id && p.week_start === startISO);
    if (existing) {
      const ok = confirm(`${L.planExistsTitle}\n\n${L.planExistsBody}`);
      if (!ok) return;
    }

    const choices = compatibleDishes(profile);
    if (!choices.length) return notify(L.noCompatible);

    const routine = { ...defaultRoutine, ...(profile.routine || {}) };
    const workDays = (routine.workDays || []).map(normalizeDay);
    const meals: Meal[] = [];
    const recentByDay = new Map<string, Set<string>>();
    let rolling = 0;

    for (let i = 0; i < duration; i++) {
      const dateISO = shiftDateByIndex(startISO, i);
      const dayEs = normalizeDay(DAYS_ES[(new Date(`${dateISO}T12:00:00`).getDay() + 6) % 7]);
      const works = !!routine.worksNow && workDays.includes(dayEs);
      const count = Math.max(1, works ? Number(routine.mealsWork || 3) : Number(routine.mealsOff || 3));
      const times = works
        ? [routine.wakeWork || '15:00', routine.startWork || '18:00', routine.breakWork || '22:00', routine.endWork || '04:30', '01:00']
        : [routine.wakeOff || '09:00', '13:00', '18:00', routine.sleepOff || '23:00', '21:00'];

      recentByDay.set(dateISO, new Set());

      for (let j = 0; j < count; j++) {
        let selected = choices[(rolling + j) % choices.length];

        for (let tries = 0; tries < choices.length; tries++) {
          const candidate = choices[(rolling + j + tries) % choices.length];
          if (!recentByDay.get(dateISO)!.has(candidate.id)) {
            selected = candidate;
            break;
          }
        }

        recentByDay.get(dateISO)!.add(selected.id);

        meals.push({
          id: crypto.randomUUID(),
          day: dayEs,
          date: dateISO,
          time: times[j] || times[0],
          slot: `${L.meal || 'Comida'} ${j + 1}`,
          workMeal: works,
          dishId: selected.id,
        });

        rolling += 1;
      }
    }

    const payload = {
      household_id: householdId,
      profile_id: profile.id,
      week_start: startISO,
      data: { meals, duration },
    };

    const result = existing
      ? await supabase.from('weekly_plans').update(payload).eq('id', existing.id)
      : await supabase.from('weekly_plans').insert(payload);

    if (result.error) return notify(`No se pudo generar: ${result.error.message}`);

    setPlanStart(startISO);
    await loadAll();
    notify(L.generated);
  }

  async function markMealEaten(meal: Meal, profile: Profile, plan: Plan) {
    const d = dishById(meal.dishId);
    if (!d) return;

    const { error } = await supabase.from('meal_logs').upsert({
      household_id: householdId,
      profile_id: profile.id,
      weekly_plan_id: plan.id,
      meal_id: meal.id,
      dish_id: d.id,
      dish_name: dishName(d, lang),
      meal_date: meal.date || todayISO(),
      calories: Number(d.calories || 0),
      protein_g: Number(d.protein_g || 0),
      carbs_g: Number(d.carbs_g || 0),
      fat_g: Number(d.fat_g || 0),
      helped_goal_note: Number(d.calories || 0) <= Math.round(targetCalories(profile) / 3) ? 'Dentro de meta' : 'Revisar porción',
    });

    if (error) return notify(`No se pudo marcar: ${error.message}`);
    await loadAll();
    notify(L.mealLogged);
  }

  async function undoMealLog(log: any) {
    const { error } = await supabase.from('meal_logs').delete().eq('id', log.id);
    if (error) return notify(`No se pudo deshacer: ${error.message}`);
    await loadAll();
    notify(L.updated);
  }

  async function addWater(amountMl: number) {
    if (!activeProfile) return;
    const { data, error } = await supabase
      .from('water_logs')
      .insert({ household_id: householdId, profile_id: activeProfile.id, amount_ml: amountMl, log_date: todayISO() })
      .select()
      .single();

    if (error) return notify(`No se pudo guardar agua: ${error.message}`);
    setLastWaterId(data.id);
    await loadAll();
    notify(L.waterLogged);
  }

  async function undoWater() {
    if (!lastWaterId) return;
    const { error } = await supabase.from('water_logs').delete().eq('id', lastWaterId);
    if (error) return notify(`No se pudo deshacer: ${error.message}`);
    setLastWaterId('');
    await loadAll();
    notify(L.updated);
  }

  async function changeDish(meal: Meal, profile: Profile) {
    if (!confirm(L.confirmDishChange)) return;

    const currentPlan = plans.find((p) => p.profile_id === profile.id && p.week_start === planStart);
    if (!currentPlan) return;

    const options = compatibleDishes(profile).filter((d: any) => d.id !== meal.dishId);
    if (!options.length) return;

    const newDish = options[Math.floor(Math.random() * options.length)];
    const oldDishId = meal.dishId;

    currentPlan.data.meals = currentPlan.data.meals.map((m: Meal) =>
      m.id === meal.id ? { ...m, dishId: newDish.id } : m
    );

    const { error } = await supabase.from('weekly_plans').update({ data: currentPlan.data }).eq('id', currentPlan.id);
    if (error) return notify(`No se pudo cambiar: ${error.message}`);

    setLastSwap({ planId: currentPlan.id, mealId: meal.id, oldDishId });
    await loadAll();
    notify(`${L.updated} · ${L.undo}`);
  }

  async function undoDishChange() {
    if (!lastSwap) return;
    const plan = plans.find((p) => p.id === lastSwap.planId);
    if (!plan) return;

    plan.data.meals = plan.data.meals.map((m: Meal) =>
      m.id === lastSwap.mealId ? { ...m, dishId: lastSwap.oldDishId } : m
    );

    const { error } = await supabase.from('weekly_plans').update({ data: plan.data }).eq('id', plan.id);
    if (!error) {
      setLastSwap(null);
      await loadAll();
      notify(L.updated);
    }
  }

  function buildMarket(selectedIds: string[], keepChecks = false, mode = unitMode) {
    const prev = new Map(marketItems.map((i) => [i.key, i]));
    const map = new Map<string, MarketItem>();

    plans
      .filter((p) => selectedIds.includes(p.profile_id))
      .forEach((plan) => {
        const prof = profiles.find((p) => p.id === plan.profile_id);
        (plan.data.meals || []).forEach((meal: Meal) => {
          const d = dishById(meal.dishId);
          if (!d) return;

          (d.shopping_items || []).forEach((ing: any) => {
            const key = `${String(ing.name).toLowerCase()}__${ing.unit}`;
            const prevItem = prev.get(key);
            const summaryKey = `${meal.date}|${meal.day}|${dishName(d, lang)}`;

            if (!map.has(key)) {
              map.set(key, {
                key,
                name: ing.name,
                amount: Number(ing.amount || 1),
                unit: ing.unit,
                display: '',
                found: keepChecks ? !!prevItem?.found : false,
                missing: keepChecks ? !!prevItem?.missing : false,
                replacement: keepChecks ? prevItem?.replacement || '' : '',
                suggestions: lang === 'es' ? d.replacements_es || [] : d.replacements_en || [],
                usedSummary: [`${prof?.name || ''} · ${formatLong(meal.date, lang)} · ${dishName(d, lang)}`],
              });
            } else {
              const item = map.get(key)!;
              item.amount += Number(ing.amount || 1);
              const line = `${prof?.name || ''} · ${formatLong(meal.date, lang)} · ${dishName(d, lang)}`;
              if (!item.usedSummary.includes(line)) item.usedSummary.push(line);
            }
          });
        });
      });

    const next = Array.from(map.values()).map((item) => ({
      ...item,
      display: formatIngredientAmount(item.amount, item.unit, mode, lang),
    }));

    setMarketItems(next);
    notify(L.updated);
  }

  function toggleFound(key: string) {
    setMarketItems((items) =>
      items.map((item) => item.key === key ? { ...item, found: !item.found, missing: false } : item)
    );
  }

  function markMissing(key: string) {
    setMarketItems((items) =>
      items.map((item) => item.key === key ? { ...item, missing: !item.missing, found: false } : item)
    );
  }

  function setReplacement(key: string, value: string) {
    setMarketItems((items) =>
      items.map((item) => item.key === key ? { ...item, replacement: value, missing: true } : item)
    );
    notify(L.updated);
  }

  function addManualMarketItem() {
    const name = window.prompt(lang === 'es' ? 'Producto manual' : 'Manual item');
    if (!name) return;
    setMarketItems((items) => [...items, {
      key: `manual_${Date.now()}`,
      name,
      amount: 1,
      unit: 'item',
      display: '1 item',
      found: false,
      missing: false,
      replacement: '',
      suggestions: [],
      usedSummary: ['Manual'],
    }]);
    notify(L.productAdded);
  }

  function exportWhatsapp() {
    const text = [
      lang === 'es' ? 'DietApp — Mandado semanal' : 'DietApp — Weekly groceries',
      '',
      ...marketItems.map((i) => `${i.found ? '✅' : i.missing ? '❌' : '•'} ${i.name} — ${i.display}${i.replacement ? ` (${L.replace}: ${i.replacement})` : ''}`),
    ].join('\n');

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  async function saveReminder() {
    if (!modalForm.title || !modalForm.date || !modalForm.time) return;
    const { error } = await supabase.from('reminders').insert({
      household_id: householdId,
      profile_id: activeProfileId || null,
      title: modalForm.title,
      remind_at: `${modalForm.date}T${modalForm.time}:00`,
    });
    if (error) return notify(`No se pudo guardar: ${error.message}`);
    setShowReminderModal(false);
    setModalForm({});
    await loadAll();
    notify(L.reminderSaved);
  }

  async function saveException() {
    if (!modalForm.item || !activeProfile) return;
    const { error } = await supabase.from('exceptions').insert({
      household_id: householdId,
      profile_id: activeProfile.id,
      item: modalForm.item,
      estimated_calories: Number(modalForm.calories || 0),
      note: modalForm.note || '',
    });
    if (error) return notify(`No se pudo guardar: ${error.message}`);
    setShowExceptionModal(false);
    setModalForm({});
    notify(L.exceptionSaved);
  }

  async function analyzeProduct() {
    if (!productPhotos.length) return;
    setProductResult(lang === 'es' ? 'Analizando...' : 'Analyzing...');
    try {
      const res = await fetch('/api/ai/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, profile: activeProfile, images: productPhotos }),
      });
      const data = await res.json();
      setProductResult(data.result || data.error || 'Sin respuesta');
    } catch {
      setProductResult('No se pudo analizar. Revisa OPENAI_API_KEY en Vercel.');
    }
  }

  function handlePhoto(e: any) {
    const files = Array.from(e.target.files || []) as File[];
    files.slice(0, 3).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setProductPhotos((prev) => [...prev, String(ev.target?.result)].slice(0, 3));
      reader.readAsDataURL(file);
    });
  }

  const foundItems = marketItems.filter((i) => i.found);
  const pendingItems = marketItems.filter((i) => !i.found);

  if (showSplash) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'radial-gradient(circle at top, #fff0d5, #fff8ef)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 12 }}>🥗</div>
          <h1 style={{ fontSize: 48, color: '#145a38', margin: 0 }}>DietApp</h1>
          <p style={{ marginTop: 8, color: '#746a5f', fontWeight: 800 }}>{L.by}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <main className="shell">
        <div className="card">{L.loading}</div>
      </main>
    );
  }

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      <header className="header">
        <div className="header-inner">
          <div className="logo">DietApp</div>

          <div className="quick-controls">
            <select value={activeProfileId} onChange={(e) => setActiveProfileId(e.target.value)}>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <Switch labelLeft="ES" labelRight="EN" checked={lang === 'en'} onChange={toggleLanguage} />
            <Switch labelLeft="kg" labelRight="lb" checked={unitMode === 'lb'} onChange={toggleUnitMode} />
          </div>
        </div>
      </header>

      <main className="shell">
        {lastSwap && (
          <div className="card success">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <b>{lang === 'es' ? 'Cambiaste un plato.' : 'You changed a meal.'}</b>
              <button className="btn small" onClick={undoDishChange}><Undo2 size={15} />{L.undo}</button>
            </div>
          </div>
        )}

        {tab === 'today' && (
          <TodayView
            L={L}
            lang={lang}
            unitMode={unitMode}
            activeProfile={activeProfile}
            activePlan={activePlan}
            mealLogs={mealLogs}
            todayMealLogs={todayMealLogs}
            todayWaterMl={todayWaterMl}
            lastWaterId={lastWaterId}
            dishById={dishById}
            generatePlan={generatePlan}
            changeDish={changeDish}
            markMealEaten={markMealEaten}
            undoMealLog={undoMealLog}
            addWater={addWater}
            undoWater={undoWater}
            setSelectedDish={setSelectedDish}
            todayMode={todayMode}
            setTodayMode={setTodayMode}
          />
        )}

        {tab === 'plan' && (
          <PlanView
            L={L}
            lang={lang}
            unitMode={unitMode}
            profiles={profiles}
            plans={plans}
            planStart={planStart}
            setPlanStart={setPlanStart}
            planDays={planDays}
            setPlanDays={setPlanDays}
            dishById={dishById}
            generatePlan={generatePlan}
            changeDish={changeDish}
            setSelectedDish={setSelectedDish}
          />
        )}

        {tab === 'market' && (
          <MarketView
            L={L}
            lang={lang}
            profiles={profiles}
            marketProfiles={marketProfiles}
            setMarketProfiles={setMarketProfiles}
            pendingItems={pendingItems}
            foundItems={foundItems}
            buildMarket={buildMarket}
            toggleFound={toggleFound}
            markMissing={markMissing}
            setReplacement={setReplacement}
            addManualMarketItem={addManualMarketItem}
            exportWhatsapp={exportWhatsapp}
            productPhotos={productPhotos}
            productResult={productResult}
            handlePhoto={handlePhoto}
            analyzeProduct={analyzeProduct}
          />
        )}

        {tab === 'settings' && (
          <SettingsView
            L={L}
            lang={lang}
            unitMode={unitMode}
            profiles={profiles}
            activeProfile={activeProfile}
            editingProfiles={editingProfiles}
            setEditingProfiles={setEditingProfiles}
            addProfile={addProfile}
            saveProfile={saveProfile}
            deleteProfile={deleteProfile}
          />
        )}

        {tab === 'history' && (
          <HistoryView
            L={L}
            lang={lang}
            unitMode={unitMode}
            activeProfile={activeProfile}
            mealLogs={mealLogs}
            waterLogs={waterLogs}
            reminders={reminders}
            setShowReminderModal={setShowReminderModal}
            setShowExceptionModal={setShowExceptionModal}
          />
        )}
      </main>

      {selectedDish && <RecipeModal L={L} lang={lang} dish={selectedDish} onClose={() => setSelectedDish(null)} />}

      {showReminderModal && (
        <FormModal title={L.newReminder} L={L} onClose={() => setShowReminderModal(false)} onSave={saveReminder}>
          <label>{L.title}</label>
          <input value={modalForm.title || ''} onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })} />
          <label>{L.date}</label>
          <input type="date" value={modalForm.date || todayISO()} onChange={(e) => setModalForm({ ...modalForm, date: e.target.value })} />
          <label>{L.time}</label>
          <input type="time" value={modalForm.time || '18:00'} onChange={(e) => setModalForm({ ...modalForm, time: e.target.value })} />
        </FormModal>
      )}

      {showExceptionModal && (
        <FormModal title={L.newException} L={L} onClose={() => setShowExceptionModal(false)} onSave={saveException}>
          <label>{lang === 'es' ? '¿Qué comiste?' : 'What did you eat?'}</label>
          <input value={modalForm.item || ''} onChange={(e) => setModalForm({ ...modalForm, item: e.target.value })} />
          <label>{L.caloriesOptional}</label>
          <input type="number" value={modalForm.calories || ''} onChange={(e) => setModalForm({ ...modalForm, calories: e.target.value })} />
          <label>{L.note}</label>
          <textarea value={modalForm.note || ''} onChange={(e) => setModalForm({ ...modalForm, note: e.target.value })} />
        </FormModal>
      )}

      <nav className="tabs">
        <div className="tabs-inner">
          {[
            ['today', '🍽️', L.home],
            ['plan', '📅', L.week],
            ['market', '🛒', L.market],
            ['settings', '⚙️', L.settings],
            ['history', '📈', L.history],
          ].map(([id, icon, label]) => (
            <button key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(String(id))}>
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

function Switch({ labelLeft, labelRight, checked, onChange }: any) {
  return (
    <button
      onClick={onChange}
      style={{
        border: 0,
        borderRadius: 999,
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: checked ? '#dff4e7' : '#f4eadc',
        fontWeight: 900,
        color: '#145a38',
        minHeight: 42,
      }}
    >
      <span style={{ padding: '0 7px', opacity: checked ? 0.45 : 1 }}>{labelLeft}</span>
      <span
        style={{
          width: 42,
          height: 32,
          borderRadius: 999,
          background: checked ? '#1f7a4d' : '#cdbfae',
          display: 'grid',
          placeItems: 'center',
          color: 'white',
        }}
      >
        {checked ? '→' : '←'}
      </span>
      <span style={{ padding: '0 7px', opacity: checked ? 1 : 0.45 }}>{labelRight}</span>
    </button>
  );
}

function WelcomeCard({ L, onCreate }: any) {
  return (
    <div className="card empty-state">
      <div className="big">👋</div>
      <h2>{L.welcome}</h2>
      <p>{L.welcomeDesc}</p>
      <button className="btn" onClick={onCreate}><UserPlus size={18} />{L.createFirstProfile}</button>
    </div>
  );
}

function TodayView(props: any) {
  const { L, lang, unitMode, activeProfile, activePlan, mealLogs, todayMealLogs, todayWaterMl, lastWaterId, dishById, generatePlan, changeDish, markMealEaten, undoMealLog, addWater, undoWater, setSelectedDish, todayMode, setTodayMode } = props;
  const [showDone, setShowDone] = useState(false);

  if (!activeProfile) return <WelcomeCard L={L} onCreate={() => {}} />;

  const plan = activePlan;
  const meals = plan?.data?.meals || [];
  const todayMeals = meals.filter((m: Meal) => isSameDay(m.date, todayISO()));
  const eatenIds = new Set(mealLogs.filter((l: any) => isSameDay(l.meal_date, todayISO())).map((l: any) => l.meal_id));
  const pending = todayMeals.filter((m: Meal) => !eatenIds.has(m.id));
  const done = todayMeals.filter((m: Meal) => eatenIds.has(m.id));
  const waterGoal = activeProfile?.routine?.reminders?.dailyWaterMl || 3000;

  return (
    <section>
      <div className="card">
        <h1>{L.todayMeals}</h1>
        <p>{L.profile}: <b>{activeProfile.name}</b> · {L.diet}: <b>{dietLabel(activeProfile.diet_type, lang)}</b></p>
        <div className="actions">
          <button className={`btn ${todayMode === 'today' ? '' : 'secondary'}`} onClick={() => setTodayMode('today')}>{L.home}</button>
          <button className={`btn ${todayMode === 'week' ? '' : 'secondary'}`} onClick={() => setTodayMode('week')}>{L.viewWeek}</button>
          <button className="btn outline" onClick={() => generatePlan(activeProfile)}><CalendarDays size={17} />{L.generateWeek}</button>
        </div>
      </div>

      <div className="card">
        <h2><Droplets size={22} /> {L.waterToday}</h2>
        <span className="badge blue">{L.waterGoal}: {waterGoal} ml</span>
        <span className="badge">{todayWaterMl} ml</span>
        <div className="actions">
          <button className="btn secondary small" onClick={() => addWater(unitMode === 'kg' ? 250 : 237)}>+{unitMode === 'kg' ? '250 ml' : '8 oz'}</button>
          <button className="btn secondary small" onClick={() => addWater(unitMode === 'kg' ? 500 : 473)}>+{unitMode === 'kg' ? '500 ml' : '16 oz'}</button>
          <button className="btn secondary small" onClick={() => addWater(unitMode === 'kg' ? 1000 : 946)}>+{unitMode === 'kg' ? '1 L' : '32 oz'}</button>
          {lastWaterId && <button className="btn outline small" onClick={undoWater}><Undo2 size={15} />{L.undoWater}</button>}
        </div>
      </div>

      {!plan && (
        <div className="card empty-state">
          <div className="big">📅</div>
          <h2>{L.noPlan}</h2>
          <p>{L.noPlanDesc}</p>
          <button className="btn" onClick={() => generatePlan(activeProfile)}>{L.generateWeek}</button>
        </div>
      )}

      {plan && todayMode === 'today' && (
        <div className="card">
          <h2>{formatLong(todayISO(), lang)}</h2>
          <span className="badge">{formatShortRange(plan.week_start, plan.data?.duration || 7, lang)}</span>
          {pending.length === 0 ? <p className="notice">{lang === 'es' ? 'No quedan comidas pendientes hoy.' : 'No pending meals today.'}</p> : pending.map((m: Meal) => {
            const d = dishById(m.dishId);
            return <DishCard key={m.id} L={L} lang={lang} d={d} meal={m} onView={() => setSelectedDish(d)} onChange={() => changeDish(m, activeProfile)} onEat={() => markMealEaten(m, activeProfile, plan)} />;
          })}

          {!!done.length && (
            <div style={{ marginTop: 18 }}>
              <button className="btn secondary small" onClick={() => setShowDone(!showDone)}>{showDone ? L.hideFound : L.todayDone}</button>
              {showDone && done.map((m: Meal) => {
                const d = dishById(m.dishId);
                const log = mealLogs.find((l: any) => l.meal_id === m.id);
                return <DishCard key={m.id} L={L} lang={lang} d={d} meal={m} eaten onView={() => setSelectedDish(d)} onChange={() => {}} onEat={() => log && undoMealLog(log)} />;
              })}
            </div>
          )}
        </div>
      )}

      {plan && todayMode === 'week' && <WeekPlan L={L} lang={lang} plan={plan} profile={activeProfile} dishById={dishById} changeDish={changeDish} setSelectedDish={setSelectedDish} />}
    </section>
  );
}

function DishCard({ L, lang, d, meal, eaten, onView, onChange, onEat }: any) {
  if (!d) return null;
  return (
    <div className={`card dish-card ${eaten ? 'found' : ''}`}>
      <img src={d.image_url || '/dishes/placeholder-meal.jpg'} alt={dishName(d, lang)} />
      <div style={{ flex: 1 }}>
        <div className="muted">{formatTime12(meal.time)} · {meal.slot}</div>
        <h3>{dishName(d, lang)}</h3>
        <span className="badge">{d.calories} cal</span>
        <span className="badge blue">{d.protein_g}g</span>
        <span className="badge orange">{d.total_minutes} min</span>
        {meal.workMeal && <span className="badge orange">{L.workMeal}</span>}
        {eaten && <span className="badge">{L.eaten}</span>}
        <div className="actions">
          <button className="btn small secondary" onClick={onView}><Eye size={15} />{L.recipe}</button>
          {!eaten && <button className="btn small outline" onClick={onChange}><RefreshCw size={15} />{L.changeDish}</button>}
          <button className={`btn small ${eaten ? 'outline' : ''}`} onClick={onEat}>
            {eaten ? <Undo2 size={15} /> : <Check size={15} />}
            {eaten ? L.undo : L.markEaten}
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanView({ L, lang, unitMode, profiles, plans, planStart, setPlanStart, planDays, setPlanDays, dishById, generatePlan, changeDish, setSelectedDish }: any) {
  const [filter, setFilter] = useState('all');
  const visible = filter === 'all' ? profiles : profiles.filter((p: any) => p.id === filter);

  return (
    <section>
      <div className="card">
        <h1>{L.weeklyPlan}</h1>
        <span className="badge">{L.weekRange}: {formatShortRange(planStart, planDays, lang)}</span>

        <div className="grid" style={{ marginTop: 14 }}>
          <div className="col6">
            <label>{L.startDate}</label>
            <input type="date" value={planStart} onChange={(e) => setPlanStart(e.target.value)} />
          </div>
          <div className="col6">
            <label>{L.duration}</label>
            <select value={planDays} onChange={(e) => setPlanDays(Number(e.target.value))}>
              {[3, 5, 7, 10, 14].map((d) => <option key={d} value={d}>{d} {L.days}</option>)}
            </select>
          </div>
        </div>

        <div className="actions">
          <button className="btn secondary" onClick={() => setPlanStart(mondayISO())}>{L.generateNormal}</button>
          <button className="btn secondary" onClick={() => setPlanStart(todayISO())}>{L.generateFromDate}</button>
        </div>

        <div className="actions">
          <button className={`btn ${filter === 'all' ? '' : 'secondary'}`} onClick={() => setFilter('all')}>{L.allProfiles}</button>
          {profiles.map((p: any) => <button key={p.id} className={`btn ${filter === p.id ? '' : 'secondary'}`} onClick={() => setFilter(p.id)}>{p.name}</button>)}
        </div>

        <div className="actions">
          {profiles.map((p: any) => <button key={p.id} className="btn outline" onClick={() => generatePlan(p, planStart, planDays)}>{L.generateWeek}: {p.name}</button>)}
        </div>
      </div>

      {visible.map((p: any) => {
        const plan = plans.find((pl: any) => pl.profile_id === p.id && pl.week_start === planStart);
        if (!plan) return null;
        return <WeekPlan key={p.id} L={L} lang={lang} plan={plan} profile={p} dishById={dishById} changeDish={changeDish} setSelectedDish={setSelectedDish} />;
      })}
    </section>
  );
}

function WeekPlan({ L, lang, plan, profile, dishById, changeDish, setSelectedDish }: any) {
  const duration = plan.data?.duration || 7;
  return (
    <div className="card">
      <h2>{profile.name}</h2>
      <p>{dietLabel(profile.diet_type, lang)}</p>
      <span className="badge">{L.weekRange}: {formatShortRange(plan.week_start, duration, lang)}</span>

      {Array.from({ length: duration }).map((_, i) => {
        const dateISO = datePlus(plan.week_start, i);
        const dayMeals = (plan.data.meals || []).filter((m: Meal) => isSameDay(m.date, dateISO));
        const isWork = dayMeals.some((m: Meal) => m.workMeal);

        return (
          <div key={dateISO} style={{ marginTop: 18 }}>
            <h3>{formatLong(dateISO, lang)}</h3>
            <span className={`badge ${isWork ? 'orange' : 'blue'}`}>{isWork ? L.workDay : L.offDay}</span>
            {dayMeals.map((m: Meal) => {
              const d = dishById(m.dishId);
              return <DishCard key={m.id} L={L} lang={lang} d={d} meal={m} onView={() => setSelectedDish(d)} onChange={() => changeDish(m, profile)} onEat={() => {}} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

function MarketView({ L, lang, profiles, marketProfiles, setMarketProfiles, pendingItems, foundItems, buildMarket, toggleFound, markMissing, setReplacement, addManualMarketItem, exportWhatsapp, productPhotos, productResult, handlePhoto, analyzeProduct }: any) {
  const [showFound, setShowFound] = useState(false);

  function toggleProfile(id: string) {
    setMarketProfiles((prev: string[]) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  return (
    <section>
      <div className="card">
        <h1>{L.market}</h1>
        <p>{L.shoppingDesc}</p>
        <h3>{L.selectedProfiles}</h3>
        <div className="grid">
          {profiles.map((p: any) => (
            <button key={p.id} className={`btn ${marketProfiles.includes(p.id) ? '' : 'secondary'}`} onClick={() => toggleProfile(p.id)}>
              {marketProfiles.includes(p.id) ? '✅ ' : ''}{p.name}
            </button>
          ))}
        </div>
        <div className="actions">
          <button className="btn" onClick={() => buildMarket(marketProfiles, true)}><ShoppingCart size={17} />{L.updateShopping}</button>
          <button className="btn outline" onClick={exportWhatsapp}>{L.sendWhats}</button>
          <button className="btn secondary" onClick={addManualMarketItem}>+ {L.addManual}</button>
        </div>
      </div>

      <div className="grid">
        <div className="col8 card">
          <h2>{L.list}</h2>
          {!pendingItems.length && !foundItems.length && <div className="empty-state"><div className="big">🛒</div><p>{L.shoppingEmpty}</p></div>}

          {pendingItems.map((item: MarketItem) => (
            <div key={item.key} className="market-item">
              <button className="market-check" onClick={() => toggleFound(item.key)}></button>
              <div style={{ flex: 1 }}>
                <b>{item.name}</b> — {item.display}
                <div className="actions">
                  <button className="btn small secondary" onClick={() => toggleFound(item.key)}><Check size={14} />{L.markReady}</button>
                  <button className="btn small danger" onClick={() => markMissing(item.key)}><X size={14} />{L.notFound}</button>
                  <button className="btn small outline" onClick={() => {
                    const r = window.prompt(L.replace);
                    if (r) setReplacement(item.key, r);
                  }}>{L.replace}</button>
                </div>

                {item.missing && <span className="badge red">{L.notFound}</span>}
                {item.replacement && (
                  <p className="notice">
                    {L.chosenReplacement}: <b>{item.replacement}</b>
                    <br />
                    {L.replacementNote}
                  </p>
                )}

                {item.missing && item.suggestions?.length > 0 && (
                  <div className="actions">
                    {item.suggestions.slice(0, 4).map((s: string) => <button key={s} className="btn small secondary" onClick={() => setReplacement(item.key, s)}>{s}</button>)}
                  </div>
                )}

                <details>
                  <summary className="muted">{L.relatedRecipes}</summary>
                  {item.usedSummary.map((u) => <p key={u} className="muted">• {u}</p>)}
                </details>
              </div>
            </div>
          ))}

          {!!foundItems.length && (
            <div style={{ marginTop: 18 }}>
              <button className="btn secondary small" onClick={() => setShowFound(!showFound)}>{showFound ? L.hideFound : `${L.showFound} (${foundItems.length})`}</button>
              {showFound && foundItems.map((item: MarketItem) => (
                <div key={item.key} className="market-item found">
                  <button className="market-check active" onClick={() => toggleFound(item.key)}><Check size={18} /></button>
                  <div style={{ flex: 1 }}><b>{item.name}</b> — {item.display}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col4 card">
          <h2>📷 {L.analyze}</h2>
          <p className="muted">{L.analyzeDesc}</p>
          <input type="file" accept="image/*" capture="environment" multiple onChange={handlePhoto} />
          <div className="actions">{productPhotos.map((p: string, i: number) => <img key={i} src={p} style={{ width: 78, height: 78, objectFit: 'cover', borderRadius: 14 }} />)}</div>
          <button className="btn" style={{ width: '100%', marginTop: 10 }} onClick={analyzeProduct}>{L.analyzeBtn}</button>
          {productResult && <div className="notice" style={{ marginTop: 10 }}>{productResult}</div>}
        </div>
      </div>
    </section>
  );
}

function SettingsView({ L, lang, unitMode, profiles, activeProfile, editingProfiles, setEditingProfiles, addProfile, saveProfile, deleteProfile }: any) {
  const [openProfiles, setOpenProfiles] = useState(true);

  return (
    <section>
      <div className="card">
        <h1>{L.configuration}</h1>
        <p>{L.configDesc}</p>
      </div>

      <div className="card">
        <div className="profile-summary">
          <div>
            <h2>{L.profiles}</h2>
            <p>{L.profilesDesc}</p>
          </div>
          <div className="actions">
            <button className="btn secondary small" onClick={() => setOpenProfiles(!openProfiles)}>{openProfiles ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
            <button className="btn" onClick={addProfile}><Plus size={17} />{L.addProfile}</button>
          </div>
        </div>

        {!profiles.length && <WelcomeCard L={L} onCreate={addProfile} />}

        {openProfiles && profiles.map((p: Profile) => (
          <ProfileRow
            key={p.id}
            L={L}
            lang={lang}
            unitMode={unitMode}
            p={p}
            isEditing={!!editingProfiles[p.id]}
            setEditing={(v: boolean) => setEditingProfiles((prev: any) => ({ ...prev, [p.id]: v }))}
            saveProfile={saveProfile}
            deleteProfile={deleteProfile}
          />
        ))}
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <b>{L.footer}</b>
      </div>
    </section>
  );
}

function ProfileRow({ L, lang, unitMode, p, isEditing, setEditing, saveProfile, deleteProfile }: any) {
  const [local, setLocal] = useState<Profile>(p);
  const [showDiet, setShowDiet] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [showRoutine, setShowRoutine] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [avoidInput, setAvoidInput] = useState('');
  const [preferInput, setPreferInput] = useState('');

  useEffect(() => setLocal(p), [p]);

  const routine = { ...defaultRoutine, ...(local.routine || {}) };
  const rem = { ...defaultRoutine.reminders, ...(routine.reminders || {}) };

  function setRoutine(next: any) {
    setLocal({ ...local, routine: { ...routine, ...next } });
  }

  function addTag(kind: 'avoidedFoods' | 'preferredFoods', value: string) {
    const v = value.trim().toLowerCase();
    if (!v) return;
    const current = routine[kind] || [];
    if (current.includes(v)) return;
    setRoutine({ [kind]: [...current, v] });
    if (kind === 'avoidedFoods') setAvoidInput('');
    else setPreferInput('');
  }

  function removeTag(kind: 'avoidedFoods' | 'preferredFoods', value: string) {
    setRoutine({ [kind]: (routine[kind] || []).filter((x: string) => x !== value) });
  }

  function changeMeals(key: 'mealsWork' | 'mealsOff', delta: number) {
    const next = Math.max(1, Number(routine[key] || 3) + delta);
    setRoutine({ [key]: next });
  }

  return (
    <div className="card" style={{ boxShadow: 'none' }}>
      <div className="profile-summary">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="profile-avatar">👤</div>
          <div>
            <h3>{p.name}</h3>
            <div className="muted">{dietLabel(p.diet_type, lang)} · {formatWeight(Number(p.current_weight_kg || 0), unitMode)} → {formatWeight(Number(p.goal_weight_kg || 0), unitMode)}</div>
          </div>
        </div>
        <button className="btn secondary small" onClick={() => setEditing(!isEditing)}>{isEditing ? L.close : L.edit}</button>
      </div>

      {isEditing && (
        <>
          <label>{L.name}</label>
          <input value={local.name || ''} onChange={(e) => setLocal({ ...local, name: e.target.value })} />

          <div className="grid">
            <div className="col6">
              <label>{L.currentWeight} ({unitMode})</label>
              <input type="number" value={unitMode === 'lb' ? clean(kgToLb(Number(local.current_weight_kg || 0))) : local.current_weight_kg || ''} onChange={(e) => setLocal({ ...local, current_weight_kg: unitMode === 'lb' ? lbToKg(Number(e.target.value || 0)) : Number(e.target.value || 0) })} />
            </div>
            <div className="col6">
              <label>{L.goalWeight} ({unitMode})</label>
              <input type="number" value={unitMode === 'lb' ? clean(kgToLb(Number(local.goal_weight_kg || 0))) : local.goal_weight_kg || ''} onChange={(e) => setLocal({ ...local, goal_weight_kg: unitMode === 'lb' ? lbToKg(Number(e.target.value || 0)) : Number(e.target.value || 0) })} />
            </div>
            <div className="col6">
              <label>{L.height} (cm)</label>
              <input type="number" value={local.height_cm || ''} onChange={(e) => setLocal({ ...local, height_cm: Number(e.target.value || 0) })} />
            </div>
            <div className="col6">
              <label>{L.age}</label>
              <input type="number" value={local.age || ''} onChange={(e) => setLocal({ ...local, age: Number(e.target.value || 0) })} />
            </div>
          </div>

          <label>{L.sex}</label>
          <select value={local.sex || 'other'} onChange={(e) => setLocal({ ...local, sex: e.target.value })}>
            <option value="male">{L.male}</option>
            <option value="female">{L.female}</option>
            <option value="other">{L.other}</option>
          </select>

          <label>{L.goalType}</label>
          <select value={routine.goalType || 'lose'} onChange={(e) => setRoutine({ goalType: e.target.value })}>
            <option value="lose">{L.lose}</option>
            <option value="maintain">{L.maintain}</option>
            <option value="gain">{L.gain}</option>
          </select>

          <label>{L.goalDate}</label>
          <input type="date" value={routine.goalDate || ''} onChange={(e) => setRoutine({ goalDate: e.target.value })} />

          <label>{L.activity}</label>
          <select value={routine.activityLevel || 'normal'} onChange={(e) => setRoutine({ activityLevel: e.target.value })}>
            <option value="low">{L.activityLow}</option>
            <option value="normal">{L.activityNormal}</option>
            <option value="high">{L.activityHigh}</option>
          </select>

          <label>{L.diet}</label>
          <select value={local.diet_type || 'carnivore_flexible'} onChange={(e) => setLocal({ ...local, diet_type: e.target.value })}>
            <option value="carnivore_strict">Carnivore strict</option>
            <option value="carnivore_flexible">Carnivore flexible</option>
            <option value="animal_based">Animal-based</option>
            <option value="keto_carnivore">Keto carnivore</option>
            <option value="lacto_ovo_vegetarian">Lacto-ovo vegetarian</option>
            <option value="lacto_vegetarian">Lacto vegetarian</option>
            <option value="ovo_vegetarian">Ovo vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>

          <Collapsible title={L.dietInfo} open={showDiet} setOpen={setShowDiet}>
            <p>{dietInfo(local.diet_type, lang)}</p>
          </Collapsible>

          <Collapsible title={L.restrictions} open={showRestrictions} setOpen={setShowRestrictions}>
            <label>{L.omitFoods}</label>
            <div className="actions">
              <input value={avoidInput} onChange={(e) => setAvoidInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addTag('avoidedFoods', avoidInput); }} />
              <button className="btn secondary" onClick={() => addTag('avoidedFoods', avoidInput)}>{L.addFood}</button>
            </div>
            <div className="actions">{(routine.avoidedFoods || []).map((x: string) => <button key={x} className="btn small danger" onClick={() => removeTag('avoidedFoods', x)}>× {x}</button>)}</div>

            <label>{L.preferFoods}</label>
            <div className="actions">
              <input value={preferInput} onChange={(e) => setPreferInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addTag('preferredFoods', preferInput); }} />
              <button className="btn secondary" onClick={() => addTag('preferredFoods', preferInput)}>{L.addFood}</button>
            </div>
            <div className="actions">{(routine.preferredFoods || []).map((x: string) => <button key={x} className="btn small secondary" onClick={() => removeTag('preferredFoods', x)}>× {x}</button>)}</div>
          </Collapsible>

          <Collapsible title={L.routine} open={showRoutine} setOpen={setShowRoutine}>
            <label>
              <input type="checkbox" checked={!!routine.worksNow} onChange={(e) => setRoutine({ worksNow: e.target.checked })} /> {L.worksNow}
            </label>

            {routine.worksNow && (
              <>
                <h3>{L.workDays}</h3>
                <DayPicker days={routine.workDays || []} setDays={(days: string[]) => setRoutine({ workDays: days })} />
                <div className="grid">
                  <div className="col6"><label>{L.wakeWork}</label><input type="time" value={routine.wakeWork} onChange={(e) => setRoutine({ wakeWork: e.target.value })} /></div>
                  <div className="col6"><label>{L.startWork}</label><input type="time" value={routine.startWork} onChange={(e) => setRoutine({ startWork: e.target.value })} /></div>
                  <div className="col6"><label>{L.breakWork}</label><input type="time" value={routine.breakWork} onChange={(e) => setRoutine({ breakWork: e.target.value })} /></div>
                  <div className="col6"><label>{L.endWork}</label><input type="time" value={routine.endWork} onChange={(e) => setRoutine({ endWork: e.target.value })} /></div>
                </div>
                <Stepper label={L.mealsWork} value={routine.mealsWork || 3} dec={() => changeMeals('mealsWork', -1)} inc={() => changeMeals('mealsWork', 1)} />
              </>
            )}

            <div className="grid">
              <div className="col6"><label>{L.wakeOff}</label><input type="time" value={routine.wakeOff} onChange={(e) => setRoutine({ wakeOff: e.target.value })} /></div>
              <div className="col6"><label>{L.sleepOff}</label><input type="time" value={routine.sleepOff} onChange={(e) => setRoutine({ sleepOff: e.target.value })} /></div>
            </div>
            <Stepper label={L.mealsOff} value={routine.mealsOff || 3} dec={() => changeMeals('mealsOff', -1)} inc={() => changeMeals('mealsOff', 1)} />
          </Collapsible>

          <Collapsible title={L.hydrationReminder} open={showReminders} setOpen={setShowReminders}>
            <label><input type="checkbox" checked={!!rem.enabledMeal} onChange={(e) => setRoutine({ reminders: { ...rem, enabledMeal: e.target.checked } })} /> {L.mealEnabled}</label>
            <label>{L.mealBefore}</label>
            <select value={rem.mealReminderMinutes} onChange={(e) => setRoutine({ reminders: { ...rem, mealReminderMinutes: Number(e.target.value) } })}>
              {[0, 10, 15, 30, 60].map((m) => <option key={m} value={m}>{m} {L.minutes}</option>)}
            </select>
            <label><input type="checkbox" checked={!!rem.enabledWater} onChange={(e) => setRoutine({ reminders: { ...rem, enabledWater: e.target.checked } })} /> {L.waterEnabled}</label>
            <label>{L.waterEvery}</label>
            <select value={rem.waterEveryHours} onChange={(e) => setRoutine({ reminders: { ...rem, waterEveryHours: Number(e.target.value) } })}>
              {[1, 2, 3, 4].map((h) => <option key={h} value={h}>{h} {L.hours}</option>)}
            </select>
            <label>{L.hydrationGoal} ({unitMode === 'kg' ? 'ml' : 'oz'})</label>
            <input type="number" value={unitMode === 'kg' ? rem.dailyWaterMl : clean(rem.dailyWaterMl / 29.5735)} onChange={(e) => setRoutine({ reminders: { ...rem, dailyWaterMl: unitMode === 'kg' ? Number(e.target.value || 0) : Number(e.target.value || 0) * 29.5735 } })} />
            <label><input type="checkbox" checked={!!rem.prepWorkMeal} onChange={(e) => setRoutine({ reminders: { ...rem, prepWorkMeal: e.target.checked } })} /> {L.workPrep}</label>
            <label><input type="checkbox" checked={!!rem.groceryReminder} onChange={(e) => setRoutine({ reminders: { ...rem, groceryReminder: e.target.checked } })} /> {L.groceryReminder}</label>
            <label><input type="checkbox" checked={!!rem.weightReminder} onChange={(e) => setRoutine({ reminders: { ...rem, weightReminder: e.target.checked } })} /> {L.weightReminder}</label>
          </Collapsible>

          <div className="actions">
            <button className="btn" onClick={() => saveProfile(local)}>{L.save}</button>
            <button className="btn danger" onClick={() => deleteProfile(local.id)}><Trash2 size={16} />{L.delete}</button>
          </div>
        </>
      )}
    </div>
  );
}

function DayPicker({ days, setDays }: any) {
  const active = (days || []).map(normalizeDay);
  return (
    <div className="actions">
      {DAYS_ES.map((d) => (
        <button key={d} className={`btn small ${active.includes(d) ? '' : 'secondary'}`} onClick={() => {
          const next = active.includes(d) ? active.filter((x: string) => x !== d) : [...active, d];
          setDays(next);
        }}>
          {d.slice(0, 3)}
        </button>
      ))}
    </div>
  );
}

function Stepper({ label, value, dec, inc }: any) {
  return (
    <div className="card" style={{ boxShadow: 'none' }}>
      <div className="profile-summary">
        <b>{label}</b>
        <div className="actions">
          <button className="btn secondary small" onClick={dec}>−</button>
          <span className="badge">{value}</span>
          <button className="btn secondary small" onClick={inc}>+</button>
        </div>
      </div>
    </div>
  );
}

function Collapsible({ title, open, setOpen, children }: any) {
  return (
    <div className="card" style={{ boxShadow: 'none' }}>
      <div className="profile-summary">
        <h3>{title}</h3>
        <button className="btn secondary small" onClick={() => setOpen(!open)}>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}

function HistoryView({ L, lang, unitMode, activeProfile, mealLogs, waterLogs, reminders, setShowReminderModal, setShowExceptionModal }: any) {
  const [range, setRange] = useState('day');

  const caloriesToday = mealLogs.filter((m: any) => isSameDay(m.meal_date, todayISO())).reduce((s: number, m: any) => s + Number(m.calories || 0), 0);
  const proteinToday = mealLogs.filter((m: any) => isSameDay(m.meal_date, todayISO())).reduce((s: number, m: any) => s + Number(m.protein_g || 0), 0);
  const bmrVal = activeProfile ? Math.round(bmr(activeProfile)) : 0;
  const tdeeVal = activeProfile ? Math.round(bmr(activeProfile) * activityFactor(activeProfile?.routine?.activityLevel || 'normal')) : 0;
  const targetVal = activeProfile ? targetCalories(activeProfile) : 0;
  const bmiVal = activeProfile ? bmi(activeProfile) : 0;

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const date = datePlus(todayISO(), i - 6);
    const cal = mealLogs.filter((m: any) => isSameDay(m.meal_date, date)).reduce((s: number, m: any) => s + Number(m.calories || 0), 0);
    return { date, cal };
  });

  const maxCal = Math.max(1, ...last7.map((x) => x.cal));

  return (
    <section>
      <div className="card">
        <h1>{L.historyTitle}</h1>
        <p>{L.historyDesc}</p>
        <div className="actions">
          <button className="btn secondary" onClick={() => setShowExceptionModal(true)}>{L.logException}</button>
          <button className="btn secondary" onClick={() => setShowReminderModal(true)}><Bell size={16} />{L.addReminder}</button>
        </div>
      </div>

      <div className="grid">
        <div className="col6 card">
          <h2>{L.caloriesToday}</h2>
          <span className="badge orange">{caloriesToday} cal</span>
          <span className="badge blue">{L.proteinToday}: {clean(proteinToday)}g</span>
          <p className="muted">{targetVal ? `${L.target}: ${targetVal} cal` : ''}</p>
        </div>
        <div className="col6 card">
          <h2>{L.bmi}</h2>
          <span className="badge">{bmiVal ? bmiVal.toFixed(1) : '—'}</span>
          <p className="muted">{formatWeight(Number(activeProfile?.current_weight_kg || 0), unitMode)} · {activeProfile?.height_cm || 0} cm</p>
        </div>
      </div>

      <div className="card">
        <h2>{L.bmr}: {bmrVal} · {L.tdee}: {tdeeVal} · {L.target}: {targetVal} cal</h2>
        <p>{L.bmrExplain}</p>
        <p>{L.tdeeExplain}</p>
        <p>{L.targetExplain}</p>
      </div>

      <div className="card">
        <h2>{L.chart}</h2>
        <div className="actions">
          <button className={`btn small ${range === 'day' ? '' : 'secondary'}`} onClick={() => setRange('day')}>{L.daily}</button>
          <button className={`btn small ${range === 'week' ? '' : 'secondary'}`} onClick={() => setRange('week')}>{L.weekly}</button>
          <button className={`btn small ${range === 'month' ? '' : 'secondary'}`} onClick={() => setRange('month')}>{L.monthly}</button>
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {last7.map((x) => (
            <div key={x.date}>
              <div className="muted">{formatLong(x.date, lang)} — {x.cal} cal</div>
              <div style={{ height: 14, borderRadius: 999, background: '#f0e5d5' }}>
                <div style={{ height: 14, width: `${Math.min(100, (x.cal / maxCal) * 100)}%`, borderRadius: 999, background: '#1f7a4d' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>{L.addReminder}</h2>
        {!reminders.length && <p className="muted">{L.noItems}</p>}
        {reminders.map((r: any) => <p key={r.id}>🔔 {r.title}<br /><span className="muted">{new Date(r.remind_at).toLocaleString()}</span></p>)}
      </div>
    </section>
  );
}

function FormModal({ title, L, children, onClose, onSave }: any) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="card modalbox" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <div className="actions">
          <button className="btn" onClick={onSave}>{L.save}</button>
          <button className="btn secondary" onClick={onClose}>{L.cancel}</button>
        </div>
      </div>
    </div>
  );
}

function RecipeModal({ L, lang, dish, onClose }: any) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="card modalbox" onClick={(e) => e.stopPropagation()}>
        <button className="btn secondary small" onClick={onClose}>{L.closeRecipe}</button>
        <img className="recipe-hero" src={dish.image_url || '/dishes/placeholder-meal.jpg'} alt={dishName(dish, lang)} />
        <p className="muted">{L.recipeImageNote}</p>
        <h1>{dishName(dish, lang)}</h1>
        <span className="badge">{dish.calories} cal</span>
        <span className="badge blue">{dish.protein_g}g</span>
        <span className="badge orange">{dish.total_minutes} min</span>
        <h2>{L.ingredients}</h2>
        <ul>{((lang === 'es' ? dish.ingredients_es : dish.ingredients_en) || []).map((i: string) => <li key={i}>{i}</li>)}</ul>
        <h2>{L.utensils}</h2>
        <ul>{((lang === 'es' ? dish.utensils_es : dish.utensils_en) || []).map((i: string) => <li key={i}>{i}</li>)}</ul>
        <h2>{L.stepByStep}</h2>
        <ol>{((lang === 'es' ? dish.steps_es : dish.steps_en) || []).map((i: string) => <li key={i} style={{ marginBottom: 10 }}>{i}</li>)}</ol>
        <h2>{L.tips}</h2>
        <ul>{((lang === 'es' ? dish.tips_es : dish.tips_en) || []).map((i: string) => <li key={i}>{i}</li>)}</ul>
      </div>
    </div>
  );
}
