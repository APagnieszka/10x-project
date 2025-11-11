# Plan implementacji widoku strony głównej z uwierzytelnianiem

## 1. Przegląd
Celem jest modyfikacja strony głównej (`/`), aby wymagała uwierzytelnienia użytkownika. Niezalogowani użytkownicy będą automatycznie przekierowywani do strony logowania (`/login`). Dodatkowo, podczas rejestracji każdy użytkownik utworzy nowe gospodarstwo domowe (household). Zalogowani użytkownicy zobaczą ikonę profilu w rogu strony, która umożliwi wylogowanie.

**Uwaga wersja beta:** W obecnej wersji aplikacji każdy użytkownik tworzy własne, nowe gospodarstwo domowe podczas rejestracji. Mechanizm zapraszania użytkowników i dołączania do istniejących gospodarstw znajomych zostanie zaimplementowany w późniejszej wersji aplikacji.

## 2. Routing widoku
- **Ścieżka główna:** `/` - wymaga uwierzytelnienia, w przeciwnym razie przekierowanie do `/login`
- **Ścieżka logowania:** `/login` - istniejąca, bez zmian w routingu
- **Ścieżka rejestracji:** `/register` - istniejąca, rozszerzona o pole household_name

## 3. Struktura komponentów

```
Layout.astro (zmodyfikowany)
├── Header (nowy komponent)
│   ├── Logo/Tytuł aplikacji
│   └── UserMenu (nowy komponent React)
│       ├── Avatar Icon
│       └── Dropdown Menu
│           ├── Email użytkownika
│           ├── Nazwa gospodarstwa
│           └── Przycisk "Wyloguj"
│
index.astro (zmodyfikowana)
├── Sprawdzenie sesji (server-side)
├── Przekierowanie do /login (jeśli brak sesji)
└── Welcome.astro (istniejący)
    └── Przyciski nawigacji

register.astro (zmodyfikowana)
└── AuthForm (rozszerzony)
    ├── Email field
    ├── Password field
    ├── Confirm Password field
    └── Household Name field (nowe)
```

## 4. Szczegóły komponentów

### 4.1. Komponent: Layout.astro (modyfikacja istniejącego)
- **Opis komponentu:** Główny layout aplikacji, który będzie zawierał opcjonalny header z menu użytkownika
- **Główne elementy:** 
  - Warunkowe renderowanie `<Header>` gdy użytkownik jest zalogowany
  - Sprawdzenie sesji server-side przez `Astro.locals.supabase.auth.getSession()`
  - Przekazanie danych użytkownika do komponentu Header
- **Obsługiwane zdarzenia:** Brak (statyczny komponent Astro)
- **Warunki walidacji:** Sprawdzenie obecności sesji
- **Typy:** `Session` z Supabase, `User` z Supabase
- **Propsy:** Brak (komponent layoutu)

### 4.2. Komponent: Header.astro (nowy)
- **Opis komponentu:** Header aplikacji zawierający logo i menu użytkownika
- **Główne elementy:**
  - `<header>` z flexbox layout
  - Logo/tytuł aplikacji po lewej stronie
  - `<UserMenu>` (komponent React) po prawej stronie
- **Obsługiwane zdarzenia:** Brak (statyczny, zdarzenia w UserMenu)
- **Warunki walidacji:** Brak
- **Typy:** `UserHeaderProps` (email: string, householdName?: string)
- **Propsy:**
  - `userEmail: string` - email zalogowanego użytkownika
  - `householdName?: string` - nazwa gospodarstwa domowego

### 4.3. Komponent: UserMenu.tsx (nowy, React)
- **Opis komponentu:** Interaktywne menu użytkownika z ikoną avatara i dropdown
- **Główne elementy:**
  - `<Button>` z ikoną użytkownika (z lucide-react)
  - Shadcn/ui `<DropdownMenu>` z następującymi elementami:
    - `<DropdownMenuLabel>` z emailem użytkownika
    - `<DropdownMenuItem>` z nazwą gospodarstwa (tylko do odczytu)
    - `<DropdownMenuSeparator>`
    - `<DropdownMenuItem>` "Wyloguj" z obsługą kliknięcia
