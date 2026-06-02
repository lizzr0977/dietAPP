// DietApp v2 app/page.tsx replacement
'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DISHES } from '@/data/dishes';
import {
  Bell, CalendarDays, Check, ChevronDown, ChevronUp, Eye, Languages,
  Plus, RefreshCw, ShoppingCart, Trash2, UserPlus, X
} from 'lucide-react';

type Lang = 'es' | 'en';
type Profile = any;
type Meal = { id: string; day: string; date?: string; time: string; slot: string; dishId: string };
type Plan = { id?: string; household_id: string; profile_id: string; week_start: string; data: { meals: Meal[] } };
type MarketItem = {
  key: string; name: string; amount: number; unit: string; display: string;
  found: boolean; missing: boolean; replacement: string; suggestions: string[]; usedIn: string[];
};

const daysEs = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const defaultUnits = { bodyWeight: 'lb', solid: 'lb', liquid: 'l', cooking: 'cup' };

function mondayDate(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
  date.setHours(0, 0, 0, 0);
  return date;
}
function mondayISO(d = new Date()) { return mondayDate(d).toISOString().slice(0, 10); }
function dateForIndex(weekStart: string, index: number) {
  const d = new Date(`${weekStart}T12:00:00`);
  d.setDate(d.getDate() + index);
  return d;
}
function cap(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function dateLabel(weekStart: string, index: number, lang: Lang) {
  const d = dateForIndex(weekStart, index);
  const locale = lang === 'es' ? 'es-US' : 'en-US';
  const weekday = cap(new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(d));
  const rest = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
  return `${weekday} ${rest}`;
}
function todayDayEs() { return daysEs[(new Date().getDay() + 6) % 7]; }
function kgToLb(kg: number) { return kg * 2.2046226218; }
function clean(n: number) { return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, ''); }
function formatGrams(amountG: number, unit: string) {
  if (unit === 'g') return `${Math.round(amountG)} g`;
  if (unit === 'kg') return `${(amountG / 1000).toFixed(amountG >= 1000 ? 1 : 2)} kg`;
  if (unit === 'oz') return `${(amountG / 28.3495).toFixed(1)} oz`;
  return `${(amountG / 453.592).toFixed(2).replace(/\.00$/, '')} lb`;
}
function estimate(currentKg: number, goalKg: number, paceLbPerWeek: number) {
  const diffLb = Math.abs(kgToLb(currentKg - goalKg));
  if (!diffLb || !paceLbPerWeek) return null;
  const weeks = diffLb / paceLbPerWeek;
  return { min: Math.ceil(weeks * 0.85), max: Math.ceil(weeks * 1.25) };
}
function dietLabel(diet: string) {
  const map: Record<string, string> = {
    carnivore_strict: 'Carnívora estricta',
    carnivore_flexible: 'Carnívora flexible',
    animal_based: 'Animal-based',
    keto_carnivore: 'Keto carnívora',
    lacto_ovo_vegetarian: 'Lacto-ovo vegetariana',
    lacto_vegetarian: 'Lacto vegetariana',
    ovo_vegetarian: 'Ovo vegetariana',
    vegan: 'Vegana',
  };
  return map[diet] || diet;
}

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [lang, setLang] = useState<Lang>('es');
  const [tab, setTab] = useState('today');
  const [todayMode, setTodayMode] = useState<'today' | 'week'>('today');
  const [householdId, setHouseholdId] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [toast, setToast] = useState('');
  const [editingProfiles, setEditingProfiles] = useState<Record<string, boolean>>({});
  const [marketProfiles, setMarketProfiles] = useState<string[]>([]);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [productPhotos, setProductPhotos] = useState<string[]>([]);
  const [productResult, setProductResult] = useState('');
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) location.href = '/login';
      else setSession(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) location.href = '/login';
      else setSession(nextSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) boot(); }, [session]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2500);
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
    const { data: profs } = await supabase.from('profiles').select('*').eq('household_id', hid).order('created_at');
    const { data: pls } = await supabase.from('weekly_plans').select('*').eq('household_id', hid).eq('week_start', mondayISO());
    const { data: rem } = await supabase.from('reminders').select('*').eq('household_id', hid).eq('done', false).order('remind_at');

    setProfiles(profs || []);
    setPlans((pls || []) as Plan[]);
    setReminders(rem || []);
    if ((profs || []).length && !activeProfileId) setActiveProfileId((profs || [])[0].id);
  }

  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const activePlan = plans.find((p) => p.profile_id === activeProfileId);
  const activeUnits = activeProfile?.unit_prefs || defaultUnits;

  function dishById(id: string) { return (DISHES as any).find((d: any) => d.id === id); }

  function compatibleDishes(profile: Profile) {
    const dt = profile?.diet_type || 'carnivore_flexible';
    return (DISHES as any).filter((d: any) => {
      const tags = d.diet_tags || [];
      if (dt === 'vegan') return tags.includes('vegan');
      if (dt.includes('carnivore') || dt === 'animal_based') {
        if (dt === 'carnivore_strict') return tags.includes('carnivore_strict');
        return tags.some((x: string) => x.includes('carnivore'));
      }
      return tags.some((x: string) => ['lacto_ovo_vegetarian', 'lacto_vegetarian', 'ovo_vegetarian', 'vegan'].includes(x));
    });
  }

  async function addProfile() {
    const name = prompt('Nombre del perfil');
    if (!name) return;

    const { data, error } = await supabase.from('profiles').insert({
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
        workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves'],
        wakeWork: '15:00',
        startWork: '18:00',
        breakWork: '22:00',
        endWork: '04:30',
        sleepWork: '06:00',
        wakeOff: '09:00',
        sleepOff: '23:00',
        mealsWork: 3,
        mealsOff: 3,
        hasMicrowave: true,
      },
    }).select().single();

    if (error) return notify(`No se pudo crear: ${error.message}`);

    setActiveProfileId(data.id);
    setEditingProfiles({ ...editingProfiles, [data.id]: true });
    await loadAll(householdId);
    notify('Perfil creado ✅');
  }

  async function deleteProfile(id: string) {
    if (!confirm('¿Eliminar este perfil?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) return notify(`No se pudo eliminar: ${error.message}`);
    await loadAll(householdId);
    notify('Perfil eliminado ✅');
  }

  async function saveProfile(p: Profile) {
    const { error } = await supabase.from('profiles').update(p).eq('id', p.id);
    if (error) return notify(`No se pudo guardar: ${error.message}`);
    setEditingProfiles({ ...editingProfiles, [p.id]: false });
    await loadAll(householdId);
    notify('Perfil guardado ✅');
  }

  async function updateGlobalUnits(nextUnits: any) {
    if (!profiles.length) return;
    await Promise.all(
      profiles.map((p) =>
        supabase.from('profiles').update({ unit_prefs: { ...(p.unit_prefs || defaultUnits), ...nextUnits } }).eq('id', p.id)
      )
    );
    await loadAll(householdId);
    notify('Unidades actualizadas ✅');
  }

  async function toggleBodyUnit() {
    const next = activeUnits.bodyWeight === 'lb' ? 'kg' : 'lb';
    await updateGlobalUnits({ bodyWeight: next, solid: next === 'lb' ? 'lb' : 'kg' });
  }

  async function generatePlan(profile: Profile) {
    const choices = compatibleDishes(profile);
    if (!choices.length) return notify('No hay platillos compatibles con ese perfil');

    const weekStart = mondayISO();
    const meals: Meal[] = [];
    const routine = profile.routine || {};

    for (const [index, day] of daysEs.entries()) {
      const isWork = (routine.workDays || []).includes(day);
      const mealCount = isWork ? Number(routine.mealsWork || 3) : Number(routine.mealsOff || 3);
      const times = isWork
        ? [routine.wakeWork || '15:00', routine.startWork || '18:00', routine.breakWork || '22:00', routine.endWork || '04:30']
        : [routine.wakeOff || '09:00', '14:00', '19:00', routine.sleepOff || '23:00'];

      for (let i = 0; i < mealCount; i++) {
        const d = choices[(i + day.length + meals.length) % choices.length];
        meals.push({
          id: crypto.randomUUID(),
          day,
          date: dateForIndex(weekStart, index).toISOString().slice(0, 10),
          time: times[i] || times[0],
          slot: `Comida ${i + 1}`,
          dishId: d.id,
        });
      }
    }

    const payload = { household_id: householdId, profile_id: profile.id, week_start: weekStart, data: { meals } };
    const existing = plans.find((p) => p.profile_id === profile.id);
    const result = existing
      ? await supabase.from('weekly_plans').update(payload).eq('id', existing.id)
      : await supabase.from('weekly_plans').insert(payload);

    if (result.error) return notify(`No se pudo generar: ${result.error.message}`);

    await loadAll(householdId);
    setTab('today');
    setTodayMode('today');
    notify('Plan semanal generado ✅');
  }

  async function changeDish(meal: Meal, profile: Profile) {
    const choices = compatibleDishes(profile).filter((d: any) => d.id !== meal.dishId);
    const currentPlan = plans.find((p) => p.profile_id === profile.id);
    if (!currentPlan || !choices.length) return;

    const newDish = choices[Math.floor(Math.random() * choices.length)];
    currentPlan.data.meals = currentPlan.data.meals.map((m) => (m.id === meal.id ? { ...m, dishId: newDish.id } : m));

    const { error } = await supabase.from('weekly_plans').update({ data: currentPlan.data }).eq('id', currentPlan.id);
    if (error) return notify(`No se pudo cambiar: ${error.message}`);

    await loadAll(householdId);
    notify('Plato cambiado ✅');
  }

  function buildMarket(selectedIds: string[]) {
    const map = new Map<string, MarketItem>();
    const selectedPlans = plans.filter((p) => selectedIds.includes(p.profile_id));

    for (const plan of selectedPlans) {
      const prof = profiles.find((p) => p.id === plan.profile_id);
      for (const meal of plan.data.meals || []) {
        const d = dishById(meal.dishId);
        if (!d) continue;
        for (const ing of d.shopping_items || []) {
          const name = ing.name || '';
          const unit = ing.unit || 'item';
          const amount = Number(ing.amount || 1);
          const key = `${name.toLowerCase()}__${unit}`;
          const usedLine = `${prof?.name || 'Perfil'} · ${meal.day} · ${d.name_es || d.name_en}`;
          const suggestions = d.replacements_es || d.replacements_en || [];

          if (!map.has(key)) {
            map.set(key, {
              key, name, amount, unit, display: '', found: false, missing: false, replacement: '',
              suggestions, usedIn: [usedLine],
            });
          } else {
            const current = map.get(key)!;
            current.amount += amount;
            current.usedIn.push(usedLine);
            current.suggestions = Array.from(new Set([...current.suggestions, ...suggestions]));
          }
        }
      }
    }

    const nextItems = Array.from(map.values()).map((item) => {
      let display = `${clean(item.amount)} ${item.unit}`;
      if (item.unit === 'g') display = formatGrams(item.amount, activeUnits.solid || 'lb');
      if (item.unit === 'piezas' || item.unit === 'pieza') display = `${clean(item.amount)} ${item.amount === 1 ? 'pieza' : 'piezas'}`;
      if (item.unit === 'taza') display = `${clean(item.amount)} ${item.amount === 1 ? 'taza' : 'tazas'}`;
      return { ...item, display };
    });

    setMarketItems(nextItems);
    notify('Mandado actualizado ✅');
  }

  function toggleMarketProfile(id: string, checked: boolean) {
    const next = checked ? [...marketProfiles, id] : marketProfiles.filter((x) => x !== id);
    setMarketProfiles(next);
    buildMarket(next);
  }

  function toggleFound(index: number) {
    setMarketItems((items) => items.map((item, i) => i === index ? { ...item, found: !item.found, missing: false } : item));
  }

  function markMissing(index: number) {
    setMarketItems((items) => items.map((item, i) => i === index ? { ...item, missing: !item.missing, found: false } : item));
  }

  function setReplacement(index: number, replacement: string) {
    if (!replacement) return;
    setMarketItems((items) => items.map((item, i) => i === index ? { ...item, replacement } : item));
    notify('Reemplazo agregado ✅');
  }

  function addManualMarketItem() {
    const name = prompt('Producto manual');
    if (!name) return;
    setMarketItems([...marketItems, {
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
    }]);
    notify('Producto agregado ✅');
  }

  function exportWhatsapp() {
    const text = ['DietApp — Mandado semanal', '', ...marketItems.map((i) => {
      const check = i.found ? '✅' : i.missing ? '❌' : '•';
      const replacement = i.replacement ? ` (reemplazo: ${i.replacement})` : '';
      return `${check} ${i.name} — ${i.display}${replacement}`;
    })].join('\n');

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  async function analyzeProduct() {
    if (!activeProfile || !productPhotos.length) return notify('Toma al menos una foto del producto');
    setProductResult('Analizando...');
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

  async function addReminder() {
    const title = prompt('Recordatorio');
    if (!title) return;
    const remind_at = prompt('Fecha/hora ejemplo 2026-06-01T18:00');
    if (!remind_at) return;

    const { error } = await supabase.from('reminders').insert({ household_id: householdId, profile_id: activeProfileId || null, title, remind_at });
    if (error) return notify(`No se pudo guardar: ${error.message}`);

    try {
      if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission();
      if ('Notification' in window && Notification.permission === 'granted') new Notification('DietApp', { body: title });
    } catch {}

    await loadAll(householdId);
    notify('Recordatorio guardado ✅');
  }

  async function logException() {
    const item = prompt('¿Qué excepción comiste?');
    if (!item || !activeProfile) return;

    const { error } = await supabase.from('exceptions').insert({ household_id: householdId, profile_id: activeProfile.id, item });
    if (error) return notify(`No se pudo registrar: ${error.message}`);
    notify('Excepción registrada ✅');
  }

  if (!session) return <main className="shell"><div className="card">Cargando DietApp...</div></main>;

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
            <button className="btn secondary small" onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>
              <Languages size={16} /> {lang.toUpperCase()}
            </button>
            <button className="btn secondary small" onClick={toggleBodyUnit}>{activeUnits.bodyWeight || 'lb'}</button>
          </div>
        </div>
      </header>

      <main className="shell">
        {tab === 'today' && (
          <TodayView
            lang={lang}
            mode={todayMode}
            setMode={setTodayMode}
            activeProfile={activeProfile}
            activePlan={activePlan}
            dishById={dishById}
            changeDish={changeDish}
            setSelectedDish={setSelectedDish}
            generatePlan={generatePlan}
            addProfile={addProfile}
          />
        )}

        {tab === 'plan' && (
          <PlanView
            lang={lang}
            profiles={profiles}
            plans={plans}
            dishById={dishById}
            changeDish={changeDish}
            setSelectedDish={setSelectedDish}
            generatePlan={generatePlan}
            addProfile={addProfile}
          />
        )}

        {tab === 'market' && (
          <MarketView
            profiles={profiles}
            marketProfiles={marketProfiles}
            marketItems={marketItems}
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

        {tab === 'history' && <HistoryView reminders={reminders} addReminder={addReminder} logException={logException} />}
      </main>

      {selectedDish && <RecipeModal dish={selectedDish} lang={lang} onClose={() => setSelectedDish(null)} />}

      <nav className="tabs">
        <div className="tabs-inner">
          {[
            ['today', '🍽️', 'Hoy'],
            ['plan', '📅', 'Semana'],
            ['market', '🛒', 'Super'],
            ['settings', '⚙️', 'Config.'],
            ['history', '📈', 'Historial'],
          ].map(([id, icon, label]) => (
            <button key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(String(id))}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

function WelcomeCard({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="card empty-state">
      <div className="big">👋</div>
      <h2>Bienvenido a DietApp</h2>
      <p>Crea un perfil, elige tu dieta, configura tus horarios y genera tu semana. Después la app te prepara recetas y mandado.</p>
      <button className="btn" onClick={onCreate}><UserPlus size={18} /> Crear primer perfil</button>
    </div>
  );
}

function TodayView(props: any) {
  const { lang, mode, setMode, activeProfile, activePlan, dishById, changeDish, setSelectedDish, generatePlan, addProfile } = props;
  if (!activeProfile) return <WelcomeCard onCreate={addProfile} />;

  const meals = activePlan?.data?.meals || [];
  const today = todayDayEs();
  const todayMeals = meals.filter((m: Meal) => m.day === today);

  return (
    <section>
      <div className="card">
        <h1>Tu comida de hoy</h1>
        <p>Perfil: <b>{activeProfile.name}</b> · Dieta: <b>{dietLabel(activeProfile.diet_type)}</b></p>
        <div className="actions">
          <button className={`btn ${mode === 'today' ? '' : 'secondary'}`} onClick={() => setMode('today')}>Hoy</button>
          <button className={`btn ${mode === 'week' ? '' : 'secondary'}`} onClick={() => setMode('week')}>Ver semana</button>
          <button className="btn outline" onClick={() => generatePlan(activeProfile)}><CalendarDays size={17} /> Generar semana</button>
        </div>
      </div>

      {!activePlan && (
        <div className="card empty-state">
          <div className="big">📅</div>
          <h2>Aún no hay plan</h2>
          <p>Genera una semana para que DietApp te muestre tus comidas por horario.</p>
          <button className="btn" onClick={() => generatePlan(activeProfile)}>Generar semana</button>
        </div>
      )}

      {activePlan && mode === 'today' && (
        <div className="card">
          <h2>{dateLabel(activePlan.week_start, daysEs.indexOf(today), lang)}</h2>
          {todayMeals.length === 0 ? <p className="notice">Hoy no hay comidas programadas.</p> : todayMeals.map((meal: Meal) => {
            const d = dishById(meal.dishId);
            return <DishCard key={meal.id} d={d} meal={meal} onView={() => setSelectedDish(d)} onChange={() => changeDish(meal, activeProfile)} />;
          })}
        </div>
      )}

      {activePlan && mode === 'week' && (
        <WeekPlan lang={lang} plan={activePlan} profile={activeProfile} dishById={dishById} changeDish={changeDish} setSelectedDish={setSelectedDish} />
      )}
    </section>
  );
}

function PlanView(props: any) {
  const { lang, profiles, plans, dishById, changeDish, setSelectedDish, generatePlan, addProfile } = props;
  if (!profiles.length) return <WelcomeCard onCreate={addProfile} />;

  return (
    <section>
      <div className="card">
        <h1>Plan semanal</h1>
        <p>Revisa la semana completa antes de hacer el mandado.</p>
        <div className="actions">
          {profiles.map((p: Profile) => <button key={p.id} className="btn secondary" onClick={() => generatePlan(p)}>Generar: {p.name}</button>)}
        </div>
      </div>
      {profiles.map((p: Profile) => {
        const plan = plans.find((pl: Plan) => pl.profile_id === p.id);
        if (!plan) return null;
        return <WeekPlan key={p.id} lang={lang} plan={plan} profile={p} dishById={dishById} changeDish={changeDish} setSelectedDish={setSelectedDish} />;
      })}
    </section>
  );
}

function WeekPlan({ lang, plan, profile, dishById, changeDish, setSelectedDish }: any) {
  return (
    <div className="card">
      <h2>{profile.name}</h2>
      <p>{dietLabel(profile.diet_type)}</p>
      {daysEs.map((day, index) => (
        <div key={day} style={{ marginTop: 18 }}>
          <h3>{dateLabel(plan.week_start, index, lang)}</h3>
          {(plan.data.meals || []).filter((m: Meal) => m.day === day).map((meal: Meal) => {
            const d = dishById(meal.dishId);
            return <DishCard key={meal.id} d={d} meal={meal} onView={() => setSelectedDish(d)} onChange={() => changeDish(meal, profile)} />;
          })}
        </div>
      ))}
    </div>
  );
}

function DishCard({ d, meal, onView, onChange }: any) {
  if (!d) return null;
  return (
    <div className="card dish-card">
      <img src={d.image_url} alt={d.name_es || d.name_en} />
      <div style={{ flex: 1 }}>
        <div className="muted">{meal.time} · {meal.slot}</div>
        <h3>{d.name_es || d.name_en}</h3>
        <span className="badge">{d.calories} cal</span>
        <span className="badge blue">{d.protein_g}g proteína</span>
        <span className="badge orange">{d.total_minutes} min</span>
        {d.portable && <span className="badge">Para llevar</span>}
        <div className="actions">
          <button className="btn small secondary" onClick={onView}><Eye size={15} /> Ver receta</button>
          <button className="btn small outline" onClick={onChange}><RefreshCw size={15} /> Cambiar plato</button>
        </div>
      </div>
    </div>
  );
}

function SettingsView(props: any) {
  const { profiles, activeProfile, editingProfiles, setEditingProfiles, addProfile, deleteProfile, saveProfile, updateGlobalUnits } = props;
  const units = activeProfile?.unit_prefs || defaultUnits;

  return (
    <section>
      <div className="card">
        <h1>Configuración</h1>
        <p>Administra perfiles, idioma, unidades y preferencias generales.</p>
        <h3>Unidades rápidas para toda la app</h3>
        <div className="grid">
          <div className="col6"><label>Peso corporal</label><select value={units.bodyWeight || 'lb'} onChange={(e) => updateGlobalUnits({ bodyWeight: e.target.value })}><option value="lb">Libras</option><option value="kg">Kilos</option></select></div>
          <div className="col6"><label>Sólidos</label><select value={units.solid || 'lb'} onChange={(e) => updateGlobalUnits({ solid: e.target.value })}><option value="lb">Libras</option><option value="oz">Onzas</option><option value="kg">Kilos</option><option value="g">Gramos</option></select></div>
          <div className="col6"><label>Líquidos</label><select value={units.liquid || 'l'} onChange={(e) => updateGlobalUnits({ liquid: e.target.value })}><option value="l">Litros</option><option value="ml">Mililitros</option><option value="fl_oz">Fl oz</option><option value="gal">Galones</option></select></div>
          <div className="col6"><label>Cocina</label><select value={units.cooking || 'cup'} onChange={(e) => updateGlobalUnits({ cooking: e.target.value })}><option value="cup">Cups</option><option value="tbsp">Tbsp</option><option value="tsp">Tsp</option><option value="ml">Ml</option></select></div>
        </div>
      </div>

      <div className="card">
        <div className="profile-summary">
          <div><h2>Perfiles</h2><p>Los detalles quedan cerrados hasta que quieras editar.</p></div>
          <button className="btn" onClick={addProfile}><Plus size={17} /> Agregar</button>
        </div>
        {!profiles.length && <WelcomeCard onCreate={addProfile} />}
        {profiles.map((p: Profile) => (
          <ProfileRow
            key={p.id}
            p={p}
            isEditing={!!editingProfiles[p.id]}
            setEditing={(value: boolean) => setEditingProfiles({ ...editingProfiles, [p.id]: value })}
            saveProfile={saveProfile}
            deleteProfile={deleteProfile}
          />
        ))}
      </div>
    </section>
  );
}

function ProfileRow({ p, isEditing, setEditing, saveProfile, deleteProfile }: any) {
  const [local, setLocal] = useState<any>(p);
  useEffect(() => setLocal(p), [p]);

  const tl = estimate(Number(local.current_weight_kg || 0), Number(local.goal_weight_kg || 0), Number(local.pace_lb_per_week || 1));

  return (
    <div className="card" style={{ boxShadow: 'none' }}>
      <div className="profile-summary">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="profile-avatar">👤</div>
          <div>
            <h3>{p.name}</h3>
            <div className="muted">{dietLabel(p.diet_type)} · Meta: {p.current_weight_kg && p.goal_weight_kg ? `${clean(p.current_weight_kg)} kg → ${clean(p.goal_weight_kg)} kg` : 'sin meta'}</div>
          </div>
        </div>
        <button className="btn secondary small" onClick={() => setEditing(!isEditing)}>
          {isEditing ? <ChevronUp size={16} /> : <ChevronDown size={16} />} {isEditing ? 'Cerrar' : 'Editar'}
        </button>
      </div>

      {isEditing && (
        <>
          <label>Nombre</label><input value={local.name || ''} onChange={(e) => setLocal({ ...local, name: e.target.value })} />
          <div className="grid">
            <div className="col6"><label>Peso actual kg</label><input type="number" value={local.current_weight_kg || ''} onChange={(e) => setLocal({ ...local, current_weight_kg: e.target.value })} /></div>
            <div className="col6"><label>Peso meta kg</label><input type="number" value={local.goal_weight_kg || ''} onChange={(e) => setLocal({ ...local, goal_weight_kg: e.target.value })} /></div>
            <div className="col6"><label>Estatura cm</label><input type="number" value={local.height_cm || ''} onChange={(e) => setLocal({ ...local, height_cm: e.target.value })} /></div>
            <div className="col6"><label>Edad</label><input type="number" value={local.age || ''} onChange={(e) => setLocal({ ...local, age: e.target.value })} /></div>
          </div>

          <label>Tipo de dieta</label>
          <select value={local.diet_type || 'carnivore_flexible'} onChange={(e) => setLocal({ ...local, diet_type: e.target.value })}>
            <option value="carnivore_strict">Carnívora estricta</option><option value="carnivore_flexible">Carnívora flexible</option><option value="animal_based">Animal-based</option><option value="keto_carnivore">Keto carnívora</option><option value="lacto_ovo_vegetarian">Lacto-ovo vegetariana</option><option value="lacto_vegetarian">Lacto vegetariana</option><option value="ovo_vegetarian">Ovo vegetariana</option><option value="vegan">Vegana</option>
          </select>

          <h3 style={{ marginTop: 16 }}>Rutina</h3>
          <div className="grid">
            <div className="col6"><label>Despierto trabajo</label><input type="time" value={local.routine?.wakeWork || '15:00'} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, wakeWork: e.target.value } })} /></div>
            <div className="col6"><label>Entrada</label><input type="time" value={local.routine?.startWork || '18:00'} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, startWork: e.target.value } })} /></div>
            <div className="col6"><label>Break</label><input type="time" value={local.routine?.breakWork || '22:00'} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, breakWork: e.target.value } })} /></div>
            <div className="col6"><label>Salida</label><input type="time" value={local.routine?.endWork || '04:30'} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, endWork: e.target.value } })} /></div>
          </div>

          <label>Días de trabajo separados por coma</label>
          <input value={(local.routine?.workDays || []).join(', ')} onChange={(e) => setLocal({ ...local, routine: { ...local.routine, workDays: e.target.value.split(',').map((x: string) => x.trim()).filter(Boolean) } })} />
          {tl && <p className="notice">Ritmo aproximado: {tl.min}-{tl.max} semanas para la meta.</p>}

          <div className="actions">
            <button className="btn" onClick={() => saveProfile(local)}>Guardar</button>
            <button className="btn danger" onClick={() => deleteProfile(local.id)}><Trash2 size={16} /> Eliminar</button>
          </div>
        </>
      )}
    </div>
  );
}

