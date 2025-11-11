# Plan Testów dla Aplikacji "PantryPal"

**Wersja:** 1.0
**Data:** 11 listopada 2025

## 1. Wprowadzenie i cele testowania

### 1.1. Wprowadzenie
Niniejszy dokument opisuje plan testów dla aplikacji webowej "PantryPal", która służy do zarządzania domową spiżarnią. Aplikacja umożliwia użytkownikom dodawanie produktów (ręcznie lub za pomocą skanera kodów kreskowych/OCR), śledzenie ich ilości i dat ważności oraz zarządzanie listami zakupów.

### 1.2. Cele testowania
Głównym celem testów jest zapewnienie wysokiej jakości, bezpieczeństwa i niezawodności aplikacji przed jej wdrożeniem produkcyjnym.

Cele szczegółowe:
- Weryfikacja, czy wszystkie funkcjonalności działają zgodnie ze specyfikacją.
- Zapewnienie bezpieczeństwa danych użytkowników, w szczególności poprzez weryfikację polityk dostępu (RLS).
- Potwierdzenie stabilności i wydajności aplikacji pod obciążeniem.
- Zapewnienie spójnego i intuicyjnego interfejsu użytkownika na różnych urządzeniach i przeglądarkach.
- Identyfikacja i eliminacja błędów krytycznych i wysokiego priorytetu.

## 2. Zakres testów

### 2.1. Funkcjonalności objęte testami
- Moduł uwierzytelniania (rejestracja, logowanie, reset hasła, zarządzanie sesją).
- Pełen cykl życia produktu (operacje CRUD: tworzenie, odczyt, aktualizacja, usuwanie).
- Ręczne dodawanie produktów za pomocą formularza.
- Dodawanie produktów za pomocą skanera kodów kreskowych.
- Dodawanie produktów za pomocą skanera OCR.
- Zarządzanie listą ulubionych produktów.
- Walidacja danych wejściowych po stronie klienta i serwera.
- Polityki bezpieczeństwa na poziomie wierszy (RLS) w bazie danych Supabase.

### 2.2. Funkcjonalności wyłączone z testów
- Testy samego frameworka Astro i biblioteki React (zakładamy ich stabilność).
- Testy jednostkowe zewnętrznych bibliotek (np. Shadcn/ui), skupiamy się na ich integracji.
- Testy panelu administracyjnego Supabase.

## 3. Rodzaje testów

- **Testy jednostkowe (Unit Tests):** Weryfikacja pojedynczych komponentów React, hooków, funkcji pomocniczych i serwisów.
- **Testy integracyjne (Integration Tests):** Sprawdzanie współpracy między komponentami, interakcji z API oraz poprawności integracji z Supabase.
- **Testy E2E (End-to-End):** Symulacja pełnych scenariuszy użytkownika, np. od rejestracji, przez dodanie produktu, po jego usunięcie.
- **Testy bezpieczeństwa (Security Tests):** Weryfikacja polityk RLS, ochrona przed atakami (np. SQL Injection, XSS), zarządzanie sesją.
- **Testy wydajnościowe (Performance Tests):** Pomiar czasu odpowiedzi API, czasu ładowania stron, zużycia zasobów.
- **Testy wizualnej regresji (Visual Regression Tests):** Automatyczne porównywanie zrzutów ekranu interfejsu w celu wykrycia niezamierzonych zmian wizualnych.
- **Testy manualne (Manual Tests):** Testy eksploracyjne i scenariusze trudne do zautomatyzowania (np. interakcje ze skanerem na urządzeniach mobilnych).

## 4. Scenariusze testowe (przykłady)

### 4.1. Uwierzytelnianie
- **Scenariusz 1:** Użytkownik pomyślnie rejestruje się i loguje do aplikacji.
- **Scenariusz 2:** Użytkownik próbuje zalogować się z błędnym hasłem.
- **Scenariusz 3:** Użytkownik resetuje zapomniane hasło.
- **Scenariusz 4:** Użytkownik niezalogowany próbuje uzyskać dostęp do strony chronionej.

### 4.2. Zarządzanie produktami
- **Scenariusz 1:** Użytkownik dodaje nowy produkt ręcznie, wypełniając wszystkie pola formularza.
- **Scenariusz 2:** Użytkownik dodaje produkt, skanując jego kod kreskowy za pomocą kamery.
- **Scenariusz 3:** Użytkownik edytuje istniejący produkt, zmieniając jego datę ważności.
- **Scenariusz 4:** Użytkownik usuwa produkt ze swojej spiżarni.

