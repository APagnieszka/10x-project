# Plan Integracji Logowania z Backendem Astro - Foodzilla

## Przegląd
Plan integracji logowania z backendem Astro na podstawie specyfikacji autentyfikacji (.ai/auth-spec.md), wymagań produktu (.ai/prd.md) oraz najlepszych praktyk Astro i React. Implementacja opiera się na Supabase Auth SDK, zapewniając bezpieczeństwo, SSR i zgodność z US-001/US-002.

## Rekomendacje Kluczowe
1. **Sesje i ochrona tras**: Używać middleware Astro do server-side sprawdzania sesji i przekierowań.
2. **Stan autentyfikacji w React**: Globalny AuthContext dla synchronizacji stanu sesji.
3. **Obsługa błędów Supabase**: Rozszerzyć Toast.tsx o mapowanie błędów auth na wielojęzyczne komunikaty.
4. **Walidacja i bezpieczeństwo**: Client-side Zod + server-side w middleware, RLS dla danych.
5. **Integracja z kodem**: Hook useAuth dla separacji odpowiedzialności i przekierowań.

## Kroki Implementacji

### Krok 1: Rozszerz Middleware o Ochronę Tras
- Plik: `src/middleware/index.ts`
- Zadanie: Dodać sprawdzenie sesji Supabase przed renderowaniem chronionych stron (np. `/products/*`).
- Szczegóły: Użyć `supabase.auth.getUser()` do weryfikacji, przekierować niezalogowanych na `/login?redirect=...`.
- Test: Próba dostępu do `/products/add` bez logowania powinna przekierować.

### Krok 2: Stwórz AuthContext i useAuth Hook
- Pliki: `src/components/AuthContext.tsx`, `src/components/hooks/useAuth.ts`
- Zadanie: Globalny kontekst React dla stanu sesji, hook useAuth dla metod auth (login, logout).
- Szczegóły: Nasłuchiwać `onAuthStateChange`, przechowywać user w state, używać cookies Supabase.
- Test: Stan użytkownika powinien synchronizować się między komponentami React.

### Krok 3: Rozszerz Toast o Błędy Auth
- Plik: `src/lib/auth-errors.ts`, `src/components/Toast.tsx`
- Zadanie: Mapowanie błędów Supabase na komunikaty (pl/en), integracja z Toast.
- Szczegóły: Obiekt authErrorMessages, wywołanie toast.error w AuthForm.
- Test: Błędne logowanie powinno wyświetlić toast z komunikatem.

### Krok 4: Dodaj Walidację Server-Side w Middleware
- Plik: `src/middleware/index.ts`
- Zadanie: Server-side walidacja użytkownika przed dostępem do API.
- Szczegóły: Użyć Zod dla user schema, sprawdzić przed dostępem do `/api/*`.
- Test: Nieprawidłowa sesja powinna zwracać 401.

### Krok 5: Zintegruj useAuth w AuthForm.tsx
- Plik: `src/components/AuthForm.tsx`
- Zadanie: Użyć hooka useAuth w onSubmit, obsłużyć przekierowanie po sukcesie.
- Szczegóły: Usunąć props onSubmit, dodać wywołanie login z hooka.
- Test: Logowanie powinno przekierować na stronę główną lub redirect.

## Kryteria Akceptacji
- Zgodność z US-001/US-002: Rejestracja/logowanie z e-mailem/hasłem, błędy, przekierowania.
- Bezpieczeństwo: RLS włączone, brak dostępu bez sesji.
- Wydajność: SSR dla chronionych stron, minimalne client-side checks.
- Testowalność: Hooki i komponenty testowalne, separacja odpowiedzialności.

## Ryzyka i Mitigacje
- Hydratacja React: Używać client:only dla AuthForm, unikać SSR dla auth komponentów.
- Wielojęzyczność: Zaimplementować i18n dla błędów (rozszerzenie przyszłe).
- Brute-force: Polegać na Supabase rate limiting.

## Następne Kroki
Po implementacji: Testy integracyjne, walidacja z PRD, ewentualne rozszerzenia (reset hasła, rejestracja).