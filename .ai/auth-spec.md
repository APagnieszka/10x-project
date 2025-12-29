# Specyfikacja Architektury Modułu Autentyfikacji - Foodzilla

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### Zmiany w Warstwie Frontendu

#### Nowe Strony i Komponenty
- **Strona rejestracji** (`/register`): Statyczna strona Astro zawierająca formularz rejestracji w komponencie React. Wyświetla notkę o polityce prywatności i zbieraniu danych anonimowych zgodnie z US-001.
- **Strona logowania** (`/login`): Statyczna strona Astro z formularzem logowania React, włączając link do resetowania hasła zgodnie z US-002.
- **Strona resetowania hasła** (`/reset-password`): Strona Astro z formularzem React do wprowadzania adresu e-mail, inicjuje proces resetowania przez Supabase.
- **Strona wylogowania** (`/logout`): Prosta strona Astro obsługująca wylogowanie i przekierowanie na stronę główną.
- **Komponenty React**: 
  - `AuthForm.tsx`: Wielofunkcyjny komponent formularza obsługujący rejestrację, logowanie i reset hasła z walidacją client-side.
  - `AuthGuard.tsx`: Komponent wyższego rzędu chroniący trasy, przekierowujący niezalogowanych użytkowników na `/login`.
  - Rozszerzenie istniejących komponentów: `Layout.astro` o logikę wyświetlania nawigacji w zależności od stanu autentyfikacji.

#### Rozszerzenie Istniejących Elementów
- **Layout główny** (`Layout.astro`): Dodanie warunkowego renderowania nawigacji i przycisków logowania/wylogowania w zależności od stanu sesji użytkownika.
- **Chronione strony**: Strony takie jak `/products/add.astro` i główna strona inwentarza będą wymagać autentyfikacji poprzez `AuthGuard`, rozszerzając istniejący `Layout.astro` o sprawdzenie sesji.
- **Komponenty nawigacyjne**: Dodanie linków do rejestracji/logowania w komponentach takich jak `Welcome.astro` dla użytkowników niezalogowanych.

#### Rozdzielenie Odpowiedzialności
- **Strony Astro**: Odpowiadają za renderowanie statycznych szablonów, integrację z backendem poprzez middleware, obsługę przekierowań i server-side rendering chronionych treści. Używane dla stron autentyfikacji i głównych widoków aplikacji.
- **Komponenty React**: Obsługują interaktywne formularze autentyfikacji z walidacją w czasie rzeczywistym, zarządzaniem stanem formularzy (np. za pomocą React Hook Form), komunikacją z Supabase Auth SDK po stronie klienta. Integrują się z Astro poprzez `client:only="react"` dla dynamicznych elementów.

#### Walidacja i Komunikaty Błędów
- **Client-side walidacja**: Implementacja schematów Zod w komponentach React dla natychmiastowej walidacji pól formularza (e-mail, hasło). Komunikaty błędów wyświetlane w czasie rzeczywistym pod polami.
- **Server-side walidacja**: Dodatkowa walidacja w endpointach API przy użyciu Zod, zwracająca błędy HTTP z opisowymi komunikatami.
- **Obsługa błędów**: Komponent `Toast.tsx` rozszerzony o wyświetlanie błędów autentyfikacji (np. "Nieprawidłowe dane logowania", "Adres e-mail już istnieje"). Sukcesy potwierdzane toastami (np. "Rejestracja zakończona sukcesem, sprawdź e-mail").

#### Kluczowe Scenariusze Użytkownika
- **Rejestracja**: Użytkownik wypełnia formularz, po sukcesie automatyczne logowanie i przekierowanie na stronę główną, wysłanie e-maila potwierdzającego.
- **Logowanie**: Po wprowadzeniu danych, przekierowanie na poprzednią stronę lub stronę główną; opcja "Zapomniałem hasła" prowadzi do resetowania.
- **Reset hasła**: Wprowadzenie e-maila inicjuje proces Supabase, użytkownik otrzymuje link do zmiany hasła.
- **Wylogowanie**: Czyszczenie sesji i przekierowanie na stronę główną.
- **Chroniony dostęp**: Próba dostępu do chronionych stron bez logowania przekierowuje na `/login` z parametrem `redirect`.

## 2. LOGIKA BACKENDOWA

### Struktura Endpointów API i Modeli Danych
- **Brak dedykowanych endpointów API dla autentyfikacji**: Funkcjonalność rejestracji, logowania, wylogowania i resetowania hasła jest obsługiwana bezpośrednio przez Supabase Auth SDK po stronie klienta w komponentach React, zgodnie z zaleceniami Supabase dla aplikacji frontendowych. Nie wymaga to własnych endpointów API, aby uniknąć nadmiarowości i uprościć architekturę.
- **Modele danych**: 
  - `UserProfile`: Interfejs TypeScript rozszerzający Supabase `User` o pola takie jak `household_id`, zgodny z istniejącymi typami w `src/types.ts` i wymaganiami wspólnego konta dla gospodarstwa domowego.
  - Schematy Zod: `RegisterSchema`, `LoginSchema`, `ResetPasswordSchema` dla walidacji wejścia po stronie klienta.

