# Project Plan – Habit Tracker (React Native Expo + Supabase)

## Current Status (2026‑05‑23)
- Added **default export placeholders** to `Polyfills.ts`, `useHabits.ts`, and `supabase.ts` to satisfy Expo‑router warnings.
- Added an **Expo linking scheme** (`"habittracker"`) to `app.config.js`.
- Updated environment variables to the Expo‑public naming convention (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`) and adjusted `supabase.ts` to read them.
- Created a `global.d.ts` declaration so TypeScript recognises `process.env`.
- Fixed Metro bundler port conflict (PID 628 stopped).
- Console logs added to verify Supabase config at runtime.
- All warnings listed by Expo should now be cleared.

## 1️⃣ Folder / Repository Layout
```
habit-tracker/
│
├─ .expo/                     # Expo config files (generated)
├─ .claude/                   # (optional) Claude‑Code memory, settings, etc.
│
├─ app/                       # Root of the RN app (Expo “app” directory)
│   ├─ src/
│   │   ├─ assets/            # Icons, images, fonts
│   │   │   └─ splash.png
│   │   ├─ components/        # Re‑usable UI pieces
│   │   │   ├─ HabitItem.tsx
│   │   │   ├─ HabitForm.tsx
│   │   │   ├─ FrequencyPicker.tsx
│   │   │   ├─ ThemeToggle.tsx
│   │   │   ├─ NotificationToggle.tsx
│   │   │   └─ OfflineSyncProvider.tsx
│   │   ├─ navigation/        # React‑Navigation stacks
│   │   │   └─ AppNavigator.tsx
│   │   ├─ screens/           # Top‑level screens
│   │   │   ├─ Auth/
│   │   │   │   ├─ LoginScreen.tsx
│   │   │   │   └─ SignUpScreen.tsx
│   │   │   ├─ Home/
│   │   │   │   ├─ HabitListScreen.tsx
│   │   │   │   └─ CalendarScreen.tsx
│   │   │   ├─ Habit/
│   │   │   │   ├─ HabitDetailScreen.tsx
│   │   │   │   └─ AddHabitScreen.tsx
│   │   │   └─ SettingsScreen.tsx
│   │   ├─ services/
│   │   │   ├─ supabase.ts      # Supabase client init (now uses EXPO_PUBLIC_ vars)
│   │   │   └─ notifications.ts # Expo push‑notification helpers
│   │   ├─ utils/               # helpers (date utils, offline queue)
│   │   ├─ hooks/               # custom React hooks (useHabits, useAuth)
│   │   └─ theme/               # Material‑Design theming (light/dark)
│   ├─ App.tsx                  # Entry point
│   └─ app.json                # Expo configuration (includes notification channel)
│
├─ supabase/                    # Supabase project files (SQL migrations)
│   ├─ schema.sql               # Full DB schema
│   └─ seeds.sql                # Optional seed data
│
├─ .env                         # Local env (Supabase URL/ANON KEY) – **ignored by git**
├─ .gitignore
├─ README.md
└─ package.json
```

*All code is written in **TypeScript** for safety and autocomplete.*

## 2️⃣ Supabase Schema
```sql
-- 1. Users – managed by Supabase Auth (no custom table needed)
--    Table `auth.users` is automatically created.

-- 2. Table: habits
create table public.habits (
  id            uuid      primary key default gen_random_uuid(),
  user_id       uuid      references auth.users (id) on delete cascade,
  title         text      not null,
  description   text,
  frequency     jsonb     not null,   -- e.g. {"type":"daily"} or {"type":"weekly","days":[1,3,5]}
  start_date    date      not null default current_date,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
);

-- 3. Table: habit_logs (one row per day the habit is marked completed)
create table public.habit_logs (
  id            uuid      primary key default gen_random_uuid(),
  habit_id      uuid      references public.habits (id) on delete cascade,
  logged_date   date      not null,
  completed_at  timestamp with time zone default now(),
  unique (habit_id, logged_date)
);

-- 4. Table: push_tokens (stores device push‑notification tokens)
create table public.push_tokens (
  id            uuid      primary key default gen_random_uuid(),
  user_id       uuid      references auth.users (id) on delete cascade,
  token         text      not null,
  platform      text check (platform in ('ios','android')) not null,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
);

-- 5. Enable Row‑Level Security (RLS) for each table
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.push_tokens enable row level security;

-- Policies – each user can only access their own rows
create policy "users can CRUD their habits"
  on public.habits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can CRUD their logs"
  on public.habit_logs for all
  using (auth.uid() = (select user_id from public.habits where id = habit_id))
  with check (auth.uid() = (select user_id from public.habits where id = habit_id));

create policy "users can manage their push tokens"
  on public.push_tokens for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```
*The `frequency` column stores a flexible JSON payload so you can represent daily, weekly, custom intervals, and streak‑type habits.*

## 3️⃣ Key Screens & Navigation Flow
```
AuthStack
 └─ LoginScreen      (email/password, Google button)
 └─ SignUpScreen     (same fields + confirm password)

AppStack (protected)
 └─ HomeTabs (bottom tab)
      ├─ HabitListScreen       ← default screen, shows today’s habits
      ├─ CalendarScreen        ← month view with habit completions
      └─ SettingsScreen        ← theme toggle, notification opt‑in, sign‑out

 └─ AddHabitScreen (modal)      ← create new habit
 └─ HabitDetailScreen (modal)   ← edit habit, delete, view streak stats
```
Material Design components are provided via `react-native-paper`.

## 4️⃣ Component Breakdown
| Component | Purpose | Props (high‑level) |
|-----------|---------|--------------------|
| **HabitItem** | List row showing habit title, status for today, quick “✓” toggle | `habit`, `onToggle` |
| **HabitForm** | Shared UI for Add & Edit – fields for title, description, frequency picker | `initialValues?`, `onSubmit` |
| **FrequencyPicker** | UI to select Daily / Weekly / Custom interval / Streak | `value`, `onChange` |
| **ThemeToggle** | Light ↔ Dark switch (system‑aware) | `theme`, `setTheme` |
| **NotificationToggle** | Enable/disable push notifications, register token | `enabled`, `onToggle` |
| **OfflineSyncProvider** | Context that buffers CRUD ops when offline, flushes when back online (uses `@react-native-community/netinfo`) | — |
| **useHabits** (hook) | Encapsulates Supabase queries + realtime subscription for the current user | — |
| **useAuth** (hook) | Wrapper around `@supabase/supabase-js` auth helpers | — |
| **WidgetHelper** (Android only) | Registers home‑screen shortcut via Expo’s `expo‑widgets` (Phase 3) | — |
All UI components use **react‑native‑paper** theming so the light/dark toggle is automatic.

## 5️⃣ Phased Build Roadmap
| Phase | Goal (MVP) | Tasks (high‑level) | Time Estimate |
|-------|------------|--------------------|---------------|
| **0 – Prep** | Repo & tooling | • `npx create-expo-app habit-tracker --template blank` <br>• Add TypeScript, `react-native-paper`, `@supabase/supabase-js`, `expo-notifications`, `@react-native-async-storage/async-storage` <br>• Initialise Supabase project, copy URL + anon key to `.env` | 1 day |
| **1 – Core Auth & UI** | Sign‑up/login, theming, habit CRUD | • Implement Supabase auth (email + password, Google provider) <br>• Light/Dark Material‑Design theming <br>• HabitListScreen + HabitItem (read only) <br>• AddHabitScreen + Edit flow <br>• Basic navigation (AuthStack → AppStack) | 1 – 2 weeks |
| **2 – Habit Tracking & Persistence** | Mark habit completed, view calendar | • `habit_logs` insertion on toggle <br>• CalendarScreen (monthly grid, uses `date-fns`) <br>• Real‑time subscription to `habits` & `habit_logs` (Supabase Realtime) | 1 week |
| **3 – Push Notifications** | Daily reminders | • Request permissions via `expo-notifications` <br>• Store device token in `push_tokens` table <br>• Supabase Edge Function (or simple cron) that sends push at user‑chosen time (e.g., 09:00) <br>• UI to enable/disable per‑habit (optional) | 1 week |
| **4 – Offline Support / Sync Queue** | Seamless use when connectivity drops | • `OfflineSyncProvider` that captures CRUD ops in AsyncStorage <br>• On reconnection, replay queue with exponential back‑off <br>• Conflict resolution: last‑write‑wins (acceptable for personal habit data) | 1 week |
| **5 – Home‑Screen Widgets / Shortcuts** | Quick habit toggle from OS home screen | • Android: `expo-widgets` (or `expo‑shortcuts`) to expose each daily habit as a widget button <br>• iOS: add Home‑Screen shortcut via `expo‑linking` (deep link to habit toggle) <br>• Settings screen toggle to enable/disable widgets | 1 week |
| **6 – Polish & Release** | QA, minor UX tweaks, prepare for Expo Go sharing | • End‑to‑end manual testing on both platforms <br>• Fix any RLS edge‑cases, add simple error toast <br>• Update README with “How to run locally” <br>• Publish to Expo (public link) | 3‑4 days |
**Overall MVP (Phases 0‑4)** can be shipped in ~4 weeks (under 1 month) with a functional offline‑first habit tracker, push reminders, and full Material‑Design light/dark UI.

## 6️⃣ Development Tips & Gotchas
* **Supabase RLS** – double‑check policies after adding any new table.
* **Push tokens** – delete old tokens on logout to avoid stray notifications.
* **Expo Go** – works with all the above; widgets (Phase 5) require building a custom EAS build, but the core app runs fine in Expo Go.
* **Testing offline** – simulate loss of network with device’s “Airplane mode”; the queue persists in AsyncStorage and flushes automatically when you reconnect.
* **Version control** – keep `.env` out of git; store only the example file (`.env.example`).

## 7️⃣ Next Steps
1. **Create the repo** (or let me know if you already have one).
2. **Spin up a Supabase project** on the free tier; get the URL & anon key.
3. I’ll generate the initial `package.json` and `app.json` files.
4. Then we can start implementing Phase 0 together.

Let me know if you’d like me to scaffold the first files or adjust any part of the plan! 🚀