- **Obsługiwane interakcje:**
  - Kliknięcie ikony użytkownika: otwiera/zamyka dropdown
  - Kliknięcie "Wyloguj": wywołuje `handleLogout()`
- **Obsługiwana walidacja:** Brak
- **Typy:** `UserMenuProps`
- **Propsy:**
  - `userEmail: string` - email użytkownika do wyświetlenia
  - `householdName?: string` - nazwa gospodarstwa do wyświetlenia

### 4.4. Komponent: index.astro (modyfikacja)
- **Opis komponentu:** Strona główna aplikacji, chroniona przez uwierzytelnianie
- **Główne elementy:**
  - Server-side sprawdzenie sesji w sekcji frontmatter
  - Warunkowe przekierowanie do `/login` jeśli brak sesji
  - Renderowanie `<Welcome>` dla zalogowanych użytkowników
- **Obsługiwane zdarzenia:** Brak (logika server-side)
- **Warunki walidacji:** 
  - Sprawdzenie `session !== null`
  - Sprawdzenie `session.user !== undefined`
- **Typy:** `Session` z Supabase
- **Propsy:** Brak

### 4.5. Komponent: AuthForm.tsx (modyfikacja - tryb register)
- **Opis komponentu:** Formularz rejestracji rozszerzony o pole household_name
- **Główne elementy:**
  - Istniejące pola: email, password, confirmPassword
  - **NOWE pole:** `household_name` (Input z Label)
  - Przycisk "Create Account"
- **Obsługiwane interakcje:**
  - Wypełnienie pola household_name
  - Walidacja w czasie rzeczywistym
  - Submit formularza
- **Obsługiwana walidacja:**
  - household_name: wymagane, min 2 znaki, max 100 znaków
  - household_name: tylko litery, cyfry, spacje i podstawowe znaki interpunkcyjne
- **Typy:** `RegisterWithHouseholdInput` (rozszerzenie `RegisterInput`)
- **Propsy:** `mode: "register"` (istniejący props)

### 4.6. Komponent: useAuth.ts (modyfikacja hooka)
- **Opis komponentu:** Hook zarządzający operacjami autentykacji, rozszerzony o tworzenie gospodarstwa
- **Główne elementy:**
  - Istniejące metody: `login()`, `logout()`, `register()`, `resetPassword()`
  - **MODYFIKACJA:** Metoda `register()` rozszerzona o parametr `householdName`
  - Logika tworzenia rekordu w `households` i `user_households` po rejestracji
- **Obsługiwane zdarzenia:** Wywołania asynchronicznych funkcji Supabase
- **Warunki walidacji:** 
  - Sprawdzenie sukcesu rejestracji przed utworzeniem gospodarstwa
  - Walidacja user_id z Supabase auth
- **Typy:** `RegisterWithHouseholdCommand`
- **Propsy:** Brak (hook, nie komponent)

## 5. Typy

### 5.1. Istniejące typy (bez zmian)
```typescript
// z @supabase/supabase-js
Session
User

// z src/types.ts
Households
UserHouseholds
```

### 5.2. Nowe typy ViewModels

```typescript
// src/types.ts - dodanie nowych typów

// Props dla komponentu Header
export interface UserHeaderProps {
  userEmail: string;
  householdName?: string;
}

// Props dla komponentu UserMenu
export interface UserMenuProps {
  userEmail: string;
  householdName?: string;
}

// Rozszerzony input rejestracji
export interface RegisterWithHouseholdInput {
  email: string;
  password: string;
  confirmPassword: string;
  householdName: string;
}

// Command do utworzenia użytkownika z gospodarstwem
export interface RegisterWithHouseholdCommand {
  email: string;
  password: string;
  householdName: string;
}

// DTO zwracające dane użytkownika z gospodarstwem
export interface UserWithHouseholdDto {
  id: string;
  email: string;
  household: {
    id: number;
    name: string;
  };
}
```

### 5.3. Nowe schematy Zod dla walidacji