### Mechanizm Walidacji Danych Wejściowych
- **Client-side walidacja**: Schematy Zod integrowane z React Hook Form dla walidacji pól (e-mail format, hasło długość ≥8 znaków, potwierdzenie hasła). Brak server-side walidacji dla auth, ponieważ Supabase obsługuje walidację wewnętrzną i błędy są obsługiwane po stronie klienta.

### Obsługa Wyjątków
- **Błędy Supabase**: Przechwytywane w komponentach React, mapowane na komunikaty błędów wyświetlane przez `Toast.tsx`. Szczegóły błędów logowane przez `src/lib/logger.ts` dla debugowania.

### Aktualizacja Sposobu Renderowania Server-Side
- **Chronione strony**: Rozszerzenie middleware `src/middleware/index.ts` o sprawdzenie sesji Supabase przed renderowaniem. Dla niezalogowanych użytkowników, przekierowanie na `/login`. Użycie `Astro.locals.supabase.auth.getUser()` dla weryfikacji sesji.
- **Konfiguracja Astro**: Wykorzystanie `output: "server"` w `astro.config.mjs` dla SSR chronionych stron, zapewniając dostęp do sesji po stronie serwera.

## 3. SYSTEM AUTENTYKACJI

### Wykorzystanie Supabase Auth
- **Rejestracja**: Wywołanie `supabase.auth.signUp()` z e-mailem i hasłem, automatyczne wysyłanie e-maila potwierdzającego przez Supabase.
- **Logowanie**: `supabase.auth.signInWithPassword()` dla uwierzytelnienia, przechowywanie sesji w cookies po stronie klienta.
- **Wylogowanie**: `supabase.auth.signOut()` dla czyszczenia sesji.
- **Reset hasła**: `supabase.auth.resetPasswordForEmail()` inicjuje proces, użytkownik otrzymuje link do zmiany hasła obsługiwany przez Supabase.
- **Integracja z Astro**: Middleware dodaje klienta Supabase do `Astro.locals`, umożliwiając dostęp do metod auth w komponentach Astro i API routes. Sesje zarządzane poprzez cookies dla utrzymania stanu między requestami.

### Kluczowe Wnioski
Architektura opiera się na integracji Supabase Auth z Astro SSR, zapewniając bezpieczny dostęp do danych gospodarstwa domowego. Frontend dzieli odpowiedzialność między statyczne strony Astro a interaktywne komponenty React, z walidacją po stronie klienta. Backend koncentruje się na middleware dla ochrony tras i sesji. Rozwiązanie jest zgodne z istniejącą strukturą aplikacji, rozszerzając ją o funkcjonalności autentyfikacji bez naruszania logiki produktów i PWA.

## 4. DIAGRAM PROCESU AUTENTYKACJI

Poniższy diagram Mermaid przedstawia sekwencję interakcji w procesie autentyfikacji, integracji z Supabase Auth oraz ochrony dostępu do API i stron.

```mermaid
sequenceDiagram
    participant U as Użytkownik
    participant FE as Frontend (Astro/React)
    participant SB as Supabase Auth
    participant MW as Middleware (Astro)
    participant API as API Endpoint (/api/products)
    participant DB as Baza danych (RLS)

    %% Rejestracja
    U->>FE: Wypełnia formularz rejestracji (/register)
    FE->>SB: supabase.auth.signUp(email, password)
    SB-->>FE: Sukces + sesja + e-mail potwierdzający
    FE-->>U: Przekierowanie na stronę główną (automatyczne logowanie)

    %% Logowanie
    U->>FE: Wprowadza dane logowania (/login)
    FE->>SB: supabase.auth.signInWithPassword(email, password)
    SB-->>FE: Sesja (JWT token w cookies)
    FE-->>U: Przekierowanie na chronioną stronę

    %% Dostęp do chronionej strony
    U->>FE: Próba dostępu do /products/add
    FE->>MW: Sprawdzanie sesji (Astro.locals.supabase.auth.getUser)
    MW->>SB: Weryfikacja JWT
    SB-->>MW: Użytkownik uwierzytelniony
    MW-->>FE: Renderowanie strony z danymi

    %% Wywołanie API
    FE->>API: Żądanie POST /api/products z Authorization: Bearer <token>
    API->>MW: Sprawdzanie tokena (locals.supabase.auth.getUser(token))
    MW->>SB: Weryfikacja JWT
    SB-->>MW: Dane użytkownika
    MW-->>API: Token ważny, kontynuacja
    API->>DB: Zapytanie z RLS (auth.uid() dla autoryzacji)
    DB-->>API: Dane produktu
    API-->>FE: Odpowiedź z produktem

    %% Reset hasła
    U->>FE: Wprowadza e-mail (/reset-password)
    FE->>SB: supabase.auth.resetPasswordForEmail(email)
    SB-->>U: E-mail z linkiem do resetowania

    %% Wylogowanie
    U->>FE: Kliknięcie wylogowania (/logout)
    FE->>SB: supabase.auth.signOut()
    SB-->>FE: Sesja wyczyszczona
    FE-->>U: Przekierowanie na stronę główną
```</content>
<parameter name="filePath">/Users/agnieszka.podbielska/reposSSH/AI/10x-project/.ai/auth-spec.md