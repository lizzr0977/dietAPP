
'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DISHES } from '@/data/dishes';
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Languages,
  Plus,
  RefreshCw,
  Settings,
  ShoppingCart,
  Trash2,
  Undo2,
  UserPlus,
  X,
  Droplets,
} from 'lucide-react';

type Lang = 'es' | 'en';
type Profile = any;
type WeeklyPlan = any;
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
  usedIn: string[];
};

const DAY_NAMES_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAY_NAMES_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const UI = {
  es: {
    loading: 'Cargando DietApp...',
    home: 'Hoy',
    week: 'Semana',
    market: 'Super',
    settings: 'Config.',
    history: 'Historial',
    viewWeek: 'Ver semana',
    generateWeek: 'Generar semana',
    noPlan: 'Aún no hay plan',
    noPlanDesc: 'Genera una semana para que DietApp te muestre tus comidas por horario.',
    recipe: 'Ver receta',
    changeDish: 'Cambiar plato',
    meal: 'Comida',
    workDay: 'Día de trabajo',
    offDay: 'Descanso',
    profile: 'Perfil',
    diet: 'Dieta',
    portable: 'Para llevar',
    todayMeals: 'Tu comida de hoy',
    weeklyPlan: 'Plan semanal',
    reviewWeek: 'Revisa la semana completa antes de hacer el mandado.',
    shopping: 'Super / Mandado',
    shoppingDesc: 'Selecciona perfiles y DietApp suma ingredientes de la semana.',
    updateShopping: 'Actualizar mandado',
    sendWhats: 'Enviar WhatsApp',
    addManual: 'Agregar manual',
    list: 'Lista',
    foundList: 'Ya encontrados',
    relatedRecipes: 'Ver recetas relacionadas',
    notFound: 'No encontrado',
    replace: 'Reemplazar',
    analyze: 'Analizar producto',
    analyzeDesc: 'Toma foto del frente, Nutrition Facts e ingredientes.',
    analyzeBtn: 'Analizar producto',
    historyTitle: 'Historial',
    historyDesc: 'Registra excepciones, peso y recordatorios.',
    logException: 'Registrar excepción',
    addReminder: 'Agregar recordatorio',
    pendingReminders: 'Recordatorios pendientes',
    noReminders: 'No tienes recordatorios pendientes.',
    configuration: 'Configuración',
    configDesc: 'Administra perfiles, unidades, idioma y preferencias.',
    quickUnits: 'Ajustar unidades',
    profiles: 'Perfiles',
    profilesDesc: 'Los detalles quedan ocultos hasta que quieras editarlos.',
    addProfile: 'Agregar',
    welcome: 'Bienvenido a DietApp',
    welcomeDesc:
      'Crea un perfil, elige tu dieta, configura tus horarios, genera tu semana y luego usa la lista del súper.',
    createFirstProfile: 'Crear primer perfil',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    currentWeight: 'Peso actual',
    goalWeight: 'Peso meta',
    height: 'Estatura',
    age: 'Edad',
    routine: 'Rutina',
    wakeWork: 'Despierto trabajo',
    startWork: 'Entrada',
    breakWork: 'Break',
    endWork: 'Salida',
    wakeOff: 'Despierto descanso',
    sleepOff: 'Dormir descanso',
    workDays: 'Días de trabajo separados por coma',
    mealsWork: 'Comidas en día de trabajo',
    mealsOff: 'Comidas en día libre',
    dietInfo: 'Ver en qué consiste esta dieta',
    restrictions: 'Preferencias y restricciones',
    omitFoods: 'Omitir alimentos',
    preferFoods: 'Agregar / preferir alimentos',
    omitHelp: 'Escribe por comas. Esos ingredientes se intentan excluir de tus recetas.',
    preferHelp: 'Escribe por comas. DietApp prioriza recetas que los incluyan.',
    hydrationReminder: 'Recordatorios e hidratación',
    hydrationGoal: 'Meta diaria de agua (ml)',
    waterEvery: 'Recordatorio de agua cada',
    waterEnabled: 'Activar recordatorios de agua',
    mealEnabled: 'Activar recordatorios de comida',
    mealBefore: 'Avisar antes de la comida',
    workPrep: 'Recordar preparar comida para el trabajo',
    groceryReminder: 'Recordar hacer mandado',
    weightReminder: 'Recordar registrar peso',
    disabled: 'Apagado',
    minutes: 'min',
    hours: 'horas',
    globalLanguage: 'Idioma',
    bodyWeight: 'Peso corporal',
    solids: 'Sólidos',
    liquids: 'Líquidos',
    cooking: 'Cocina',
    pounds: 'Libras',
    kilos: 'Kilos',
    ounces: 'Onzas',
    grams: 'Gramos',
    liters: 'Litros',
    milliliters: 'Mililitros',
    gallon: 'Galones',
    saveSuccess: 'Guardado ✅',
    updateSuccess: 'Actualizado ✅',
    deleted: 'Eliminado ✅',
    created: 'Creado ✅',
    weekGenerated: 'Plan semanal generado ✅',
    dishChanged: 'Plato cambiado ✅',
    dishUndo: 'Cambio deshecho ✅',
    shoppingUpdated: 'Mandado actualizado ✅',
    replacementAdded: 'Reemplazo agregado ✅',
    productAdded: 'Producto agregado ✅',
    reminderSaved: 'Recordatorio guardado ✅',
    exceptionSaved: 'Excepción registrada ✅',
    noCompatible: 'No hay platillos compatibles con este perfil.',
    noProfiles: 'No hay perfiles todavía.',
    confirmDishChange: '¿Seguro que quieres cambiar este plato?',
    undo: 'Deshacer',
    yes: 'Sí',
    no: 'No',
    forWorkMeal: 'Comida de trabajo',
    waterToday: 'Hidratación de hoy',
    waterGoal: 'Meta',
    waterQuick: 'Agregar agua',
    weekRange: 'Semana',
    allProfiles: 'Todos',
    onlyProfile: 'Solo',
    selectedProfiles: 'Perfiles seleccionados',
    showFound: 'Mostrar encontrados',
    hideFound: 'Ocultar encontrados',
    doneBottom: 'Los productos marcados como listos se ocultan aquí abajo.',
    shoppingEmpty: 'Selecciona uno o más perfiles y toca “Actualizar mandado”.',
    replacePrompt: '¿Qué reemplazo encontraste?',
    manualPrompt: 'Producto manual',
    reminderPrompt: 'Recordatorio',
    reminderDatePrompt: 'Fecha/hora ejemplo 2026-06-01T18:00',
    exceptionPrompt: '¿Qué excepción comiste?',
    profileNamePrompt: 'Nombre del perfil',
    closeRecipe: 'Cerrar',
    ingredients: 'Ingredientes',
    utensils: 'Utensilios',
    stepByStep: 'Paso a paso',
    timeSavingTips: 'Tips para ahorrar tiempo',
    timeline: 'Tiempo aproximado a la meta',
  },
  en: {
    loading: 'Loading DietApp...',
    home: 'Today',
    week: 'Week',
    market: 'Groceries',
    settings: 'Settings',
    history: 'History',
    viewWeek: 'View week',
    generateWeek: 'Generate week',
    noPlan: 'No plan yet',
    noPlanDesc: 'Generate a week so DietApp can show your meals by schedule.',
    recipe: 'View recipe',
    changeDish: 'Change meal',
    meal: 'Meal',
    workDay: 'Work day',
    offDay: 'Off day',
    profile: 'Profile',
    diet: 'Diet',
    portable: 'Portable',
    todayMeals: 'Your food today',
    weeklyPlan: 'Weekly plan',
    reviewWeek: 'Review the full week before buying groceries.',
    shopping: 'Groceries',
    shoppingDesc: 'Select profiles and DietApp will add all ingredients for the week.',
    updateShopping: 'Update groceries',
    sendWhats: 'Send WhatsApp',
    addManual: 'Add manual',
    list: 'List',
    foundList: 'Found already',
    relatedRecipes: 'See related recipes',
    notFound: 'Not found',
    replace: 'Replace',
    analyze: 'Analyze product',
    analyzeDesc: 'Take photos of the front, Nutrition Facts and ingredients.',
    analyzeBtn: 'Analyze product',
    historyTitle: 'History',
    historyDesc: 'Track exceptions, weight and reminders.',
    logException: 'Log exception',
    addReminder: 'Add reminder',
    pendingReminders: 'Pending reminders',
    noReminders: 'You have no pending reminders.',
    configuration: 'Settings',
    configDesc: 'Manage profiles, units, language and preferences.',
    quickUnits: 'Adjust units',
    profiles: 'Profiles',
    profilesDesc: 'Details stay hidden until you want to edit them.',
    addProfile: 'Add',
    welcome: 'Welcome to DietApp',
    welcomeDesc:
      'Create a profile, choose your diet, configure your schedule, generate your week and then use the grocery list.',
    createFirstProfile: 'Create first profile',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    currentWeight: 'Current weight',
    goalWeight: 'Goal weight',
    height: 'Height',
    age: 'Age',
    routine: 'Routine',
    wakeWork: 'Wake up work day',
    startWork: 'Start work',
    breakWork: 'Break',
    endWork: 'End work',
    wakeOff: 'Wake up day off',
    sleepOff: 'Sleep day off',
    workDays: 'Work days separated by comma',
    mealsWork: 'Meals on work day',
    mealsOff: 'Meals on day off',
    dietInfo: 'See what this diet means',
    restrictions: 'Preferences and restrictions',
    omitFoods: 'Avoid foods',
    preferFoods: 'Add / prefer foods',
    omitHelp: 'Type separated by commas. Those ingredients are excluded when possible.',
    preferHelp: 'Type separated by commas. DietApp prioritizes recipes that include them.',
    hydrationReminder: 'Reminders and hydration',
    hydrationGoal: 'Daily water goal (ml)',
    waterEvery: 'Water reminder every',
    waterEnabled: 'Enable water reminders',
    mealEnabled: 'Enable meal reminders',
    mealBefore: 'Remind before meal',
    workPrep: 'Remind to prep work meals',
    groceryReminder: 'Remind grocery shopping',
    weightReminder: 'Remind weigh-in',
    disabled: 'Off',
    minutes: 'min',
    hours: 'hours',
    globalLanguage: 'Language',
    bodyWeight: 'Body weight',
    solids: 'Solids',
    liquids: 'Liquids',
    cooking: 'Cooking',
    pounds: 'Pounds',
    kilos: 'Kilos',
    ounces: 'Ounces',
    grams: 'Grams',
    liters: 'Liters',
    milliliters: 'Milliliters',
    gallon: 'Gallons',
    saveSuccess: 'Saved ✅',
    updateSuccess: 'Updated ✅',
    deleted: 'Deleted ✅',
    created: 'Created ✅',
    weekGenerated: 'Weekly plan generated ✅',
    dishChanged: 'Meal changed ✅',
    dishUndo: 'Change undone ✅',
    shoppingUpdated: 'Groceries updated ✅',
    replacementAdded: 'Replacement added ✅',
    productAdded: 'Product added ✅',
    reminderSaved: 'Reminder saved ✅',
    exceptionSaved: 'Exception saved ✅',
    noCompatible: 'No compatible meals for this profile.',
    noProfiles: 'No profiles yet.',
    confirmDishChange: 'Are you sure you want to change this meal?',
    undo: 'Undo',
    yes: 'Yes',
    no: 'No',
    forWorkMeal: 'Work meal',
    waterToday: 'Hydration today',
    waterGoal: 'Goal',
    waterQuick: 'Add water',
    weekRange: 'Week',
    allProfiles: 'All',
    onlyProfile: 'Only',
    selectedProfiles: 'Selected profiles',
    showFound: 'Show found',
    hideFound: 'Hide found',
    doneBottom: 'Items marked done are hidden below.',
    shoppingEmpty: 'Select one or more profiles and tap “Update groceries”.',
    replacePrompt: 'What replacement did you find?',
    manualPrompt: 'Manual item',
    reminderPrompt: 'Reminder',
    reminderDatePrompt: 'Date/time example 2026-06-01T18:00',
    exceptionPrompt: 'What off-plan item did you eat?',
    profileNamePrompt: 'Profile name',
    closeRecipe: 'Close',
    ingredients: 'Ingredients',
    utensils: 'Utensils',
    stepByStep: 'Step by step',
    timeSavingTips: 'Time-saving tips',
    timeline: 'Estimated time to goal',
  },
};