```typescript
// src/lib/validation/auth.ts - rozszerzenie istniejących schematów

// Rozszerzenie registerSchema o householdName
export const registerWithHouseholdSchema = registerSchema.extend({
  householdName: z
    .string()
    .min(2, "Nazwa gospodarstwa musi mieć minimum 2 znaki")
    .max(100, "Nazwa gospodarstwa może mieć maksymalnie 100 znaków")
    .regex(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s\-_]+$/,
      "Nazwa może zawierać tylko litery, cyfry, spacje i podstawowe znaki"
    ),
});

export type RegisterWithHouseholdInput = z.infer<typeof registerWithHouseholdSchema>;
```

## 6. Zarządzanie stanem

### 6.1. Stan server-side (Astro)
- **Lokalizacja:** Sekcja frontmatter w plikach `.astro`
- **Zarządzanie:** 
  - Pobieranie sesji przez `Astro.locals.supabase.auth.getSession()`
  - Pobieranie danych gospodarstwa przez query do `households` i `user_households`
  - Przekazywanie danych jako props do komponentów React

### 6.2. Stan client-side (React)
- **Lokalizacja:** Komponenty React (`UserMenu`, `AuthForm`)
- **Zarządzanie:**
  - Stan dropdown menu: zarządzany wewnętrznie przez Shadcn/ui
  - Stan formularza rejestracji: `react-hook-form` z walidacją Zod
  - Stan ładowania podczas wylogowania: lokalny `useState`

### 6.3. Niestandardowe hooki
- **useAuth:** Istniejący hook rozszerzony o parametr `householdName` w metodzie `register()`
- **Brak potrzeby tworzenia nowych hooków** - istniejący useAuth jest wystarczający

## 7. Integracja API

### 7.1. Supabase Auth API
- **Endpoint:** `supabase.auth.signUp()`
- **Typ żądania:** `{ email: string, password: string }`
- **Typ odpowiedzi:** `{ data: { user: User, session: Session }, error: AuthError | null }`
- **Użycie:** Rejestracja nowego użytkownika

### 7.2. Supabase Database API - Households
- **Operacja:** `supabase.from('households').insert()`
- **Typ żądania:** `{ name: string }`
- **Typ odpowiedzi:** `{ data: Households[], error: PostgrestError | null }`
- **Użycie:** Utworzenie nowego gospodarstwa domowego po rejestracji

### 7.3. Supabase Database API - User Households
- **Operacja:** `supabase.from('user_households').insert()`
- **Typ żądania:** `{ user_id: string, household_id: number }`
- **Typ odpowiedzi:** `{ data: UserHouseholds[], error: PostgrestError | null }`
- **Użycie:** Powiązanie użytkownika z gospodarstwem po rejestracji

### 7.4. Pobieranie danych gospodarstwa (server-side)
- **Operacja:** 
```typescript
const { data: householdData } = await supabase
  .from('user_households')
  .select('household_id, households(name)')
  .eq('user_id', session.user.id)
  .single();
```
- **Typ odpowiedzi:** `{ household_id: number, households: { name: string } }`
- **Użycie:** Wyświetlenie nazwy gospodarstwa w menu użytkownika

## 8. Interakcje użytkownika

### 8.1. Scenariusz: Niezalogowany użytkownik próbuje wejść na stronę główną
1. Użytkownik wpisuje `localhost:3000/` w przeglądarce
2. Astro middleware nie blokuje (nie jest to `/products`)
3. `index.astro` sprawdza sesję server-side
4. Brak sesji → przekierowanie do `/login?redirect=/`
5. Użytkownik widzi formularz logowania

### 8.2. Scenariusz: Nowy użytkownik tworzy konto
1. Użytkownik klika "Create Account" na stronie logowania
2. Przechodzi do `/register`
3. Wypełnia pola: email, password, confirmPassword, **householdName**
4. Walidacja client-side w czasie rzeczywistym (Zod + react-hook-form)
5. Kliknięcie "Create Account" wywołuje `register(email, password, householdName)`
6. Hook `useAuth`:
   - Wywołuje `supabase.auth.signUp()`
   - Po sukcesie tworzy rekord w `households`
   - Następnie tworzy rekord w `user_households`