function MarketView(props: any) {
  const { profiles, marketProfiles, marketItems, toggleMarketProfile, buildMarket, toggleFound, markMissing, setReplacement, addManualMarketItem, exportWhatsapp, handlePhoto, productPhotos, analyzeProduct, productResult } = props;

  return (
    <section>
      <div className="card">
        <h1>Super / Mandado</h1>
        <p>Selecciona perfiles y DietApp suma ingredientes de la semana.</p>
        <div className="actions">
          {profiles.map((p: Profile) => (
            <label key={p.id} className="badge">
              <input type="checkbox" checked={marketProfiles.includes(p.id)} onChange={(e) => toggleMarketProfile(p.id, e.target.checked)} /> {p.name}
            </label>
          ))}
        </div>
        <div className="actions">
          <button className="btn secondary" onClick={() => buildMarket(marketProfiles)}><ShoppingCart size={17} /> Actualizar mandado</button>
          <button className="btn outline" onClick={exportWhatsapp}>Enviar WhatsApp</button>
          <button className="btn secondary" onClick={addManualMarketItem}>+ Manual</button>
        </div>
      </div>

      <div className="grid">
        <div className="col8 card">
          <h2>Lista</h2>
          {!marketItems.length && <div className="empty-state"><div className="big">🛒</div><p>Selecciona un perfil y toca “Actualizar mandado”.</p></div>}
          {marketItems.map((item: MarketItem, index: number) => (
            <div key={item.key} className={`market-item ${item.found ? 'found' : ''}`}>
              <button className={`market-check ${item.found ? 'active' : ''}`} onClick={() => toggleFound(index)}>{item.found ? <Check size={18} /> : ''}</button>
              <div style={{ flex: 1 }}>
                <b>{item.name}</b> — {item.display}
                {item.missing && <span className="badge red">No encontrado</span>}
                {item.replacement && <span className="badge orange">Reemplazo: {item.replacement}</span>}
                <details><summary className="muted">Ver recetas relacionadas</summary>{item.usedIn.map((u) => <p className="muted" key={u}>• {u}</p>)}</details>
                {item.missing && item.suggestions?.length > 0 && (
                  <div className="actions">
                    {item.suggestions.slice(0, 4).map((s) => <button key={s} className="btn small secondary" onClick={() => setReplacement(index, s)}>{s}</button>)}
                  </div>
                )}
              </div>
              <div className="actions">
                <button className="btn small danger" onClick={() => markMissing(index)}><X size={14} /></button>
                <button className="btn small outline" onClick={() => { const r = prompt('¿Qué reemplazo encontraste?'); if (r) setReplacement(index, r); }}>Reemplazar</button>
              </div>
            </div>
          ))}
        </div>

        <div className="col4 card">
          <h2>📷 Analizar producto</h2>
          <p className="muted">Toma foto del frente, Nutrition Facts e ingredientes.</p>
          <input type="file" accept="image/*" capture="environment" multiple onChange={handlePhoto} />
          <div className="actions">{productPhotos.map((p: string, i: number) => <img key={i} src={p} style={{ width: 78, height: 78, objectFit: 'cover', borderRadius: 14 }} />)}</div>
          <button className="btn" style={{ width: '100%', marginTop: 10 }} onClick={analyzeProduct}>Analizar producto</button>
          {productResult && <div className="notice" style={{ marginTop: 10 }}>{productResult}</div>}
        </div>
      </div>
    </section>
  );
}