const defaultUnits = {
  bodyWeight: 'lb',
  solid: 'lb',
  liquid: 'l',
  cooking: 'cup',
};

const defaultReminders = {
  enabledMeal: true,
  mealReminderMinutes: 15,
  enabledWater: true,
  waterEveryHours: 2,
  prepWorkMeal: true,
  groceryReminder: false,
  weightReminder: false,
  dailyWaterMl: 3000,
};

function mondayDate(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function mondayISO(d = new Date()) {
  return mondayDate(d).toISOString().slice(0, 10);
}

function dateForIndex(weekStart: string, index: number) {
  const d = new Date(`${weekStart}T12:00:00`);
  d.setDate(d.getDate() + index);
  return d;
}

function formatDateLong(date: Date, lang: Lang) {
  const locale = lang === 'es' ? 'es-US' : 'en-US';
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
  const rest = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${rest}`;
}

function formatWeekRange(weekStart: string, lang: Lang) {
  const first = dateForIndex(weekStart, 0);
  const last = dateForIndex(weekStart, 6);
  const locale = lang === 'es' ? 'es-US' : 'en-US';
  const one = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long' }).format(first);
  const two = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(last);
  return `${one} — ${two}`;
}

function kgToLb(kg: number) {
  return kg * 2.2046226218;
}

function lbToKg(lb: number) {
  return lb / 2.2046226218;
}

function cleanNumber(n: number) {
  if (Number.isNaN(n)) return '0';
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, '');
}

function formatWeightDisplay(kg: number, unit: string) {
  if (unit === 'kg') return `${cleanNumber(kg)} kg`;
  return `${cleanNumber(kgToLb(kg))} lb`;
}

function estimateWeightTimeline(currentKg: number, goalKg: number, paceLbPerWeek: number) {
  const diffLb = Math.abs(kgToLb(currentKg - goalKg));
  if (!diffLb || !paceLbPerWeek) return null;
  const weeks = diffLb / paceLbPerWeek;
  return {
    weeksMin: Math.ceil(weeks * 0.85),
    weeksMax: Math.ceil(weeks * 1.25),
  };
}

function todayDayName(lang: Lang) {
  const idx = (new Date().getDay() + 6) % 7;
  return lang === 'es' ? DAY_NAMES_ES[idx] : DAY_NAMES_EN[idx];
}

function getDayByIndex(index: number, lang: Lang) {
  return lang === 'es' ? DAY_NAMES_ES[index] : DAY_NAMES_EN[index];
}

function normalizeToEsDay(day: string) {
  const lower = String(day || '').toLowerCase();
  const map: Record<string, string> = {
    lunes: 'Lunes',
    monday: 'Lunes',
    martes: 'Martes',
    tuesday: 'Martes',
    miércoles: 'Miércoles',
    miercoles: 'Miércoles',
    wednesday: 'Miércoles',
    jueves: 'Jueves',
    thursday: 'Jueves',
    viernes: 'Viernes',
    friday: 'Viernes',
    sábado: 'Sábado',
    sabado: 'Sábado',
    saturday: 'Sábado',
    domingo: 'Domingo',
    sunday: 'Domingo',
  };
  return map[lower] || day;
}

function getDishName(d: any, lang: Lang) {
  return lang === 'es' ? d.name_es || d.name_en : d.name_en || d.name_es;
}

function getDishTextArray(d: any, lang: Lang, fieldEs: string, fieldEn: string) {
  return (lang === 'es' ? d[fieldEs] : d[fieldEn]) || [];
}

function unitOptionLabel(value: string, lang: Lang) {
  const l = UI[lang];
  const map: Record<string, string> = {
    lb: l.pounds,
    kg: l.kilos,
    oz: l.ounces,
    g: l.grams,
    l: l.liters,
    ml: l.milliliters,
    gal: l.gallon,
    cup: 'Cups',
    tbsp: 'Tbsp',
    tsp: 'Tsp',
    fl_oz: 'Fl oz',
  };
  return map[value] || value;
}

function formatSolidFromGrams(amountG: number, unit: string) {
  if (unit === 'g') return `${cleanNumber(amountG)} g`;
  if (unit === 'kg') return `${cleanNumber(amountG / 1000)} kg`;
  if (unit === 'oz') return `${cleanNumber(amountG / 28.3495)} oz`;
  return `${cleanNumber(amountG / 453.592)} lb`;
}

function translateShoppingDisplay(amount: number, unit: string, preferredUnit: string) {
  if (unit === 'g') return formatSolidFromGrams(amount, preferredUnit);
  if (unit === 'cucharadita') return `${cleanNumber(amount)} tsp`;
  if (unit === 'cucharada') return `${cleanNumber(amount)} tbsp`;
  if (unit === 'taza') return `${cleanNumber(amount)} cup${amount === 1 ? '' : 's'}`;
  if (unit === 'pieza' || unit === 'piezas') return `${cleanNumber(amount)} ${amount === 1 ? 'pieza' : 'piezas'}`;
  if (unit === 'lata') return `${cleanNumber(amount)} ${amount === 1 ? 'lata' : 'latas'}`;
  if (unit === 'porción') return `${cleanNumber(amount)} porción`;
  if (unit === 'al gusto') return 'al gusto';
  return `${cleanNumber(amount)} ${unit}`;
}

function dietLabel(diet: string, lang: Lang) {
  const esMap: Record<string, string> = {
    carnivore_strict: 'Carnívora estricta',
    carnivore_flexible: 'Carnívora flexible',
    animal_based: 'Animal-based',
    keto_carnivore: 'Keto carnívora',
    lacto_ovo_vegetarian: 'Lacto-ovo vegetariana',
    lacto_vegetarian: 'Lacto vegetariana',
    ovo_vegetarian: 'Ovo vegetariana',
    vegan: 'Vegana',
  };
  const enMap: Record<string, string> = {
    carnivore_strict: 'Strict carnivore',
    carnivore_flexible: 'Flexible carnivore',
    animal_based: 'Animal-based',
    keto_carnivore: 'Keto carnivore',
    lacto_ovo_vegetarian: 'Lacto-ovo vegetarian',
    lacto_vegetarian: 'Lacto vegetarian',
    ovo_vegetarian: 'Ovo vegetarian',
    vegan: 'Vegan',
  };
  return (lang === 'es' ? esMap : enMap)[diet] || diet;
}

function dietInfo(diet: string, lang: Lang) {
  const map: Record<string, { es: string; en: string }> = {
    carnivore_strict: {
      es: 'Se enfoca casi por completo en alimentos de origen animal. Generalmente se priorizan carne, huevos, pescado y grasas animales.',
      en: 'Focuses almost entirely on animal foods. Usually prioritizes meat, eggs, fish and animal fats.',
    },
    carnivore_flexible: {
      es: 'Base carnívora, pero puede incluir algunos alimentos adicionales tolerados por la persona.',
      en: 'Carnivore-based, but may include some additional tolerated foods.',
    },
    animal_based: {
      es: 'Prioriza alimentos animales, pero suele permitir frutas, miel y algunos alimentos simples.',
      en: 'Prioritizes animal foods, but often allows fruit, honey and simple foods.',
    },
    keto_carnivore: {
      es: 'Muy baja en carbohidratos, con enfoque carnívoro o casi carnívoro para mantener cetosis.',
      en: 'Very low carb, with a carnivore or near-carnivore focus to maintain ketosis.',
    },
    lacto_ovo_vegetarian: {
      es: 'No incluye carne ni pescado. Sí permite lácteos y huevo.',
      en: 'No meat or fish. Allows dairy and eggs.',
    },
    lacto_vegetarian: {
      es: 'No incluye carne, pescado ni huevo. Sí permite lácteos.',
      en: 'No meat, fish or eggs. Allows dairy.',
    },
    ovo_vegetarian: {
      es: 'No incluye carne, pescado ni lácteos. Sí permite huevo.',
      en: 'No meat, fish or dairy. Allows eggs.',
    },
    vegan: {
      es: 'No incluye alimentos de origen animal. Se basa en plantas.',
      en: 'No animal foods. Fully plant-based.',
    },
  };
  return map[diet]?.[lang] || '';
}

function parseCsv(value: string) {
  return value
    .split(',')
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

function calculateBMI(weightKg: number, heightCm: number) {
  const h = heightCm / 100;
  if (!weightKg || !h) return 0;
  return weightKg / (h * h);
}

function bmiLabel(bmi: number, lang: Lang) {
  if (!bmi) return lang === 'es' ? 'Sin datos' : 'No data';
  if (bmi < 18.5) return lang === 'es' ? 'Bajo peso' : 'Underweight';
  if (bmi < 25) return lang === 'es' ? 'Rango normal' : 'Normal range';
  if (bmi < 30) return lang === 'es' ? 'Sobrepeso' : 'Overweight';
  return lang === 'es' ? 'Obesidad' : 'Obesity';
}

function estimateCalories(profile: Profile) {
  const weightKg = Number(profile?.current_weight_kg || 0);
  const heightCm = Number(profile?.height_cm || 0);
  const age = Number(profile?.age || 30);
  const sex = profile?.sex || 'other';
  const activity = profile?.routine?.activityLevel || 'light';
  const goalType = profile?.routine?.goalType || 'lose';
  const goalWeeks = Number(profile?.routine?.goalWeeks || 12);
  const goalKg = Number(profile?.goal_weight_kg || weightKg);

  if (!weightKg || !heightCm) return { bmr: 0, tdee: 0, target: 0, dailyDelta: 0 };

  const sexAdj = sex === 'female' ? -161 : sex === 'male' ? 5 : -78;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + sexAdj;
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  const tdee = bmr * (multipliers[activity] || 1.375);
  const kgDiff = goalKg - weightKg;
  const totalCalChange = kgDiff * 7700;
  const dailyDeltaFromTime = goalWeeks > 0 ? totalCalChange / (goalWeeks * 7) : 0;
  let target = tdee;

  if (goalType === 'lose') target = tdee + Math.min(-250, dailyDeltaFromTime || -500);
  if (goalType === 'gain') target = tdee + Math.max(250, dailyDeltaFromTime || 300);
  if (goalType === 'maintain') target = tdee;

  target = Math.max(1200, Math.round(target));
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), target, dailyDelta: Math.round(target - tdee) };
}

function mealLogKey(log: any) {
  return `${log.profile_id}__${log.meal_id}__${log.meal_date}`;
}

function mealKey(profileId: string, meal: any) {
  const date = meal.date || new Date().toISOString().slice(0, 10);
  return `${profileId}__${meal.id}__${date}`;
}

function groupCaloriesByDay(logs: any[]) {
  const map = new Map<string, number>();
  logs.forEach((l) => {
    const day = l.meal_date || String(l.eaten_at || '').slice(0, 10);
    map.set(day, (map.get(day) || 0) + Number(l.calories || 0));
  });
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [lang, setLang] = useState<Lang>('es');
  const [tab, setTab] = useState('today');
  const [todayMode, setTodayMode] = useState<'today' | 'week'>('today');
  const [householdId, setHouseholdId] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState('');
  const [plans, setPlans] = useState<WeeklyPlan[]>([]);
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [toast, setToast] = useState('');
  const [editingProfiles, setEditingProfiles] = useState<Record<string, boolean>>({});
  const [marketProfiles, setMarketProfiles] = useState<string[]>([]);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [productResult, setProductResult] = useState('');
  const [productPhotos, setProductPhotos] = useState<string[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [waterTodayMl, setWaterTodayMl] = useState(0);
  const [mealLogs, setMealLogs] = useState<any[]>([]);
  const [showSplash, setShowSplash] = useState(true);
  const [lastSwap, setLastSwap] = useState<any>(null);

  const L = UI[lang];

  useEffect(() => {
    const savedLang = (localStorage.getItem('dietapp_lang') as Lang) || 'es';
    setLang(savedLang);

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) location.href = '/login';
      else setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) location.href = '/login';
      else setSession(nextSession);
    });

    const savedWater = localStorage.getItem(`dietapp_water_${new Date().toISOString().slice(0, 10)}`);
    if (savedWater) setWaterTodayMl(Number(savedWater || 0));

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('dietapp_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (session) boot();
  }, [session]);

  useEffect(() => {
    localStorage.setItem(`dietapp_water_${new Date().toISOString().slice(0, 10)}`, String(waterTodayMl));
  }, [waterTodayMl]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
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

  async function loadAll(hid: string) {
    const { data: profs, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('household_id', hid)
      .order('created_at');

    const { data: pls } = await supabase
      .from('weekly_plans')
      .select('*')
      .eq('household_id', hid)
      .eq('week_start', mondayISO());

    const { data: rem } = await supabase
      .from('reminders')
      .select('*')
      .eq('household_id', hid)
      .eq('done', false)
      .order('remind_at');

    const since = new Date();
    since.setDate(since.getDate() - 45);

    const { data: logs } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('household_id', hid)
      .gte('meal_date', since.toISOString().slice(0, 10))
      .order('meal_date', { ascending: false });

    if (pErr) notify(`Error cargando perfiles: ${pErr.message}`);

    setProfiles(profs || []);
    setPlans(pls || []);
    setReminders(rem || []);
    setMealLogs(logs || []);
    if ((profs || []).length && !activeProfileId) setActiveProfileId(profs![0].id);
  }

  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const activePlan = plans.find((p) => p.profile_id === activeProfileId);
  const activeUnitPrefs = activeProfile?.unit_prefs || defaultUnits;
  const activeReminderPrefs = {
    ...defaultReminders,
    ...(activeProfile?.routine?.reminders || {}),
  };

  function dishById(id: string) {
    return (DISHES as any).find((d: any) => d.id === id);
  }

  function isWorkMeal(meal: Meal, profile: Profile) {
    const routine = profile?.routine || {};
    const normalized = normalizeToEsDay(meal.day);
    return (routine.workDays || []).map(normalizeToEsDay).includes(normalized);
  }

  function compatibleDishes(profile: Profile) {
    const dt = profile?.diet_type || 'carnivore_flexible';
    const avoided = (profile?.routine?.avoidedFoods || []).map((x: string) => x.toLowerCase());
    const preferred = (profile?.routine?.preferredFoods || []).map((x: string) => x.toLowerCase());

    let filtered = (DISHES as any).filter((d: any) => {
      const tags = d.diet_tags || [];
      let dietOk = false;

      if (dt === 'vegan') dietOk = tags.includes('vegan');
      else if (dt.includes('carnivore') || dt === 'animal_based') {
        dietOk = dt === 'carnivore_strict'
          ? tags.includes('carnivore_strict')
          : tags.some((x: string) => x.includes('carnivore') || x === 'animal_based' || x === 'keto_carnivore');
      } else {
        dietOk = tags.some((x: string) =>
          ['lacto_ovo_vegetarian', 'lacto_vegetarian', 'ovo_vegetarian', 'vegan'].includes(x)
        );
      }

      if (!dietOk) return false;

      if (avoided.length) {
        const text = [
          ...(d.ingredients_es || []),
          ...(d.ingredients_en || []),
          d.name_es || '',
          d.name_en || '',
        ]
          .join(' ')
          .toLowerCase();

        const hasAvoided = avoided.some((f: string) => text.includes(f));
        if (hasAvoided) return false;
      }

      return true;
    });

    if (preferred.length) {
      filtered = filtered.sort((a: any, b: any) => {
        const aText = [...(a.ingredients_es || []), ...(a.ingredients_en || []), a.name_es || '', a.name_en || '']
          .join(' ')
          .toLowerCase();
        const bText = [...(b.ingredients_es || []), ...(b.ingredients_en || []), b.name_es || '', b.name_en || '']
          .join(' ')
          .toLowerCase();

        const aScore = preferred.filter((f: string) => aText.includes(f)).length;
        const bScore = preferred.filter((f: string) => bText.includes(f)).length;
        return bScore - aScore;
      });
    }

    return filtered;
  }

  async function addProfile() {
    const name = prompt(L.profileNamePrompt);
    if (!name) return;

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        household_id: householdId,
        name,
        sex: 'other',
        age: 30,
        height_cm: 170,
        current_weight_kg: 90,
        goal_weight_kg: 80,
        pace_lb_per_week: 1,
        diet_type: profiles.length === 0 ? 'carnivore_flexible' : 'lacto_ovo_vegetarian',
        unit_prefs: activeProfile?.unit_prefs || defaultUnits,
        routine: {
          workPattern: '4_work_3_off',
          workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves'],
          wakeWork: '15:00',
          startWork: '18:00',
          breakWork: '22:00',
          endWork: '04:30',
          wakeOff: '09:00',
          sleepOff: '23:00',
          mealsWork: 3,
          mealsOff: 3,
          reminders: defaultReminders,
          avoidedFoods: [],
          preferredFoods: [],
        },
      })
      .select()
      .single();

    if (error) {
      notify(`No se pudo crear: ${error.message}`);
      return;
    }

    setActiveProfileId(data.id);
    setEditingProfiles((prev) => ({ ...prev, [data.id]: true }));
    await loadAll(householdId);
    notify(L.created);
  }

  async function deleteProfile(id: string) {
    if (!confirm(lang === 'es' ? '¿Eliminar este perfil?' : 'Delete this profile?')) return;

    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      notify(`No se pudo eliminar: ${error.message}`);
      return;
    }

    await loadAll(householdId);
    notify(L.deleted);
  }

  async function saveProfile(profile: Profile) {
    const { error } = await supabase.from('profiles').update(profile).eq('id', profile.id);
    if (error) {
      notify(`No se pudo guardar: ${error.message}`);
      return;
    }

    setEditingProfiles((prev) => ({ ...prev, [profile.id]: false }));
    await loadAll(householdId);
    notify(L.saveSuccess);
  }

  async function updateAllProfiles(mutator: (p: Profile) => any) {
    if (!profiles.length) return;
    await Promise.all(
      profiles.map((p) => supabase.from('profiles').update(mutator(p)).eq('id', p.id))
    );
    await loadAll(householdId);
  }

  async function updateGlobalUnits(nextUnits: any) {
    await updateAllProfiles((p) => ({
      unit_prefs: { ...(p.unit_prefs || defaultUnits), ...nextUnits },
    }));
    buildMarket(marketProfiles, true);
    notify(L.updateSuccess);
  }

  async function toggleGlobalLanguage() {
    const next = lang === 'es' ? 'en' : 'es';
    setLang(next);
    localStorage.setItem('dietapp_lang', next);
    notify(next === 'es' ? 'Idioma cambiado ✅' : 'Language changed ✅');
  }

  async function toggleBodyUnit() {
    const next = activeUnitPrefs.bodyWeight === 'lb' ? 'kg' : 'lb';
    await updateGlobalUnits({ bodyWeight: next, solid: next === 'lb' ? 'lb' : 'kg' });
  }

  async function generatePlan(profile: Profile) {
    const choices = compatibleDishes(profile);
    if (!choices.length) {
      notify(L.noCompatible);
      return;
    }

    const weekStart = mondayISO();
    const meals: Meal[] = [];
    const routine = profile.routine || {};
    const workDays = (routine.workDays || []).map(normalizeToEsDay);

    for (const [index, dayEs] of DAY_NAMES_ES.entries()) {
      const isWork = workDays.includes(dayEs);
      const dayLabel = lang === 'es' ? dayEs : DAY_NAMES_EN[index];
      const mealCount = isWork ? Number(routine.mealsWork || 3) : Number(routine.mealsOff || 3);
      const times = isWork
        ? [routine.wakeWork || '15:00', routine.startWork || '18:00', routine.breakWork || '22:00', routine.endWork || '04:30']
        : [routine.wakeOff || '09:00', '14:00', '19:00', routine.sleepOff || '23:00'];

      for (let i = 0; i < mealCount; i++) {
        const d = choices[(i + dayEs.length + meals.length) % choices.length];
        meals.push({
          id: crypto.randomUUID(),
          day: dayLabel,
          day_es: dayEs,
          date: dateForIndex(weekStart, index).toISOString().slice(0, 10),
          time: times[i] || times[0],
          slot: `${L.meal} ${i + 1}`,
          workMeal: isWork,
          dishId: d.id,
        });
      }
    }

    const payload = {
      household_id: householdId,
      profile_id: profile.id,
      week_start: weekStart,
      data: { meals },
    };

    const existing = plans.find((p) => p.profile_id === profile.id);
    const result = existing
      ? await supabase.from('weekly_plans').update(payload).eq('id', existing.id)
      : await supabase.from('weekly_plans').insert(payload);

    if (result.error) {
      notify(`No se pudo generar: ${result.error.message}`);
      return;
    }

    await loadAll(householdId);
    setTab('today');
    setTodayMode('today');
    notify(L.weekGenerated);
  }

  async function undoDishChange() {
    if (!lastSwap) return;
    const currentPlan = plans.find((p) => p.id === lastSwap.planId);
    if (!currentPlan) return;

    currentPlan.data.meals = currentPlan.data.meals.map((m: any) =>
      m.id === lastSwap.mealId ? { ...m, dishId: lastSwap.oldDishId } : m
    );

    const { error } = await supabase.from('weekly_plans').update({ data: currentPlan.data }).eq('id', currentPlan.id);
    if (!error) {
      setLastSwap(null);
      await loadAll(householdId);
      notify(L.dishUndo);
    }
  }

  async function changeDish(meal: Meal, profile: Profile) {
    const sure = confirm(L.confirmDishChange);
    if (!sure) return;

    const choices = compatibleDishes(profile).filter((d: any) => d.id !== meal.dishId);
    const currentPlan = plans.find((p) => p.profile_id === profile.id);
    if (!currentPlan || choices.length === 0) return;

    const newDish = choices[Math.floor(Math.random() * choices.length)];
    const oldDishId = meal.dishId;
    currentPlan.data.meals = currentPlan.data.meals.map((m: any) =>
      m.id === meal.id ? { ...m, dishId: newDish.id } : m
    );

    const { error } = await supabase.from('weekly_plans').update({ data: currentPlan.data }).eq('id', currentPlan.id);
    if (error) {
      notify(`No se pudo cambiar: ${error.message}`);
      return;
    }

    setLastSwap({ planId: currentPlan.id, mealId: meal.id, oldDishId, newDishId: newDish.id });
    await loadAll(householdId);
    notify(`${L.dishChanged} · ${L.undo}`);
  }

  function addWater(amount: number) {
    setWaterTodayMl((prev) => prev + amount);
    notify(`${amount} ml ✅`);
  }

  function buildMarket(selectedIds: string[], keepChecks = false) {
    const preferredSolidUnit = activeUnitPrefs.solid || 'lb';
    const prevMap = new Map(marketItems.map((x) => [x.key, x]));
    const map = new Map<string, MarketItem>();

    plans
      .filter((p) => selectedIds.includes(p.profile_id))
      .forEach((plan) => {
        const prof = profiles.find((p) => p.id === plan.profile_id);
        (plan.data.meals || []).forEach((meal: any) => {
          const d = dishById(meal.dishId);
          if (!d) return;

          (d.shopping_items || []).forEach((ing: any) => {
            const name = ing.name || '';
            const unit = ing.unit || 'item';
            const amount = Number(ing.amount || 1);
            const key = `${name.toLowerCase()}__${unit}`;
            const usedLine = `${prof?.name || 'Perfil'} · ${meal.day} · ${getDishName(d, lang)}`;
            const suggestions = lang === 'es' ? d.replacements_es || [] : d.replacements_en || [];

            if (!map.has(key)) {
              const prev = prevMap.get(key);
              map.set(key, {
                key,
                name,
                amount,
                unit,
                display: '',
                found: keepChecks ? !!prev?.found : false,
                missing: keepChecks ? !!prev?.missing : false,
                replacement: keepChecks ? prev?.replacement || '' : '',
                suggestions,
                usedIn: [usedLine],
              });
            } else {
              const current = map.get(key)!;
              current.amount += amount;
              current.usedIn.push(usedLine);
            }
          });
        });
      });

    const nextItems = Array.from(map.values()).map((item) => ({
      ...item,
      display: translateShoppingDisplay(item.amount, item.unit, preferredSolidUnit),
    }));

    setMarketItems(nextItems);
    notify(L.shoppingUpdated);
  }

  function toggleMarketProfile(id: string, checked: boolean) {
    const next = checked ? [...marketProfiles, id] : marketProfiles.filter((x) => x !== id);
    setMarketProfiles(next);
  }

  function toggleFound(index: number) {
    setMarketItems((items) =>
      items.map((item, i) => (i === index ? { ...item, found: !item.found, missing: false } : item))
    );
  }

  function markMissing(index: number) {
    setMarketItems((items) =>
      items.map((item, i) => (i === index ? { ...item, missing: !item.missing, found: false } : item))
    );
  }

  function setReplacement(index: number, replacement: string) {
    setMarketItems((items) => items.map((item, i) => (i === index ? { ...item, replacement } : item)));
    notify(L.replacementAdded);
  }

  function addManualMarketItem() {
    const name = prompt(L.manualPrompt);
    if (!name) return;

    setMarketItems((prev) => [
      ...prev,
      {
        key: `manual_${Date.now()}`,
        name,
        amount: 1,
        unit: 'item',
        display: '1 item',
        found: false,
        missing: false,
        replacement: '',
        suggestions: [],
        usedIn: ['Manual'],
      },
    ]);

    notify(L.productAdded);
  }

  function exportWhatsapp() {
    const text = [
      lang === 'es' ? 'DietApp — Mandado semanal' : 'DietApp — Weekly groceries',
      '',
      ...marketItems.map((i) => {
        const check = i.found ? '✅' : i.missing ? '❌' : '•';
        const replacement = i.replacement ? ` (${lang === 'es' ? 'reemplazo' : 'replacement'}: ${i.replacement})` : '';
        return `${check} ${i.name} — ${i.display}${replacement}`;
      }),
    ].join('\n');

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  async function analyzeProduct() {
    if (!activeProfile || !productPhotos.length) {
      notify(lang === 'es' ? 'Toma al menos una foto del producto' : 'Take at least one product photo');
      return;
    }

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
    const collected: string[] = [];
    files.slice(0, 3).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        collected.push(String(ev.target?.result));
        setProductPhotos((prev) => [...prev, String(ev.target?.result)].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
  }

  async function markMealEaten(meal: Meal, profile: Profile) {
    const d = dishById(meal.dishId);
    if (!d || !profile) return;

    const plan = plans.find((p) => p.profile_id === profile.id);
    const mealDate = meal.date || new Date().toISOString().slice(0, 10);

    const { error } = await supabase.from('meal_logs').upsert({
      household_id: householdId,
      profile_id: profile.id,
      weekly_plan_id: plan?.id || null,
      meal_id: meal.id,
      dish_id: d.id,
      dish_name: getDishName(d, lang),
      meal_date: mealDate,
      calories: Number(d.calories || 0),
      protein_g: Number(d.protein_g || 0),
      carbs_g: Number(d.carbs_g || 0),
      fat_g: Number(d.fat_g || 0),
      helped_goal_note: lang === 'es' ? 'Comida registrada' : 'Meal logged',
    }, { onConflict: 'profile_id,meal_id,meal_date' });

    if (error) {
      notify(`No se pudo registrar comida: ${error.message}`);
      return;
    }

    await loadAll(householdId);
    notify(lang === 'es' ? 'Comida marcada como comida ✅' : 'Meal marked as eaten ✅');
  }

  async function addReminder() {
    const title = prompt(L.reminderPrompt);
    if (!title) return;

    const remind_at = prompt(L.reminderDatePrompt);
    if (!remind_at) return;

    const { error } = await supabase.from('reminders').insert({
      household_id: householdId,
      profile_id: activeProfileId || null,
      title,
      remind_at,
    });

    if (error) {
      notify(`No se pudo guardar: ${error.message}`);
      return;
    }

    try {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('DietApp', { body: title });
      }
    } catch {}

    await loadAll(householdId);
    notify(L.reminderSaved);
  }

  async function logException() {
    const item = prompt(L.exceptionPrompt);
    if (!item || !activeProfile) return;

    const { error } = await supabase.from('exceptions').insert({
      household_id: householdId,
      profile_id: activeProfile.id,
      item,
    });

    if (error) {
      notify(`No se pudo registrar: ${error.message}`);
      return;
    }

    notify(L.exceptionSaved);
  }

  const foundItems = marketItems.filter((x) => x.found);
  const pendingItems = marketItems.filter((x) => !x.found);

  if (showSplash) {
    return (
      <main className="shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: 70 }}>🥗</div>
          <h1>DietApp</h1>
          <p style={{ marginTop: -6 }}>by: Roberto Figueroa</p>
          <div className="notice">{lang === 'es' ? 'Preparando tu plan...' : 'Preparing your plan...'}</div>
        </div>
      </main>
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
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <button className="btn secondary small" onClick={toggleGlobalLanguage}>
              <Languages size={16} />
              {lang.toUpperCase()}
            </button>

            <button className="btn secondary small" onClick={toggleBodyUnit}>
              {activeUnitPrefs.bodyWeight || 'lb'}
            </button>
          </div>
        </div>
      </header>

      <main className="shell">
        {lastSwap && (
          <div className="card success">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <div>{lang === 'es' ? 'El plato cambió. Puedes deshacer si te arrepentiste.' : 'The meal changed. You can undo it if you regret it.'}</div>
              <button className="btn small" onClick={undoDishChange}>
                <Undo2 size={15} />
                {L.undo}
              </button>
            </div>
          </div>
        )}

        {tab === 'today' && (
          <TodayView
            L={L}
            lang={lang}
            mode={todayMode}
            setMode={setTodayMode}
            activeProfile={activeProfile}
            activePlan={activePlan}
            dishById={dishById}
            changeDish={changeDish}
            setSelectedDish={setSelectedDish}
            generatePlan={generatePlan}
            isWorkMeal={isWorkMeal}
            waterTodayMl={waterTodayMl}
            addWater={addWater}
            activeReminderPrefs={activeReminderPrefs}
            mealLogs={mealLogs}
            markMealEaten={markMealEaten}
          />
        )}

        {tab === 'plan' && (
          <PlanView
            L={L}
            lang={lang}
            profiles={profiles}
            plans={plans}
            dishById={dishById}
            changeDish={changeDish}
            setSelectedDish={setSelectedDish}
            generatePlan={generatePlan}
            isWorkMeal={isWorkMeal}
          />
        )}

        {tab === 'market' && (
          <MarketView
            L={L}
            profiles={profiles}
            marketProfiles={marketProfiles}
            pendingItems={pendingItems}
            foundItems={foundItems}
            toggleMarketProfile={toggleMarketProfile}
            buildMarket={buildMarket}
            toggleFound={toggleFound}
            markMissing={markMissing}
            setReplacement={setReplacement}
            addManualMarketItem={addManualMarketItem}
            exportWhatsapp={exportWhatsapp}
            handlePhoto={handlePhoto}
            productPhotos={productPhotos}
            analyzeProduct={analyzeProduct}
            productResult={productResult}
          />
        )}

        {tab === 'settings' && (
          <SettingsView
            L={L}
            lang={lang}
            profiles={profiles}
            activeProfile={activeProfile}
            editingProfiles={editingProfiles}
            setEditingProfiles={setEditingProfiles}
            addProfile={addProfile}
            deleteProfile={deleteProfile}
            saveProfile={saveProfile}
            updateGlobalUnits={updateGlobalUnits}
          />
        )}

        {tab === 'history' && (
          <HistoryView
            L={L}
            lang={lang}
            reminders={reminders}
            addReminder={addReminder}
            logException={logException}
            activeProfile={activeProfile}
            profiles={profiles}
            mealLogs={mealLogs}
            activeUnitPrefs={activeUnitPrefs}
          />
        )}
      </main>

      {selectedDish && (
        <RecipeModal
          L={L}
          dish={selectedDish}
          lang={lang}
          onClose={() => setSelectedDish(null)}
        />
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

function WelcomeCard({ L, onCreate }: any) {
  return (
    <div className="card empty-state">
      <div className="big">👋</div>
      <h2>{L.welcome}</h2>
      <p>{L.welcomeDesc}</p>
      <button className="btn" onClick={onCreate}>
        <UserPlus size={18} />
        {L.createFirstProfile}
      </button>
    </div>
  );
}

function TodayView(props: any) {
  const { L, lang, mode, setMode, activeProfile, activePlan, dishById, changeDish, setSelectedDish, generatePlan, isWorkMeal, waterTodayMl, addWater, activeReminderPrefs, mealLogs, markMealEaten } = props;

  if (!activeProfile) return <WelcomeCard L={L} onCreate={() => {}} />;

  const todayEs = todayDayName('es');
  const todayEn = todayDayName('en');
  const meals = activePlan?.data?.meals || [];
  const todayMeals = meals.filter((m: any) => normalizeToEsDay(m.day_es || m.day) === normalizeToEsDay(todayEs));
  const eatenSet = new Set((mealLogs || []).map(mealLogKey));
  const pendingTodayMeals = todayMeals.filter((m: any) => !eatenSet.has(mealKey(activeProfile.id, m)));
  const eatenTodayMeals = todayMeals.filter((m: any) => eatenSet.has(mealKey(activeProfile.id, m)));
  const waterGoal = Number(activeReminderPrefs.dailyWaterMl || 3000);

  return (
    <section>
      <div className="card">
        <h1>{L.todayMeals}</h1>
        <p>
          {L.profile}: <b>{activeProfile.name}</b> · {L.diet}: <b>{dietLabel(activeProfile.diet_type, lang)}</b>
        </p>

        <div className="actions">
          <button className={`btn ${mode === 'today' ? '' : 'secondary'}`} onClick={() => setMode('today')}>
            {L.home}
          </button>
          <button className={`btn ${mode === 'week' ? '' : 'secondary'}`} onClick={() => setMode('week')}>
            {L.viewWeek}
          </button>
          <button className="btn outline" onClick={() => generatePlan(activeProfile)}>
            <CalendarDays size={17} />
            {L.generateWeek}
          </button>
        </div>
      </div>

      <div className="card">
        <h2>💧 {L.waterToday}</h2>
        <span className="badge blue">{L.waterGoal}: {waterGoal} ml</span>
        <span className="badge">{waterTodayMl} ml</span>
        <div className="actions">
          <button className="btn secondary small" onClick={() => addWater(250)}>+250 ml</button>
          <button className="btn secondary small" onClick={() => addWater(500)}>+500 ml</button>
          <button className="btn secondary small" onClick={() => addWater(1000)}>+1 L</button>
        </div>
      </div>

      {!activePlan && (
        <div className="card empty-state">
          <div className="big">📅</div>
          <h2>{L.noPlan}</h2>
          <p>{L.noPlanDesc}</p>
          <button className="btn" onClick={() => generatePlan(activeProfile)}>
            {L.generateWeek}
          </button>
        </div>
      )}

      {activePlan && mode === 'today' && (
        <div className="card">
          <h2>{formatDateLong(new Date(), lang)}</h2>
          {(activeProfile.routine?.workDays || []).map(normalizeToEsDay).includes(todayEs) ? (
            <span className="badge orange">{L.workDay}</span>
          ) : (
            <span className="badge blue">{L.offDay}</span>
          )}

          {pendingTodayMeals.length === 0 ? (
            <p className="notice">{lang === 'es' ? 'Ya no hay comidas pendientes para hoy.' : 'No pending meals left today.'}</p>
          ) : (
            pendingTodayMeals.map((meal: any) => {
              const d = dishById(meal.dishId);
              return (
                <DishCard
                  key={meal.id}
                  L={L}
                  lang={lang}
                  d={d}
                  meal={meal}
                  workMeal={isWorkMeal(meal, activeProfile)}
                  onView={() => setSelectedDish(d)}
                  onChange={() => changeDish(meal, activeProfile)}
                  onEaten={() => markMealEaten(meal, activeProfile)}
                />
              );
            })
          )}

          {!!eatenTodayMeals.length && (
            <details style={{ marginTop: 16 }}>
              <summary className="muted">{lang === 'es' ? 'Comidas ya marcadas como comidas' : 'Meals already marked eaten'}</summary>
              {eatenTodayMeals.map((meal: any) => {
                const d = dishById(meal.dishId);
                return (
                  <DishCard
                    key={meal.id}
                    L={L}
                    lang={lang}
                    d={d}
                    meal={meal}
                    workMeal={isWorkMeal(meal, activeProfile)}
                    onView={() => setSelectedDish(d)}
                    onChange={() => changeDish(meal, activeProfile)}
                    eaten
                  />
                );
              })}
            </details>
          )}
        </div>
      )}

      {activePlan && mode === 'week' && (
        <WeekPlan
          L={L}
          lang={lang}
          plan={activePlan}
          profile={activeProfile}
          dishById={dishById}
          changeDish={changeDish}
          setSelectedDish={setSelectedDish}
          isWorkMeal={isWorkMeal}
        />
      )}
    </section>
  );
}

function PlanView(props: any) {
  const { L, lang, profiles, plans, dishById, changeDish, setSelectedDish, generatePlan, isWorkMeal } = props;
  const [filter, setFilter] = useState('all');

  if (!profiles.length) return <WelcomeCard L={L} onCreate={() => {}} />;

  const visibleProfiles = filter === 'all' ? profiles : profiles.filter((p: any) => p.id === filter);

  return (
    <section>
      <div className="card">
        <h1>{L.weeklyPlan}</h1>
        <p>{L.reviewWeek}</p>

        <div className="actions">
          <button className={`btn ${filter === 'all' ? '' : 'secondary'}`} onClick={() => setFilter('all')}>
            {L.allProfiles}
          </button>
          {profiles.map((p: any) => (
            <button key={p.id} className={`btn ${filter === p.id ? '' : 'secondary'}`} onClick={() => setFilter(p.id)}>
              {p.name}
            </button>
          ))}
        </div>

        <div className="actions">
          {profiles.map((p: any) => (
            <button key={p.id} className="btn outline" onClick={() => generatePlan(p)}>
              {L.generateWeek}: {p.name}
            </button>
          ))}
        </div>
      </div>

      {visibleProfiles.map((p: any) => {
        const plan = plans.find((pl: any) => pl.profile_id === p.id);
        if (!plan) return null;

        return (
          <WeekPlan
            key={p.id}
            L={L}
            lang={lang}
            plan={plan}
            profile={p}
            dishById={dishById}
            changeDish={changeDish}
            setSelectedDish={setSelectedDish}
            isWorkMeal={isWorkMeal}
          />
        );
      })}
    </section>
  );
}

function WeekPlan({ L, lang, plan, profile, dishById, changeDish, setSelectedDish, isWorkMeal }: any) {
  const workDays = (profile.routine?.workDays || []).map(normalizeToEsDay);

  return (
    <div className="card">
      <h2>{profile.name}</h2>
      <p>{dietLabel(profile.diet_type, lang)}</p>
      <span className="badge">{L.weekRange}: {formatWeekRange(plan.week_start, lang)}</span>

      {DAY_NAMES_ES.map((dayEs, index) => {
        const dayLabel = getDayByIndex(index, lang);
        const meals = (plan.data.meals || []).filter((m: any) => normalizeToEsDay(m.day_es || m.day) === dayEs);
        const isWork = workDays.includes(dayEs);

        return (
          <div key={dayEs} style={{ marginTop: 18 }}>
            <h3>{formatDateLong(dateForIndex(plan.week_start, index), lang)}</h3>
            {isWork ? <span className="badge orange">{L.workDay}</span> : <span className="badge blue">{L.offDay}</span>}

            {meals.map((meal: any) => {
              const d = dishById(meal.dishId);
              return (
                <DishCard
                  key={meal.id}
                  L={L}
                  lang={lang}
                  d={d}
                  meal={meal}
                  workMeal={isWorkMeal(meal, profile)}
                  onView={() => setSelectedDish(d)}
                  onChange={() => changeDish(meal, profile)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function DishCard({ L, lang, d, meal, workMeal, onView, onChange, onEaten, eaten }: any) {
  if (!d) return null;

  return (
    <div className="card dish-card">
      <img src={d.image_url || '/dishes/placeholder-meal.jpg'} alt={getDishName(d, lang)} />
      <div style={{ flex: 1 }}>
        <div className="muted">
          {meal.time} · {meal.slot}
        </div>
        <h3>{getDishName(d, lang)}</h3>
        <span className="badge">{d.calories} cal</span>
        <span className="badge blue">{d.protein_g}g</span>
        <span className="badge orange">{d.total_minutes} min</span>
        {d.portable && <span className="badge">{L.portable}</span>}
        {workMeal && <span className="badge orange">{L.forWorkMeal}</span>}

        <div className="actions">
          <button className="btn small secondary" onClick={onView}>
            <Eye size={15} />
            {L.recipe}
          </button>
          {!eaten && onEaten && (
            <button className="btn small" onClick={onEaten}>
              <Check size={15} />
              {lang === 'es' ? 'Ya comí' : 'I ate this'}
            </button>
          )}
          <button className="btn small outline" onClick={onChange}>
            <RefreshCw size={15} />
            {L.changeDish}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsView(props: any) {
  const { L, lang, profiles, activeProfile, editingProfiles, setEditingProfiles, addProfile, deleteProfile, saveProfile, updateGlobalUnits } = props;
  const units = activeProfile?.unit_prefs || defaultUnits;
  const [openUnits, setOpenUnits] = useState(false);
  const [openProfiles, setOpenProfiles] = useState(true);

  return (
    <section>
      <div className="card">
        <h1>{L.configuration}</h1>
        <p>{L.configDesc}</p>

        <div className="card" style={{ boxShadow: 'none' }}>
          <div className="profile-summary">
            <div>
              <h3>{L.quickUnits}</h3>
              <p className="muted">{lang === 'es' ? 'Se aplican en toda la app.' : 'Applied to the entire app.'}</p>
            </div>
            <button className="btn secondary small" onClick={() => setOpenUnits(!openUnits)}>
              {openUnits ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {openUnits && (
            <div className="grid">
              <div className="col6">
                <label>{L.bodyWeight}</label>
                <select value={units.bodyWeight || 'lb'} onChange={(e) => updateGlobalUnits({ bodyWeight: e.target.value })}>
                  {['lb', 'kg'].map((u) => <option key={u} value={u}>{unitOptionLabel(u, lang)}</option>)}
                </select>
              </div>

              <div className="col6">
                <label>{L.solids}</label>
                <select value={units.solid || 'lb'} onChange={(e) => updateGlobalUnits({ solid: e.target.value })}>
                  {['lb', 'oz', 'kg', 'g'].map((u) => <option key={u} value={u}>{unitOptionLabel(u, lang)}</option>)}
                </select>
              </div>

              <div className="col6">
                <label>{L.liquids}</label>
                <select value={units.liquid || 'l'} onChange={(e) => updateGlobalUnits({ liquid: e.target.value })}>
                  {['l', 'ml', 'fl_oz', 'gal'].map((u) => <option key={u} value={u}>{unitOptionLabel(u, lang)}</option>)}
                </select>
              </div>

              <div className="col6">
                <label>{L.cooking}</label>
                <select value={units.cooking || 'cup'} onChange={(e) => updateGlobalUnits({ cooking: e.target.value })}>
                  {['cup', 'tbsp', 'tsp', 'ml'].map((u) => <option key={u} value={u}>{unitOptionLabel(u, lang)}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="profile-summary">
          <div>
            <h2>{L.profiles}</h2>
            <p>{L.profilesDesc}</p>
          </div>
          <div className="actions">
            <button className="btn secondary small" onClick={() => setOpenProfiles(!openProfiles)}>
              {openProfiles ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button className="btn" onClick={addProfile}>
              <Plus size={17} />
              {L.addProfile}
            </button>
          </div>
        </div>

        {!profiles.length && <WelcomeCard L={L} onCreate={addProfile} />}

        {openProfiles &&
          profiles.map((p: any) => (
            <ProfileRow
              key={p.id}
              L={L}
              lang={lang}
              p={p}
              isEditing={!!editingProfiles[p.id]}
              setEditing={(value: boolean) => setEditingProfiles((prev: any) => ({ ...prev, [p.id]: value }))}
              saveProfile={saveProfile}
              deleteProfile={deleteProfile}
            />
          ))}
      </div>

      <footer className="card" style={{ textAlign: 'center', color: 'var(--muted)', boxShadow: 'none' }}>
        <b>dietAPP</b> by: Roberto Figueroa
      </footer>
    </section>
  );
}

function ProfileRow({ L, lang, p, isEditing, setEditing, saveProfile, deleteProfile }: any) {
  const [local, setLocal] = useState<any>(p);
  const [showDietInfo, setShowDietInfo] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [showReminders, setShowReminders] = useState(false);

  useEffect(() => setLocal(p), [p]);

  const units = local.unit_prefs || defaultUnits;
  const reminders = { ...defaultReminders, ...(local.routine?.reminders || {}) };
  const timeline = estimateWeightTimeline(Number(local.current_weight_kg || 0), Number(local.goal_weight_kg || 0), Number(local.pace_lb_per_week || 1));

  return (
    <div className="card" style={{ boxShadow: 'none' }}>
      <div className="profile-summary">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="profile-avatar">👤</div>
          <div>
            <h3>{p.name}</h3>
            <div className="muted">
              {dietLabel(p.diet_type, lang)} · {formatWeightDisplay(Number(p.current_weight_kg || 0), units.bodyWeight || 'lb')} → {formatWeightDisplay(Number(p.goal_weight_kg || 0), units.bodyWeight || 'lb')}
            </div>
          </div>
        </div>

        <button className="btn secondary small" onClick={() => setEditing(!isEditing)}>
          {isEditing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isEditing ? L.close : L.edit}
        </button>
      </div>

      {isEditing && (
        <>
          <label>{lang === 'es' ? 'Nombre' : 'Name'}</label>
          <input value={local.name || ''} onChange={(e) => setLocal({ ...local, name: e.target.value })} />

          <div className="grid">
            <div className="col6">
              <label>{L.currentWeight} ({units.bodyWeight})</label>
              <input
                type="number"
                value={units.bodyWeight === 'lb' ? cleanNumber(kgToLb(Number(local.current_weight_kg || 0))) : local.current_weight_kg || ''}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    current_weight_kg:
                      units.bodyWeight === 'lb' ? cleanNumber(lbToKg(Number(e.target.value || 0))) : Number(e.target.value || 0),
                  })
                }
              />
            </div>

            <div className="col6">
              <label>{L.goalWeight} ({units.bodyWeight})</label>
              <input
                type="number"
                value={units.bodyWeight === 'lb' ? cleanNumber(kgToLb(Number(local.goal_weight_kg || 0))) : local.goal_weight_kg || ''}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    goal_weight_kg:
                      units.bodyWeight === 'lb' ? cleanNumber(lbToKg(Number(e.target.value || 0))) : Number(e.target.value || 0),
                  })
                }
              />
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

          <div className="grid">
            <div className="col6">
              <label>{lang === 'es' ? 'Meta principal' : 'Main goal'}</label>
              <select
                value={local.routine?.goalType || 'lose'}
                onChange={(e) => setLocal({ ...local, routine: { ...local.routine, goalType: e.target.value } })}
              >
                <option value="lose">{lang === 'es' ? 'Bajar de peso' : 'Lose weight'}</option>
                <option value="maintain">{lang === 'es' ? 'Mantener' : 'Maintain'}</option>
                <option value="gain">{lang === 'es' ? 'Subir de peso' : 'Gain weight'}</option>
              </select>
            </div>
            <div className="col6">
              <label>{lang === 'es' ? 'Tiempo para la meta (semanas)' : 'Goal timeline (weeks)'}</label>
              <input
                type="number"
                value={local.routine?.goalWeeks || 12}
                onChange={(e) => setLocal({ ...local, routine: { ...local.routine, goalWeeks: Number(e.target.value || 12) } })}
              />
            </div>
            <div className="col6">
              <label>{lang === 'es' ? 'Actividad' : 'Activity'}</label>
              <select
                value={local.routine?.activityLevel || 'light'}
                onChange={(e) => setLocal({ ...local, routine: { ...local.routine, activityLevel: e.target.value } })}
              >
                <option value="sedentary">{lang === 'es' ? 'Baja' : 'Low'}</option>
                <option value="light">{lang === 'es' ? 'Ligera' : 'Light'}</option>
                <option value="moderate">{lang === 'es' ? 'Moderada' : 'Moderate'}</option>
                <option value="active">{lang === 'es' ? 'Alta' : 'High'}</option>
              </select>
            </div>
            <div className="col6">
              <label>{lang === 'es' ? 'Sexo para cálculo calórico' : 'Sex for calorie estimate'}</label>
              <select value={local.sex || 'other'} onChange={(e) => setLocal({ ...local, sex: e.target.value })}>
                <option value="male">{lang === 'es' ? 'Hombre' : 'Male'}</option>
                <option value="female">{lang === 'es' ? 'Mujer' : 'Female'}</option>
                <option value="other">{lang === 'es' ? 'Otro / prefiero no decir' : 'Other / prefer not to say'}</option>
              </select>
            </div>
          </div>

          <div className="card" style={{ boxShadow: 'none' }}>
            <div className="profile-summary">
              <h3>{L.dietInfo}</h3>
              <button className="btn secondary small" onClick={() => setShowDietInfo(!showDietInfo)}>
                {showDietInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            {showDietInfo && <p>{dietInfo(local.diet_type, lang)}</p>}
          </div>

          <div className="card" style={{ boxShadow: 'none' }}>
            <div className="profile-summary">
              <h3>{L.restrictions}</h3>
              <button className="btn secondary small" onClick={() => setShowRestrictions(!showRestrictions)}>
                {showRestrictions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {showRestrictions && (
              <>
                <label>{L.omitFoods}</label>
                <input
                  value={(local.routine?.avoidedFoods || []).join(', ')}
                  onChange={(e) =>
                    setLocal({
                      ...local,
                      routine: { ...local.routine, avoidedFoods: parseCsv(e.target.value) },
                    })
                  }
                />
                <p className="muted">{L.omitHelp}</p>

                <label>{L.preferFoods}</label>
                <input
                  value={(local.routine?.preferredFoods || []).join(', ')}
                  onChange={(e) =>
                    setLocal({
                      ...local,
                      routine: { ...local.routine, preferredFoods: parseCsv(e.target.value) },
                    })
                  }
                />
                <p className="muted">{L.preferHelp}</p>
              </>
            )}
          </div>

          <h3 style={{ marginTop: 16 }}>{L.routine}</h3>
          <div className="grid">
            <div className="col6">
              <label>{L.wakeWork}</label>
              <input type="time" value={local.routine?.wakeWork || '15:00'} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, wakeWork: e.target.value } })} />
            </div>
            <div className="col6">
              <label>{L.startWork}</label>
              <input type="time" value={local.routine?.startWork || '18:00'} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, startWork: e.target.value } })} />
            </div>
            <div className="col6">
              <label>{L.breakWork}</label>
              <input type="time" value={local.routine?.breakWork || '22:00'} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, breakWork: e.target.value } })} />
            </div>
            <div className="col6">
              <label>{L.endWork}</label>
              <input type="time" value={local.routine?.endWork || '04:30'} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, endWork: e.target.value } })} />
            </div>
            <div className="col6">
              <label>{L.wakeOff}</label>
              <input type="time" value={local.routine?.wakeOff || '09:00'} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, wakeOff: e.target.value } })} />
            </div>
            <div className="col6">
              <label>{L.sleepOff}</label>
              <input type="time" value={local.routine?.sleepOff || '23:00'} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, sleepOff: e.target.value } })} />
            </div>
            <div className="col6">
              <label>{L.mealsWork}</label>
              <input type="number" value={local.routine?.mealsWork || 3} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, mealsWork: Number(e.target.value || 0) } })} />
            </div>
            <div className="col6">
              <label>{L.mealsOff}</label>
              <input type="number" value={local.routine?.mealsOff || 3} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, mealsOff: Number(e.target.value || 0) } })} />
            </div>
          </div>

          <label>{L.workDays}</label>
          <input
            value={(local.routine?.workDays || []).join(', ')}
            onChange={(e) =>
              setLocal({
                ...local,
                routine: {
                  ...local.routine,
                  workDays: e.target.value.split(',').map((x) => normalizeToEsDay(x.trim())).filter(Boolean),
                },
              })
            }
          />

          <div className="card" style={{ boxShadow: 'none' }}>
            <div className="profile-summary">
              <h3>{L.hydrationReminder}</h3>
              <button className="btn secondary small" onClick={() => setShowReminders(!showReminders)}>
                {showReminders ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {showReminders && (
              <>
                <label>
                  <input
                    type="checkbox"
                    checked={!!reminders.enabledMeal}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        routine: {
                          ...local.routine,
                          reminders: { ...reminders, enabledMeal: e.target.checked },
                        },
                      })
                    }
                  />
                  {' '}{L.mealEnabled}
                </label>

                <label>{L.mealBefore}</label>
                <select
                  value={reminders.mealReminderMinutes}
                  onChange={(e) =>
                    setLocal({
                      ...local,
                      routine: {
                        ...local.routine,
                        reminders: { ...reminders, mealReminderMinutes: Number(e.target.value) },
                      },
                    })
                  }
                >
                  {[0, 10, 15, 30, 60].map((m) => (
                    <option key={m} value={m}>{m === 0 ? L.disabled : `${m} ${L.minutes}`}</option>
                  ))}
                </select>

                <label>
                  <input
                    type="checkbox"
                    checked={!!reminders.enabledWater}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        routine: {
                          ...local.routine,
                          reminders: { ...reminders, enabledWater: e.target.checked },
                        },
                      })
                    }
                  />
                  {' '}{L.waterEnabled}
                </label>

                <label>{L.waterEvery}</label>
                <select
                  value={reminders.waterEveryHours}
                  onChange={(e) =>
                    setLocal({
                      ...local,
                      routine: {
                        ...local.routine,
                        reminders: { ...reminders, waterEveryHours: Number(e.target.value) },
                      },
                    })
                  }
                >
                  {[1, 2, 3, 4].map((h) => (
                    <option key={h} value={h}>{h} {L.hours}</option>
                  ))}
                </select>

                <label>{L.hydrationGoal}</label>
                <input
                  type="number"
                  value={reminders.dailyWaterMl}
                  onChange={(e) =>
                    setLocal({
                      ...local,
                      routine: {
                        ...local.routine,
                        reminders: { ...reminders, dailyWaterMl: Number(e.target.value || 0) },
                      },
                    })
                  }
                />

                <label>
                  <input
                    type="checkbox"
                    checked={!!reminders.prepWorkMeal}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        routine: {
                          ...local.routine,
                          reminders: { ...reminders, prepWorkMeal: e.target.checked },
                        },
                      })
                    }
                  />
                  {' '}{L.workPrep}
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={!!reminders.groceryReminder}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        routine: {
                          ...local.routine,
                          reminders: { ...reminders, groceryReminder: e.target.checked },
                        },
                      })
                    }
                  />
                  {' '}{L.groceryReminder}
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={!!reminders.weightReminder}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        routine: {
                          ...local.routine,
                          reminders: { ...reminders, weightReminder: e.target.checked },
                        },
                      })
                    }
                  />
                  {' '}{L.weightReminder}
                </label>
              </>
            )}
          </div>

          {timeline && (
            <p className="notice">
              {L.timeline}: {timeline.weeksMin}-{timeline.weeksMax} {lang === 'es' ? 'semanas' : 'weeks'}.
            </p>
          )}

          <div className="actions">
            <button className="btn" onClick={() => saveProfile(local)}>{L.save}</button>
            <button className="btn danger" onClick={() => deleteProfile(local.id)}>
              <Trash2 size={16} />
              {L.delete}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function MarketView(props: any) {
  const { L, profiles, marketProfiles, pendingItems, foundItems, toggleMarketProfile, buildMarket, toggleFound, markMissing, setReplacement, addManualMarketItem, exportWhatsapp, handlePhoto, productPhotos, analyzeProduct, productResult } = props;
  const [showFound, setShowFound] = useState(false);

  return (
    <section>
      <div className="card">
        <h1>{L.shopping}</h1>
        <p>{L.shoppingDesc}</p>

        <h3>{L.selectedProfiles}</h3>
        <div className="grid">
          {profiles.map((p: any) => (
            <button
              key={p.id}
              className={`btn ${marketProfiles.includes(p.id) ? '' : 'secondary'}`}
              onClick={() => toggleMarketProfile(p.id, !marketProfiles.includes(p.id))}
            >
              {marketProfiles.includes(p.id) ? '✅ ' : ''}{p.name}
            </button>
          ))}
        </div>

        <div className="actions">
          <button className="btn secondary" onClick={() => buildMarket(marketProfiles, true)}>
            <ShoppingCart size={17} />
            {L.updateShopping}
          </button>
          <button className="btn outline" onClick={exportWhatsapp}>{L.sendWhats}</button>
          <button className="btn secondary" onClick={addManualMarketItem}>+ {L.addManual}</button>
        </div>
      </div>

      <div className="grid">
        <div className="col8 card">
          <h2>{L.list}</h2>

          {!pendingItems.length && !foundItems.length && (
            <div className="empty-state">
              <div className="big">🛒</div>
              <p>{L.shoppingEmpty}</p>
            </div>
          )}

          {pendingItems.map((item: any, index: number) => (
            <div key={item.key} className="market-item">
              <button className={`market-check ${item.found ? 'active' : ''}`} onClick={() => toggleFound(index)}>
                {item.found ? <Check size={18} /> : ''}
              </button>

              <div style={{ flex: 1 }}>
                <b>{item.name}</b> — {item.display}
                {item.missing && <span className="badge red">{L.notFound}</span>}
                {item.replacement && <span className="badge orange">{L.replace}: {item.replacement}</span>}

                <details>
                  <summary className="muted">{L.relatedRecipes}</summary>
                  {item.usedIn.map((u: string) => <p className="muted" key={u}>• {u}</p>)}
                </details>

                {item.missing && item.suggestions?.length > 0 && (
                  <div className="actions">
                    {item.suggestions.slice(0, 4).map((s: string) => (
                      <button key={s} className="btn small secondary" onClick={() => setReplacement(index, s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="actions">
                <button className="btn small danger" onClick={() => markMissing(index)}>
                  <X size={14} />
                </button>
                <button
                  className="btn small outline"
                  onClick={() => {
                    const r = prompt(L.replacePrompt);
                    if (r) setReplacement(index, r);
                  }}
                >
                  {L.replace}
                </button>
              </div>
            </div>
          ))}

          {!!foundItems.length && (
            <div style={{ marginTop: 18 }}>
              <button className="btn secondary small" onClick={() => setShowFound(!showFound)}>
                {showFound ? L.hideFound : L.showFound}
              </button>
              <p className="muted">{L.doneBottom}</p>
            </div>
          )}

          {showFound &&
            foundItems.map((item: any) => (
              <div key={item.key} className="market-item found">
                <button className="market-check active" onClick={() => {
                  const originalIndex = pendingItems.length + foundItems.findIndex((x: any) => x.key === item.key);
                  // fallback by key:
                  const allIdx = [...pendingItems, ...foundItems].findIndex((x: any) => x.key === item.key);
                  toggleFound(allIdx);
                }}>
                  <Check size={18} />
                </button>
                <div style={{ flex: 1 }}>
                  <b>{item.name}</b> — {item.display}
                </div>
              </div>
            ))}
        </div>

        <div className="col4 card">
          <h2>📷 {L.analyze}</h2>
          <p className="muted">{L.analyzeDesc}</p>

          <input type="file" accept="image/*" capture="environment" multiple onChange={handlePhoto} />

          <div className="actions">
            {productPhotos.map((p: string, i: number) => (
              <img key={i} src={p} style={{ width: 78, height: 78, objectFit: 'cover', borderRadius: 14 }} />
            ))}
          </div>

          <button className="btn" style={{ width: '100%', marginTop: 10 }} onClick={analyzeProduct}>
            {L.analyzeBtn}
          </button>

          {productResult && <div className="notice" style={{ marginTop: 10 }}>{productResult}</div>}
        </div>
      </div>
    </section>
  );
}

function HistoryView({ L, lang, reminders, addReminder, logException, activeProfile, profiles, mealLogs, activeUnitPrefs }: any) {
  const [range, setRange] = useState<'day' | 'week' | 'month'>('week');
  const selectedLogs = activeProfile ? mealLogs.filter((l: any) => l.profile_id === activeProfile.id) : mealLogs;
  const today = new Date().toISOString().slice(0, 10);
  const todayLogs = selectedLogs.filter((l: any) => l.meal_date === today);
  const todayCalories = todayLogs.reduce((sum: number, l: any) => sum + Number(l.calories || 0), 0);
  const todayProtein = todayLogs.reduce((sum: number, l: any) => sum + Number(l.protein_g || 0), 0);
  const bmi = calculateBMI(Number(activeProfile?.current_weight_kg || 0), Number(activeProfile?.height_cm || 0));
  const cal = activeProfile ? estimateCalories(activeProfile) : { bmr: 0, tdee: 0, target: 0, dailyDelta: 0 };
  const diff = cal.target ? cal.target - todayCalories : 0;
  const grouped = groupCaloriesByDay(selectedLogs).slice(range === 'month' ? -30 : range === 'week' ? -7 : -1);
  const maxCal = Math.max(1, ...grouped.map(([, v]) => v));

  return (
    <section>
      <div className="card">
        <h1>{L.historyTitle}</h1>
        <p>{L.historyDesc}</p>

        <div className="actions">
          <button className="btn secondary" onClick={logException}>{L.logException}</button>
          <button className="btn secondary" onClick={addReminder}>
            <Bell size={16} />
            {L.addReminder}
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="col6 card">
          <h2>{lang === 'es' ? 'Resumen de hoy' : 'Today summary'}</h2>
          <span className="badge orange">{todayCalories} cal</span>
          <span className="badge blue">{todayProtein}g proteína</span>
          {cal.target > 0 && <span className="badge">Meta: {cal.target} cal</span>}
          {cal.target > 0 && (
            <p className="notice">
              {diff >= 0
                ? (lang === 'es' ? `Te quedan aprox. ${diff} calorías para tu meta de hoy.` : `About ${diff} calories left for today's target.`)
                : (lang === 'es' ? `Vas aprox. ${Math.abs(diff)} calorías arriba de tu meta.` : `About ${Math.abs(diff)} calories over target.`)}
            </p>
          )}
        </div>

        <div className="col6 card">
          <h2>{lang === 'es' ? 'IMC y calorías' : 'BMI and calories'}</h2>
          <span className="badge blue">BMI / IMC: {bmi ? bmi.toFixed(1) : '--'}</span>
          <span className="badge">{bmiLabel(bmi, lang)}</span>
          <p className="muted">
            BMR: {cal.bmr || '--'} · TDEE: {cal.tdee || '--'} · {lang === 'es' ? 'Objetivo' : 'Target'}: {cal.target || '--'} cal
          </p>
          <p className="muted">
            {lang === 'es'
              ? 'Estos cálculos son aproximados y sirven como referencia para ajustar tus comidas.'
              : 'These estimates are approximate and help guide meal adjustments.'}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="profile-summary">
          <div>
            <h2>{lang === 'es' ? 'Gráfica de calorías' : 'Calories chart'}</h2>
            <p className="muted">{activeProfile?.name || (lang === 'es' ? 'Todos los perfiles' : 'All profiles')}</p>
          </div>
          <div className="actions">
            <button className={`btn small ${range === 'day' ? '' : 'secondary'}`} onClick={() => setRange('day')}>{lang === 'es' ? 'Día' : 'Day'}</button>
            <button className={`btn small ${range === 'week' ? '' : 'secondary'}`} onClick={() => setRange('week')}>{lang === 'es' ? 'Semana' : 'Week'}</button>
            <button className={`btn small ${range === 'month' ? '' : 'secondary'}`} onClick={() => setRange('month')}>{lang === 'es' ? 'Mes' : 'Month'}</button>
          </div>
        </div>

        {!grouped.length && <p className="notice">{lang === 'es' ? 'Aún no hay comidas registradas.' : 'No meals logged yet.'}</p>}
        <div style={{ display: 'grid', gap: 10 }}>
          {grouped.map(([day, calories]) => (
            <div key={day}>
              <div className="profile-summary">
                <b>{day}</b>
                <span className="badge orange">{calories} cal</span>
              </div>
              <div style={{ height: 14, background: 'var(--orange-soft)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (calories / maxCal) * 100)}%`, height: '100%', background: 'var(--orange)', borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>{L.pendingReminders}</h2>
        {!reminders.length && <p className="muted">{L.noReminders}</p>}
        {reminders.map((r: any) => (
          <p key={r.id}>
            🔔 {r.title}
            <br />
            <span className="muted">{new Date(r.remind_at).toLocaleString()}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

function RecipeModal({ L, dish, lang, onClose }: any) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="card modalbox" onClick={(e) => e.stopPropagation()}>
        <button className="btn secondary small" onClick={onClose}>{L.closeRecipe}</button>

        <img className="recipe-hero" src={dish.image_url || '/dishes/placeholder-meal.jpg'} alt={getDishName(dish, lang)} />

        <h1>{getDishName(dish, lang)}</h1>

        <span className="badge">{dish.calories} cal</span>
        <span className="badge blue">{dish.protein_g}g</span>
        <span className="badge orange">{dish.total_minutes} min</span>
        {dish.portable && <span className="badge">{L.portable}</span>}

        <h2>{L.ingredients}</h2>
        <ul>
          {getDishTextArray(dish, lang, 'ingredients_es', 'ingredients_en').map((i: string) => <li key={i}>{i}</li>)}
        </ul>

        <h2>{L.utensils}</h2>
        <ul>
          {getDishTextArray(dish, lang, 'utensils_es', 'utensils_en').map((i: string) => <li key={i}>{i}</li>)}
        </ul>

        <h2>{L.stepByStep}</h2>
        <ol>
          {getDishTextArray(dish, lang, 'steps_es', 'steps_en').map((i: string) => (
            <li key={i} style={{ marginBottom: 10 }}>{i}</li>
          ))}
        </ol>

        <h2>{L.timeSavingTips}</h2>
        <ul>
          {getDishTextArray(dish, lang, 'tips_es', 'tips_en').map((i: string) => <li key={i}>{i}</li>)}
        </ul>
      </div>
    </div>
  );
}