7. Automatyczne zalogowanie i przekierowanie do `/`
8. Użytkownik widzi stronę główną z ikoną profilu

### 8.3. Scenariusz: Zalogowany użytkownik wylogowuje się
1. Użytkownik klika ikonę profilu (avatar) w prawym górnym rogu
2. Otwiera się dropdown z emailem i nazwą gospodarstwa
3. Użytkownik klika "Wyloguj"
4. Hook `useAuth` wywołuje `supabase.auth.signOut()`
5. Sesja jest usuwana, cookies są czyszczone
6. Przekierowanie do `/login`
7. Użytkownik widzi formularz logowania

### 8.4. Scenariusz: Zalogowany użytkownik odświeża stronę
1. Użytkownik odświeża przeglądarkę (F5)
2. `index.astro` sprawdza sesję server-side
3. Sesja istnieje w cookies → renderowanie strony
4. Pobieranie danych gospodarstwa z bazy
5. Wyświetlenie strony z header i menu użytkownika

## 9. Warunki i walidacja

### 9.1. Walidacja server-side (index.astro)
**Komponent:** `index.astro`
**Warunki:**
- Sprawdzenie `session !== null && session !== undefined`
- Jeśli warunek false → przekierowanie `return Astro.redirect('/login')`

**Wpływ na UI:** Użytkownik nie zobaczy strony głównej, zostanie przekierowany

### 9.2. Walidacja client-side (AuthForm - rejestracja)
**Komponent:** `AuthForm.tsx` w trybie "register"
**Warunki dla pola householdName:**
- Wymagane: niepuste
- Min długość: 2 znaki
- Max długość: 100 znaków
- Regex: `/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s\-_]+$/`
- **Informacja dla użytkownika:** Pod polem wyświetlana jest notka: "Na razie każdy użytkownik tworzy własne gospodarstwo. Możliwość zapraszania znajomych będzie dostępna wkrótce."

**Wpływ na UI:**
- Błąd wyświetlany pod polem jako czerwony tekst
- Przycisk "Create Account" disabled gdy formularz invalid
- Real-time walidacja przy onChange
- Informacyjna notka w kolorze szarym pod polem

### 9.3. Walidacja transakcji tworzenia gospodarstwa
**Komponent:** `useAuth.ts` hook, metoda `register()`
**Warunki:**
1. Sukces `signUp()` → kontynuuj
2. `user.id` nie jest null/undefined → kontynuuj
3. Sukces `insert('households')` → kontynuuj
4. `household_id` otrzymany → kontynuuj
5. Sukces `insert('user_households')` → zakończ

**Wpływ na UI:**
- Przy błędzie w którymkolwiek kroku: wyświetlenie Toast z błędem
- Rollback nie jest automatyczny - należy obsłużyć błędy gracefully

### 9.4. Walidacja dostępu do danych gospodarstwa
**Komponent:** Row Level Security w PostgreSQL
**Warunki:**
- `user_id = auth.uid()` dla tabeli `user_households`
- `household_id IN (SELECT household_id WHERE user_id = auth.uid())` dla `households`

**Wpływ na UI:** Użytkownicy widzą tylko swoje gospodarstwo, brak dostępu do innych

## 10. Obsługa błędów

### 10.1. Błąd: Użytkownik o podanym emailu już istnieje
**Miejsce:** `useAuth.register()` podczas `signUp()`
**Obsługa:**
- Supabase zwraca `AuthError` z kodem `user_already_exists`
- Hook zwraca error do `AuthForm`
- `AuthForm` wywołuje `authError(error.message)` z hooka `useToast`
- Toast wyświetla komunikat: "Ten adres email jest już zarejestrowany"