### 4.3. Bezpieczeństwo (RLS)
- **Scenariusz 1:** Użytkownik A loguje się i widzi tylko swoje produkty.
- **Scenariusz 2:** Użytkownik B loguje się i nie widzi produktów użytkownika A.
- **Scenariusz 3:** Użytkownik A próbuje (np. przez bezpośrednie zapytanie API) odczytać/zmodyfikować produkt użytkownika B – operacja kończy się niepowodzeniem.

## 5. Środowisko testowe

- **Środowisko deweloperskie:** Lokalne maszyny deweloperów z uruchomioną instancją Supabase (Docker).
- **Środowisko testowe (Staging):** Dedykowana instancja aplikacji wdrożona na platformie Vercel/Netlify, połączona z osobnym projektem Supabase. Baza danych na tym środowisku będzie regularnie czyszczona i wypełniana danymi testowymi (`seed.sql`).
- **Przeglądarki:** Chrome (najnowsza wersja), Firefox (najnowsza wersja), Safari (najnowsza wersja).
- **Urządzenia mobilne:** iOS (iPhone 13+), Android (Samsung Galaxy S21+ lub podobny) do testów skanerów.

## 6. Narzędzia testowe

- **Framework do testów jednostkowych i integracyjnych:** Vitest
- **Biblioteka do testowania komponentów React:** React Testing Library
- **Framework do testów E2E:** Playwright
- **Narzędzie do testów wydajności API:** k6
- **Narzędzie do testów wizualnej regresji:** Playwright lub Chromatic
- **Narzędzie do inspekcji API:** Postman / cURL

## 7. Harmonogram testów

- **Faza 1: Testy jednostkowe i integracyjne (ciągłe):** Równolegle z procesem deweloperskim.
- **Faza 2: Testy E2E i bezpieczeństwa (18.11.2025 - 22.11.2025):** Po zakończeniu implementacji głównych funkcjonalności.
- **Faza 3: Testy wydajnościowe i wizualnej regresji (23.11.2025 - 25.11.2025):** Przed wdrożeniem na środowisko Staging.
- **Faza 4: Testy akceptacyjne użytkownika (UAT) i manualne (26.11.2025 - 28.11.2025):** Na środowisku Staging.
- **Faza 5: Testy regresji (przed każdym wdrożeniem):** Po wprowadzeniu poprawek i nowych funkcji.

## 8. Kryteria akceptacji testów

- **Kryterium wyjścia:**
  - 100% testów jednostkowych i integracyjnych zakończonych pomyślnie.
  - 95% krytycznych i wysokiego priorytetu scenariuszy E2E zakończonych pomyślnie.
  - Brak otwartych błędów o priorytecie krytycznym lub wysokim.
  - Pokrycie kodu testami (code coverage) na poziomie co najmniej 80%.

## 9. Role i odpowiedzialności

- **Deweloperzy:** Tworzenie testów jednostkowych i integracyjnych, naprawa zgłoszonych błędów.
- **Inżynier QA:** Projektowanie i implementacja testów E2E, bezpieczeństwa i wydajnościowych. Przeprowadzanie testów manualnych, zarządzanie procesem zgłaszania błędów.
- **Product Owner:** Udział w testach akceptacyjnych (UAT), weryfikacja zgodności produktu z wymaganiami.

## 10. Procedura zgłaszania błędów

Wszystkie błędy znalezione podczas testów będą zgłaszane w systemie do śledzenia zadań (np. Jira, GitHub Issues).

Każde zgłoszenie powinno zawierać:
- Tytuł: Krótki i zwięzły opis problemu.
- Opis: Szczegółowe kroki do odtworzenia błędu.
- Oczekiwany rezultat: Jak aplikacja powinna się zachować.
- Rzeczywisty rezultat: Jak aplikacja się zachowała.
- Priorytet: Krytyczny, Wysoki, Średni, Niski.
- Środowisko: Gdzie błąd wystąpił (np. przeglądarka, system operacyjny, urządzenie).
- Załączniki: Zrzuty ekranu, nagrania wideo, logi z konsoli.