function HistoryView({ reminders, addReminder, logException }: any) {
  return (
    <section>
      <div className="card">
        <h1>Historial</h1>
        <p>Registra excepciones, peso y recordatorios.</p>
        <div className="actions"><button className="btn secondary" onClick={logException}>Registrar excepción</button><button className="btn secondary" onClick={addReminder}><Bell size={16} /> Agregar recordatorio</button></div>
      </div>
      <div className="card">
        <h2>Recordatorios</h2>
        {!reminders.length && <p className="muted">No tienes recordatorios pendientes.</p>}
        {reminders.map((r: any) => <p key={r.id}>🔔 {r.title}<br /><span className="muted">{new Date(r.remind_at).toLocaleString()}</span></p>)}
      </div>
    </section>
  );
}

function RecipeModal({ dish, lang, onClose }: any) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="card modalbox" onClick={(e) => e.stopPropagation()}>
        <button className="btn secondary small" onClick={onClose}>Cerrar</button>
        {dish.image_url ? <img className="recipe-hero" src={dish.image_url} alt={dish.name_es || dish.name_en} /> : <div className="hero">🍽️</div>}
        <h1>{lang === 'es' ? dish.name_es : dish.name_en}</h1>
        <span className="badge">{dish.calories} cal</span><span className="badge blue">{dish.protein_g}g proteína</span><span className="badge orange">{dish.total_minutes} min</span>{dish.portable && <span className="badge">Para llevar</span>}
        <h2>Ingredientes</h2>
        <ul>{(lang === 'es' ? dish.ingredients_es : dish.ingredients_en).map((i: string) => <li key={i}>{i}</li>)}</ul>
        <h2>Utensilios</h2>
        <ul>{(lang === 'es' ? dish.utensils_es : dish.utensils_en).map((i: string) => <li key={i}>{i}</li>)}</ul>
        <h2>Paso a paso</h2>
        <ol>{(lang === 'es' ? dish.steps_es : dish.steps_en).map((i: string) => <li key={i} style={{ marginBottom: 10 }}>{i}</li>)}</ol>
        <h2>Tips para ahorrar tiempo</h2>
        <ul>{(lang === 'es' ? dish.tips_es : dish.tips_en).map((i: string) => <li key={i}>{i}</li>)}</ul>
      </div>
    </div>
  );
}