### 10.2. Błąd: Brak połączenia z bazą podczas tworzenia gospodarstwa
**Miejsce:** `useAuth.register()` podczas `insert('households')`
**Obsługa:**
- Supabase zwraca `PostgrestError`
- Hook loguje błąd przez `logger.error()`
- Zwraca komunikat do użytkownika: "Nie udało się utworzyć gospodarstwa. Spróbuj ponownie."
- Toast wyświetla błąd
- Użytkownik może spróbować ponownie - konto auth już istnieje, ale gospodarstwo nie

### 10.3. Błąd: Session wygasła podczas przeglądania strony
**Miejsce:** Middleware lub `index.astro` podczas sprawdzania sesji
**Obsługa:**
- `getSession()` zwraca `null`
- Automatyczne przekierowanie do `/login?redirect=/`
- Toast z informacją: "Sesja wygasła. Zaloguj się ponownie."

### 10.4. Błąd: Błąd sieciowy podczas wylogowania
**Miejsce:** `UserMenu.tsx` podczas wywoływania `logout()`
**Obsługa:**
- `signOut()` zwraca error
- Wyświetlenie Toast: "Nie udało się wylogować. Sprawdź połączenie."
- Użytkownik może spróbować ponownie
- W najgorszym przypadku: odświeżenie strony wymusi sprawdzenie sesji

### 10.5. Błąd: Brak danych gospodarstwa pomimo zalogowania
**Miejsce:** `index.astro` podczas pobierania danych gospodarstwa
**Obsługa:**
- Query zwraca `null` lub `error`
- Wyświetlenie domyślnej wartości "Brak gospodarstwa" w menu
- Logowanie błędu przez `logger.error()`
- Opcjonalnie: wyświetlenie komunikatu z sugestią kontaktu z supportem

## 11. Kroki implementacji

### Krok 1: Rozszerzenie typów i schematów walidacji
1. Otwórz `src/types.ts`
2. Dodaj nowe typy: `UserHeaderProps`, `UserMenuProps`, `RegisterWithHouseholdInput`, `RegisterWithHouseholdCommand`, `UserWithHouseholdDto`
3. Otwórz `src/lib/validation/auth.ts`
4. Rozszerz istniejący `registerSchema` o pole `householdName` tworząc `registerWithHouseholdSchema`
5. Wyeksportuj typ `RegisterWithHouseholdInput`

### Krok 2: Modyfikacja hooka useAuth
1. Otwórz `src/components/hooks/useAuth.ts`
2. Zmień sygnaturę metody `register()` na: `register(email: string, password: string, householdName: string)`
3. Po sukcesie `signUp()`, dodaj logikę:
   - Insert do `households` z `name: householdName`
   - Pobierz `household_id` z odpowiedzi
   - Insert do `user_households` z `user_id` i `household_id`
4. Dodaj obsługę błędów dla każdego kroku (try-catch)
5. Zwróć odpowiednie komunikaty błędów

### Krok 3: Aktualizacja komponentu AuthForm
1. Otwórz `src/components/AuthForm.tsx`
2. W trybie `register`, zmień używany schemat na `registerWithHouseholdSchema`
3. Dodaj nowe pole formularza między `confirmPassword` a przyciskiem:
   ```tsx
   <div className="space-y-2">
     <Label htmlFor="householdName">Nazwa gospodarstwa *</Label>
     <Input 
       id="householdName" 
       {...register("householdName")} 
       placeholder="np. Rodzina Kowalskich" 
     />
     {errors.householdName && (
       <p className="text-sm text-red-600">{errors.householdName.message}</p>
     )}
     <p className="text-xs text-muted-foreground">
       Na razie każdy użytkownik tworzy własne gospodarstwo. Możliwość zapraszania znajomych będzie dostępna wkrótce.
     </p>
   </div>
   ```
4. Zaktualizuj wywołanie `authRegister()` o trzeci parametr: `householdName`

### Krok 4: Utworzenie komponentu UserMenu
1. Utwórz nowy plik `src/components/UserMenu.tsx`
2. Zaimportuj komponenty z Shadcn/ui: `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuTrigger`
3. Zaimportuj `Button` i ikonę `User` z `lucide-react`
4. Zaimportuj hook `useAuth`
5. Zdefiniuj interface `UserMenuProps`
6. Utwórz komponent funkcyjny z dropdown:
   - Trigger: Button z ikoną User
   - Menu: Email, nazwa gospodarstwa, separator, przycisk "Wyloguj"
