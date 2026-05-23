# Phase‑1 Implementation Plan (Core Auth & UI)

## Context
The habit‑tracker app now has basic navigation, authentication screens, and a Supabase client wired with Expo‑public environment variables. However, several reusable UI components referenced in the original design are missing, and the placeholder screens (`AddHabitScreen`, `HabitDetailScreen`, `SettingsScreen`) lack functional content. The goal is to complete Phase‑1 by delivering a fully functional authentication flow, a set of reusable UI components, and ensuring all Expo‑router default‑export warnings are resolved.

## Critical Files to Modify / Create
| Path | Purpose |
|------|---------|
| `app/src/components/HabitItem.tsx` | List row displaying habit title, status for today, and a toggle button that inserts a row into `habit_logs`.
| `app/src/components/HabitForm.tsx` | Reusable form for creating/editing a habit (title, description, frequency picker).
| `app/src/components/FrequencyPicker.tsx` | UI picker for daily, weekly, custom, or streak frequencies.
| `app/src/components/ThemeToggle.tsx` | Light ↔ dark switch updating the `react-native-paper` theme context.
| `app/src/components/NotificationToggle.tsx` | Switch to enable/disable Expo push notifications and store the token in `push_tokens`.
| `app/src/components/OfflineSyncProvider.tsx` | Context provider that queues Supabase CRUD ops when offline and flushes them on reconnection.
| `app/src/screens/Home/HabitListScreen.tsx` | Update to import and render `HabitItem` for each habit.
| `app/src/screens/Habit/AddHabitScreen.tsx` | Replace placeholder with `HabitForm` and handle submission to Supabase.
| `app/src/screens/Habit/HabitDetailScreen.tsx` | Replace placeholder with `HabitForm` pre‑filled with existing habit data and a delete button.
| `app/src/screens/SettingsScreen.tsx` | Replace placeholder with `ThemeToggle` and `NotificationToggle` components.
| `app/src/App.tsx` | Wrap the root component with `OfflineSyncProvider`.

## Implementation Steps
1. **Create component files** (`HabitItem`, `HabitForm`, `FrequencyPicker`, `ThemeToggle`, `NotificationToggle`, `OfflineSyncProvider`). Each file must export a default React component.
   - Use existing UI patterns from `LoginScreen` (react‑native‑paper, LinearGradient) for styling consistency.
   - `HabitItem` receives a `habit` prop and renders title, today’s completion status, and a `Checkbox` that calls `supabase.from('habit_logs').insert({ habit_id: habit.id, logged_date: new Date() })`.
   - `HabitForm` accepts `initialValues?` and `onSubmit`. It uses `TextInput` fields and includes `FrequencyPicker`.
   - `FrequencyPicker` uses a `Picker` (or `Modal`) to select frequency type; returns a JSON object matching the DB schema.
   - `ThemeToggle` toggles a boolean in a `ThemeContext` (provided by `react-native-paper`'s `Provider`).
   - `NotificationToggle` requests `expo-notifications` permissions, registers the token via `supabase.from('push_tokens').upsert(...)`.
   - `OfflineSyncProvider` tracks pending Supabase operations using `AsyncStorage` and replays them on network reconnect (`@react-native-community/netinfo`).
2. **Extract UI markup from existing screens**:
   - Move the habit‑list row UI from `HabitListScreen` into `HabitItem`.
   - Move the input fields from the placeholder `AddHabitScreen` into `HabitForm`.
   - Move any theme‑switch logic from `SettingsScreen` into `ThemeToggle`.
3. **Wire components**:
   - Import and use `HabitItem` inside `HabitListScreen`’s `habits.map` loop.
   - Replace placeholder content in `AddHabitScreen` and `HabitDetailScreen` with `<HabitForm .../>` and handle navigation on success.
   - Insert `<ThemeToggle />` and `<NotificationToggle />` into `SettingsScreen` layout.
   - Wrap `<App>` with `<OfflineSyncProvider>` in `App.tsx`.
4. **Ensure default exports**: each new component file ends with `export default <ComponentName>;`.
5. **Update imports** where necessary (e.g., import `useHabits` from `../hooks/useHabits`).
6. **Run Expo** (`npm run start`) to verify that no "missing default export" warnings appear.
7. **Verification** (manual):
   - Login → Sign‑up work and navigate to home.
   - Habit list shows items using `HabitItem`; toggling updates UI and inserts a log.
   - Add‑habit screen shows the form, saves a habit, and returns to list.
   - Edit‑habit screen pre‑populates data, saves changes, and can delete.
   - Settings screen toggles theme and push‑notification opt‑in.
   - Simulate offline mode (airplane) → actions queue, then reconnect → actions sync without errors.
   - All console logs show Supabase URL and anon key, confirming env loading.

## Acceptance Criteria
- No Expo‑router default‑export warnings.
- All screens functional as described.
- `npm run start` runs cleanly with Metro on port 8081.
- Manual verification steps all pass.

---
*This plan supersedes the earlier pending‑items checklist. Once approved, I will proceed to implement the steps as outlined.*