7. Obsłuż kliknięcie "Wyloguj" przez wywołanie `logout()` i przekierowanie

### Krok 5: Utworzenie komponentu Header
1. Utwórz nowy plik `src/components/Header.astro`
2. Zdefiniuj interface Props z `userEmail` i `householdName?`
3. Stwórz layout z flexbox:
   - Logo/tytuł po lewej
   - `<UserMenu>` po prawej (z `client:load`)
4. Przekaż propsy do `UserMenu`
5. Dodaj style Tailwind dla responsywności

### Krok 6: Modyfikacja Layout.astro
1. Otwórz `src/layouts/Layout.astro`
2. W sekcji frontmatter dodaj:
   - Sprawdzenie sesji: `const { data: { session } } = await Astro.locals.supabase.auth.getSession()`
   - Warunkowe pobieranie danych gospodarstwa jeśli sesja istnieje
3. Zaimportuj `Header` component
4. Przed `<slot />` dodaj warunkowe renderowanie:
   ```astro
   {session && <Header userEmail={session.user.email} householdName={householdName} />}
   ```

### Krok 7: Modyfikacja index.astro (ochrona strony głównej)
1. Otwórz `src/pages/index.astro`
2. W sekcji frontmatter dodaj na początku:
   ```typescript
   const { data: { session } } = await Astro.locals.supabase.auth.getSession();
   
   if (!session) {
     return Astro.redirect('/login');
   }
   ```
3. Upewnij się, że `Welcome.astro` jest renderowany tylko dla zalogowanych

### Krok 8: Testowanie flow rejestracji
1. Uruchom aplikację lokalnie
2. Przejdź do `/register`
3. Wypełnij formularz z nową nazwą gospodarstwa
4. Zweryfikuj utworzenie rekordów w tabelach `households` i `user_households`
5. Sprawdź automatyczne zalogowanie i przekierowanie do `/`

### Krok 9: Testowanie ochrony strony głównej
1. Wyloguj się z aplikacji
2. Spróbuj wejść bezpośrednio na `localhost:3000/`
3. Zweryfikuj przekierowanie do `/login`
4. Zaloguj się i sprawdź przekierowanie z powrotem do `/`

### Krok 10: Testowanie menu użytkownika i wylogowania
1. Będąc zalogowanym, sprawdź wyświetlanie ikony użytkownika w header
2. Kliknij ikonę i zweryfikuj dropdown
3. Sprawdź wyświetlanie emaila i nazwy gospodarstwa
4. Kliknij "Wyloguj" i zweryfikuj wylogowanie + przekierowanie
5. Sprawdź czy sesja została usunięta (próba wejścia na `/` przekierowuje do `/login`)

### Krok 11: Obsługa błędów i edge cases
1. Testuj rejestrację z istniejącym emailem - sprawdź komunikat błędu
2. Testuj rejestrację z nieprawidłową nazwą gospodarstwa - sprawdź walidację
3. Symuluj błąd sieciowy podczas wylogowania
4. Sprawdź obsługę wygasłej sesji
5. Dodaj console.log w kluczowych miejscach dla debugowania

### Krok 12: Optymalizacja i poprawki UI
1. Dodaj style Tailwind dla responsywności header
2. Sprawdź accessibility (ARIA labels, keyboard navigation)
3. Dodaj animacje dla dropdown menu
4. Sprawdź działanie na różnych rozmiarach ekranu
5. Upewnij się że wszystkie komunikaty są po polsku

### Krok 13: Dokumentacja i commit
1. Zaktualizuj dokumentację w `docs/` o nowe flow autentykacji
2. Dodaj komentarze w kodzie wyjaśniające kluczowe fragmenty
3. Commit zmian z opisowym komunikatem
4. Opcjonalnie: utworzenie testów jednostkowych dla `useAuth`
