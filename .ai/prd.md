# Dokument wymagań produktu (PRD) - Foodzilla

## 1. Przegląd produktu
Foodzilla to aplikacja internetowa (PWA) zaprojektowana, aby pomóc gospodarstwom domowym w ograniczaniu marnowania żywności. Aplikacja umożliwia szybkie i łatwe dodawanie produktów spożywczych, śledzenie ich dat ważności oraz otrzymywanie powiadomień o zbliżającym się terminie przydatności do spożycia. Kluczowe funkcje MVP obejmują skanowanie kodów kreskowych w celu automatycznego pobierania informacji o produkcie, rozpoznawanie dat ważności ze zdjęć (OCR) oraz system powiadomień push i e-mail. Aplikacja jest dostępna w językach polskim i angielskim, z możliwością wyboru przez użytkownika, i zbudowana w oparciu o darmowe technologie, takie jak QuaggaJS, Tesseract.js i Supabase, co minimalizuje koszty operacyjne.

## 2. Problem użytkownika
Współczesne gospodarstwa domowe, w szczególności rodziny, często borykają się z problemem marnowania żywności. Produkty spożywcze, zwłaszcza te przechowywane w głębi lodówki lub szafek, są zapominane, a ich termin ważności upływa, zanim zostaną zużyte. Prowadzi to nie tylko do strat finansowych, ale także ma negatywny wpływ na środowisko. Brak prostego i szybkiego narzędzia do inwentaryzacji posiadanej żywności i monitorowania jej świeżości sprawia, że zarządzanie zapasami jest nieefektywne i czasochłonne.

## 3. Wymagania funkcjonalne
- **Uwierzytelnianie:** Użytkownicy mogą założyć jedno wspólne konto dla całego gospodarstwa domowego przy użyciu adresu e-mail i hasła. Reset hasła jest obsługiwany przez domyślny mechanizm Supabase.
- **Bezpieczny dostęp i autoryzacja:** Dane konta, historia zakupów i stan produktów są widoczne tylko dla zalogowanych użytkowników na tym samym koncie gospodarstwa domowego. Nieautoryzowani użytkownicy nie mają dostępu do danych innych gospodarstw. System używa bezpiecznych mechanizmów autoryzacji Supabase do ochrony prywatności i zapobiegania nieautoryzowanemu dostępowi.
- **Dodawanie produktu:**
    - Skanowanie kodu kreskowego (za pomocą QuaggaJS) w celu automatycznego pobrania danych o produkcie z bazy Open Food Facts.
    - Ręczne wprowadzanie danych produktu jako alternatywa dla skanowania lub w przypadku braku produktu w bazie.
    - Możliwość dodania zdjęcia daty ważności, która jest automatycznie rozpoznawana przez Tesseract.js (OCR). Data jest zapisywana automatycznie przy pewności ≥ 90%; w przeciwnym razie użytkownik jest proszony o potwierdzenie.
    - Ręczne wprowadzanie daty z opcją użycia skrótów (np. "+1 tydzień").
- **Zarządzanie produktami:**
    - Oznaczanie produktu jako "otwarty" (`opened`) wraz z datą otwarcia (`opened_date`).
    - Przenoszenie produktu do listy zakupów (status `ToBuy`), co powoduje usunięcie go z inwentarza.
    - Interaktywna lista zakupów z możliwością odznaczenia produktów jako kupionych, co przenosi je do listy draft na uzupełnienie szczegółów przed dodaniem do inwentarza.
    - Łatwe usuwanie produktów oznaczonych jako skonsumowane.
    - Oznaczanie produktu jako "zepsuty" (`spoiled`), co tworzy wpis w bazie danych i pozwala na śledzenie ilości zmarnowanej żywności oraz generowanie tygodniowego raportu. Po oznaczeniu, użytkownik jest pytany, czy usunąć produkt z inwentarza, czy przenieść do listy zakupów.
- **Raporty i analizy marnowania żywności:**
    - Raporty tygodniowe podsumowujące ilość zepsutych produktów są zapisywane w bazie danych, aby były dostępne historycznie.
    - Użytkownik może przeglądać historyczne raporty tygodniowe w aplikacji.
    - Użytkownik może wygenerować podsumowujący raport miesięczny lub roczny na podstawie zgromadzonych danych o zepsutych produktach.
- **Powiadomienia:**
    - Powiadomienia web-push (przez Service Worker w PWA) oraz dzienny digest e-mailowy wysyłany o 8:00 rano czasu lokalnego gospodarstwa.
    - Domyślne przypomnienia na 3 dni i 1 dzień przed upływem daty ważności.
    - Dodatkowy monit dla produktów oznaczonych jako "otwarte" przez ponad 3 dni.
- **Przechowywanie danych i zdjęć:**
    - Zdjęcia kodów kreskowych i produktów są przechowywane bezterminowo.
    - Zdjęcia dat ważności są automatycznie usuwane po 100 dniach.
- **Prywatność i analityka:**
    - Zbieranie anonimowych zdarzeń (np. `product_added`, `ocr_success`, `product_spoiled`) w celu analizy użytkowania.
    - Użytkownik jest informowany o zbieraniu danych podczas rejestracji i ma możliwość rezygnacji (opt-out).
- **Obsługa konfliktów:** W przypadku jednoczesnej edycji tego samego produktu przez wielu użytkowników na wspólnym koncie, stosowana jest strategia "last-write-wins".
- **Wybór języka:** Użytkownicy mogą wybrać język aplikacji między polskim a angielskim. Domyślnie ustawiony jest język polski.

## 4. Granice projektu
Wersja MVP nie obejmuje następujących funkcji:
- Integracji z inteligentnymi urządzeniami (np. lodówkami).
- Zaawansowanej analityki i personalizowanych rekomendacji.
- Synchronizacji między wieloma kontami użytkowników w ramach jednego gospodarstwa (MVP zakłada jedno wspólne konto).
- Dedykowanych aplikacji mobilnych na platformy iOS/Android (dostępna jest tylko PWA).
- Funkcji płatności i monetyzacji.

## 5. Historyjki użytkowników

- **ID:** US-001
- **Tytuł:** Rejestracja konta dla gospodarstwa domowego
- **Opis:** Jako nowy użytkownik, chcę móc założyć jedno wspólne konto dla mojego gospodarstwa domowego, używając adresu e-mail i hasła, aby wszyscy domownicy mogli z niego korzystać.
- **Kryteria akceptacji:**
    - Formularz rejestracji wymaga podania prawidłowego adresu e-mail i hasła.
    - Po pomyślnej rejestracji użytkownik jest automatycznie zalogowany.
    - System wysyła e-mail z prośbą o potwierdzenie adresu.
    - Podczas rejestracji wyświetlana jest krótka notka o polityce prywatności i zbieraniu anonimowych danych.

- **ID:** US-002
- **Tytuł:** Logowanie do aplikacji
- **Opis:** Jako powracający użytkownik, chcę móc zalogować się na konto mojego gospodarstwa domowego przy użyciu e-maila i hasła.
- **Kryteria akceptacji:**
    - Użytkownik może się zalogować, podając prawidłowe dane.
    - W przypadku błędnych danych, wyświetlany jest komunikat o błędzie.
    - Dostępna jest opcja "Zapomniałem hasła", która inicjuje proces resetowania hasła przez Supabase.

- **ID:** US-003
- **Tytuł:** Szybkie dodawanie produktu przez skanowanie kodu kreskowego
- **Opis:** Jako użytkownik, chcę zeskanować kod kreskowy produktu, aby automatycznie wypełnić jego nazwę i markę, oszczędzając czas na ręcznym wpisywaniu.
- **Kryteria akceptacji:**
    - Aplikacja aktywuje aparat w celu zeskanowania kodu kreskowego.
    - Po pomyślnym zeskanowaniu, dane produktu są pobierane z Open Food Facts i wyświetlane w formularzu.
    - Jeśli produkt nie zostanie znaleziony, użytkownik jest informowany i może wprowadzić dane ręcznie.

- **ID:** US-004
- **Tytuł:** Dodawanie daty ważności za pomocą OCR
- **Opis:** Jako użytkownik, chcę zrobić zdjęcie etykiety z datą ważności, aby system automatycznie ją rozpoznał i wypełnił odpowiednie pole.
- **Kryteria akceptacji:**
    - Użytkownik może zrobić zdjęcie lub wybrać je z galerii.
    - OCR (Tesseract.js) analizuje obraz i próbuje rozpoznać datę w formacie YYYY-MM-DD.
    - Jeśli pewność rozpoznania jest ≥ 90%, data jest automatycznie zapisywana.
    - Jeśli pewność jest < 90%, data jest proponowana użytkownikowi do potwierdzenia lub ręcznej korekty.

- **ID:** US-005
- **Tytuł:** Ręczne dodawanie produktu
- **Opis:** Jako użytkownik, chcę mieć możliwość ręcznego dodania produktu, który nie ma kodu kreskowego (np. warzywa) lub nie został znaleziony w bazie.
- **Kryteria akceptacji:**
    - Formularz pozwala na wpisanie nazwy, marki (opcjonalnie), ilości i jednostki.
    - Użytkownik może ręcznie wprowadzić datę ważności lub użyć skrótów (+1 tydzień, +1 miesiąc).
    - Użytkownik może wybrać produkt z listy ulubionych, co wstępnie wypełnia formularz nazwą i marką.
    - Po wypełnieniu wymaganych pól, produkt jest dodawany do inwentarza.

- **ID:** US-006
- **Tytuł:** Otrzymywanie powiadomień o zbliżającej się dacie ważności
- **Opis:** Jako użytkownik, chcę otrzymywać powiadomienia (push i e-mail), gdy data ważności produktu zbliża się ku końcowi, aby zdążyć go zużyć.
- **Kryteria akceptacji:**
    - System wysyła powiadomienia na 3 dni i 1 dzień przed upływem daty ważności.
    - Użytkownik może włączyć/wyłączyć powiadomienia web-push oraz e-mailowy digest w ustawieniach.
    - Codziennie o 8:00 rano wysyłany jest e-mailowy digest z listą produktów, których data ważności wkrótce upłynie.

- **ID:** US-007
- **Tytuł:** Oznaczanie produktu jako "otwarty"
- **Opis:** Jako użytkownik, chcę móc oznaczyć produkt jako "otwarty", aby system mógł monitorować jego świeżość po otwarciu.
- **Kryteria akceptacji:**
    - Przy produkcie znajduje się przełącznik do oznaczenia go jako "otwarty".
    - Po oznaczeniu zapisywana jest data otwarcia.
    - System wysyła monit, jeśli produkt jest otwarty dłużej niż 3 dni (domyślnie).

- **ID:** US-008
- **Tytuł:** Przenoszenie produktu do listy zakupów
- **Opis:** Jako użytkownik, po zużyciu produktu chcę mieć możliwość łatwego przeniesienia go na listę zakupów, aby pamiętać o jego ponownym kupnie.
- **Kryteria akceptacji:**
    - Przy usuwaniu produktu z inwentarza dostępna jest opcja "Dodaj do listy zakupów".
    - Po wybraniu tej opcji, produkt jest usuwany z inwentarza i pojawia się na liście zakupów.

- **ID:** US-009
- **Tytuł:** Zarządzanie prywatnością i analityką
- **Opis:** Jako użytkownik, chcę mieć kontrolę nad zbieraniem anonimowych danych o moim użytkowaniu aplikacji.
- **Kryteria akceptacji:**
    - W ustawieniach konta znajduje się przełącznik do włączenia/wyłączenia zbierania danych analitycznych.
    - Domyślnie zbieranie danych jest włączone.
    - Dane są w pełni anonimowe i nie zawierają informacji umożliwiających identyfikację osoby.

- **ID:** US-010
- **Tytuł:** Wybór istniejącego produktu przy ponownym zakupie
- **Opis:** Jako użytkownik, który ponownie kupił ten sam produkt, chcę móc wybrać go z listy już dodanych produktów, aby nie musieć ponownie skanować kodu kreskowego i robić zdjęć.
- **Kryteria akceptacji:**
    - Podczas dodawania produktu, po zeskanowaniu kodu, jeśli produkt już istnieje w bazie, użytkownik może go wybrać z listy.
    - Wybranie istniejącego produktu wstępnie wypełnia formularz, wymagając jedynie podania nowej daty ważności.

- **ID:** US-011
- **Tytuł:** Oznaczanie produktu jako zepsuty i generowanie tygodniowego raportu
- **Opis:** Jako użytkownik, chcę móc oznaczyć produkt jako zepsuty, aby system mógł śledzić ilość zmarnowanej żywności i generować tygodniowy raport podsumowujący ilość zepsutych produktów.
- **Kryteria akceptacji:**
    - Przy produkcie znajduje się opcja oznaczenia go jako "zepsuty".
    - Po oznaczeniu, produkt jest oznaczany jako zepsuty (wpis w bazie danych), a użytkownik jest pytany, czy usunąć go z inwentarza, czy przenieść do listy zakupów.
    - Raz w tygodniu (np. w niedzielę) generowany jest raport podsumowujący ilość zepsutych produktów w danym tygodniu, wysyłany e-mailem lub dostępny w aplikacji.
    - Raporty tygodniowe są zapisywane w bazie danych, aby były dostępne historycznie.
    - Użytkownik może przeglądać historyczne raporty tygodniowe w aplikacji.
    - Użytkownik może wygenerować podsumowujący raport miesięczny lub roczny na podstawie zgromadzonych danych o zepsutych produktach.

- **ID:** US-012
- **Tytuł:** Wybór języka aplikacji
- **Opis:** Jako użytkownik, chcę móc wybrać język aplikacji między polskim a angielskim, aby korzystać z niej w preferowanym języku.
- **Kryteria akceptacji:**
    - W ustawieniach aplikacji dostępny jest przełącznik lub lista wyboru języka (polski lub angielski).
    - Domyślnie ustawiony jest język polski.
    - Zmiana języka wpływa na cały interfejs aplikacji, w tym komunikaty, etykiety i powiadomienia.

- **ID:** US-013
- **Tytuł:** Usuwanie zużytego produktu
- **Opis:** Jako użytkownik, chcę móc łatwo usunąć produkt z inwentarza po jego zużyciu, bez konieczności przenoszenia go do listy zakupów.
- **Kryteria akceptacji:**
    - Przy produkcie dostępna jest opcja "Usuń" lub "Oznacz jako zużyty".
    - Po wybraniu opcji, produkt zostaje całkowicie usunięty z inwentarza bez dodatkowych pytań.
    - Usunięcie jest nieodwracalne, ale użytkownik może dodać produkt ponownie, jeśli to konieczne.

- **ID:** US-014
- **Tytuł:** Zarządzanie przechowywaniem zdjęć
- **Opis:** Jako użytkownik, chcę, aby zdjęcia dat ważności były automatycznie usuwane po pewnym czasie, aby oszczędzać miejsce w pamięci aplikacji i chronić prywatność.
- **Kryteria akceptacji:**
    - Zdjęcia dat ważności są automatycznie usuwane po 100 dniach od dodania produktu.
    - Zdjęcia kodów kreskowych i produktów są przechowywane bezterminowo.
    - Użytkownik jest informowany o polityce przechowywania podczas dodawania zdjęć.

- **ID:** US-015
- **Tytuł:** Obsługa jednoczesnej edycji produktów
- **Opis:** Jako użytkownik w gospodarstwie domowym, chcę, aby edycja tego samego produktu przez wielu użytkowników na wspólnym koncie była obsługiwana bez błędów lub utraty danych.
- **Kryteria akceptacji:**
    - W przypadku jednoczesnej edycji tego samego produktu przez kilku użytkowników, stosowana jest strategia "last-write-wins" (ostatnia zmiana zostaje zapisana).
    - Użytkownicy są informowani o ewentualnych konfliktach poprzez komunikat w aplikacji.
    - Dane nie są tracone, a system zapewnia spójność inwentarza.

- **ID:** US-016
- **Tytuł:** Bezpieczny dostęp do danych konta
- **Opis:** Jako użytkownik, chcę mieć pewność, że moje dane (historia zakupów, stan produktów) są widoczne tylko dla mnie i innych użytkowników na tym samym koncie gospodarstwa domowego, aby chronić prywatność.
- **Kryteria akceptacji:**
    - Tylko zalogowani użytkownicy na tym samym koncie mają dostęp do danych.
    - Próba dostępu przez nieautoryzowanych użytkowników (np. z innego konta) jest blokowana z komunikatem o błędzie.
    - System używa bezpiecznych mechanizmów Supabase do weryfikacji dostępu.

- **ID:** US-017
- **Tytuł:** Interaktywna lista zakupów z trybem draft
- **Opis:** Jako użytkownik, chcę mieć interaktywną listę zakupów, gdzie po odznaczeniu produktu jako kupionego, zostaje on przeniesiony do listy produktów w trybie draft, które mogę później uzupełnić o daty ważności i dodać do inwentarza.
- **Kryteria akceptacji:**
    - Lista zakupów pozwala na odznaczenie produktu jako kupionego (np. checkbox lub przycisk).
    - Po odznaczeniu, produkt zostaje usunięty z listy zakupów i dodany do listy draft produktów.
    - W trybie draft, produkty są wyświetlane z możliwością dodania daty ważności, ilości, jednostki i innych szczegółów.
    - Użytkownik może w wolnej chwili uzupełnić szczegóły i dodać produkt do inwentarza.
    - Produkty w draft pozostają dostępne do momentu dodania do inwentarza lub usunięcia.

## 6. Metryki sukcesu
- **Wydajność:** Czas od rozpoczęcia dodawania produktu do jego pojawienia się na liście nie przekracza 30 sekund.
- **Jakość rozpoznawania:**
    - Dokładność rozpoznawania produktów przez skanowanie kodu kreskowego wynosi 80-90% dla popularnych artykułów.
    - Dokładność rozpoznawania daty ważności przez OCR wynosi co najmniej 80%.
- **Użyteczność:** Co najmniej 50% nowych użytkowników dodaje minimum 3 produkty podczas pierwszej sesji.
- **Stabilność:** Wskaźnik błędów podczas dodawania produktów lub przetwarzania danych jest niższy niż 10%.
- **Zaangażowanie:** Mierzony odsetek użytkowników, którzy regularnie otwierają powiadomienia i digest e-mailowy (wskaźnik `notification_clicked`).

## 7. Wymagania niefunkcjonalne (NFR)
**Wydajność:**
- Skanowanie kodu kreskowego: wykrycie + wypełnienie formularza ≤ 2 s (przy stabilnym oświetleniu).
- OCR jednej etykiety (≤ 2 MB) zakończony w ≤ 5 s w 90% przypadków.
- Czas odpowiedzi API (dodanie produktu do listy) ≤ 800 ms średnio / ≤ 1500 ms w p95.

**Skalowalność:**
- Jedno konto gospodarstwa obsługuje do 5 000 aktywnych produktów bez degradacji (czas listowania p95 ≤ 1200 ms).
- Architektura zakłada wzrost do 50 000 produktów per konto w przyszłości (wykracza poza MVP).

**Dostępność i niezawodność:**
- Docelowy uptime aplikacji (warstwa frontend+API) ≥ 99%.
- Mechanizm retry (max 2 próby) przy chwilowym błędzie połączenia z Open Food Facts.

**Bezpieczeństwo:**
- Hasła i auth w Supabase (bcrypt/argon2 zgodnie ze standardem Supabase).
- Row Level Security (RLS) dla tabel produktów powiązanych z kontem gospodarstwa.
- Bucket `expiry-images` prywatny (brak listowania); dostęp wyłącznie przez signed URL ważny ≤ 15 min; generowany przy każdym wyświetleniu szczegółów produktu.
- Bucket `product-images` może być publiczny (neutralne opakowania); w przyszłości opcja migracji do signed URL jeśli pojawią się dane wrażliwe.
- EXIF/metadane usuwane (re-encoding) dla zdjęć w `expiry-images`.
- Logowanie zdarzenia `image_access_granted` przy wydaniu signed URL (ID produktu, typ obrazu, timestamp).
- Rate limiting: max 60 operacji OCR + 120 skanów kodów kreskowych na godzinę per konto.

**Obsługa offline (PWA):**
- Cache statycznych zasobów (ikon, manifest, podstawowych skryptów) przez Service Worker.
- Brak wsparcia dodawania produktu offline w MVP (wymagane połączenie; ewentualna kolejka w przyszłym P2).

**Dostępność (a11y):**
- Kluczowe ekrany (lista produktów, dodawanie, szczegóły) zgodne z WCAG 2.1 AA: kontrast, focus outline, tekst alternatywny zdjęć.
- Interaktywne elementy dostępne przez klawiaturę.

**Lokalizacja czasu i strefy:**
- Powiadomienia e-mail wysyłane o 8:00 czasu skonfigurowanej strefy konta (strefa czasowa konfigurowalna w ustawieniach).

## 8. Założenia
- Jedno konto reprezentuje całe gospodarstwo domowe — brak ról użytkowników.
- Użytkownicy godzą się na dostęp do kamery dla skanowania / OCR.
- Format daty w bazie: ISO 8601 (YYYY-MM-DD).
- Użytkownicy tolerują sporadyczne błędy OCR i ręczną korektę.
- Brak konieczności integracji z zewnętrznymi kalendarzami i urządzeniami IoT w MVP.

## 9. Ryzyka i strategie mitygacji
| Ryzyko | Skutek | Mitigacja | Status |
|--------|--------|-----------|--------|
| Niska jakość zdjęć etykiet (rozmazane) | Błędna OCR data | Overlay z poradami: "Ustaw ostrość, unikaj refleksów" | Planowane |
| Niedostępność Open Food Facts | Brak automatycznego wypełnienia danych | Fallback do ręcznego formularza + komunikat | Planowane |
| Odmowa zgody na powiadomienia push | Niższe zaangażowanie | Alternatywa: e-mail digest / badge w UI | Planowane |
| Przeciążenie OCR (dużo zdjęć naraz) | Wydłużenie czasu przetwarzania | Rate limiting + kolejka | Planowane |
| Konflikty edycji (last-write-wins) mylą użytkownika | Utrata oczekiwanej zmiany | Wyświetlenie timestamp i alert przy kolizji | Rozważane |
| Wysokie koszty storage zdjęć | Wzrost kosztów operacyjnych | Retencja 100 dni + kompresja | Wdrożone (częściowo) |

## 10. Integracje zewnętrzne
| Usługa | Cel | Format | Ograniczenia | Fallback |
|--------|-----|-------|--------------|----------|
| Open Food Facts API | Pobranie danych produktu | JSON (GET) | Rate limit, brak produktu | Manualne wprowadzenie |
| QuaggaJS | Skan kodu kreskowego | JS client | Wymaga dobrej jakości obrazu | Ręczne dodanie kodu |
| Tesseract.js | OCR dat ważności | JS + WASM | Wydajność zależna od urządzenia | Ręczne wpisanie daty |
| Supabase Auth | Uwierzytelnianie | API | Zależność od dostępności usługi | Retry / komunikat |
| Supabase Storage | Przechowywanie zdjęć | API | Koszty rosną z wolumenem | Retencja / kompresja |

## 11. Eventy analityczne
Minimalny zestaw zdarzeń (anonimowych, powiązanych tylko z kontem gospodarstwa) – bez śledzenia otwarć e-mail w MVP:
- `product_added`
- `product_removed`
- `product_spoiled`
- `barcode_scan_success`
- `barcode_scan_fail`
- `ocr_attempt`
- `ocr_success` (pole `confidence_bucket`: `<50`, `50-79`, `80-89`, `90+`)
- `notification_sent`
- `notification_clicked`
- `digest_email_sent`
- `spoiled_report_generated`
- `monthly_report_generated`
- `yearly_report_generated`
// Future (P1/P2): rozważenie `digest_email_opened`, `digest_email_link_clicked` jeśli potrzebna głębsza analiza zaangażowania.

## 12. Polityka retencji danych
| Typ danych | Retencja | Powód | Uwagi |
|------------|----------|-------|-------|
| Zdjęcia dat ważności | 100 dni | Prywatność / oszczędność miejsca | Auto-usunięcie zadaniem cyklicznym |
| Zdjęcia produktów / kodów | Bezterminowo | Historia / powtórne dodawanie | Możliwa przyszła optymalizacja |
| Logi analityczne | 100 dni | Analiza trendów krótkoterminowych | Agregacja po 30 dniach (redukcja szczegółów) |
| Raporty tyg. zepsutych | 180 dni | Analiza marnowania | Możliwa anonimizacja po 90 dniach |

## 13. Lokalizacja i dostępność (i18n / a11y)
- Języki wspierane: PL (domyślny), EN.
- Format dat w UI: PL: DD.MM.YYYY, EN: YYYY-MM-DD.
- Treść powiadomień push i e-mail oraz raportów tygodniowych w języku wybranym w ustawieniach konta.
- Teksty lokalizowane przez klucze (np. `inventory.addProduct.title`).
- A11y: alternatywne opisy (alt) dla zdjęć kodów i dat (np. "Zdjęcie etykiety daty ważności").

## 14. Priorytety funkcjonalności (P0 / P1 / P2)
**P0 (Core MVP):** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-013, US-016, podstawowa analityka, retencja zdjęć, multi-język UI.
**P1:** US-008 (lista zakupów), US-017 (interaktywna lista zakupów z draft), US-010 (ponowne użycie produktu), US-011 (raport zepsutych + e-mail), rozszerzone eventy analityczne, podstawowy rate limiting.
**P2:** Offline dodawanie produktów, zaawansowana korekcja OCR, rozbudowana polityka powiadomień, rozbudowane raporty trendów marnowania.

## 15. Słownik pojęć
| Pojęcie | Definicja |
|---------|-----------|
| Produkt | Pozycja w inwentarzu zawierająca nazwę, datę ważności, statusy (opened/spoiled). |
| Inwentarz | Lista wszystkich aktywnych produktów bieżącego gospodarstwa. |
| `opened` | Flaga wskazująca, że produkt został otwarty – wpływa na dodatkowe przypomnienia. |
| `spoiled` | Status oznaczający zepsuty produkt – generuje wpis do raportu. |
| Lista zakupów (`ToBuy`) | Zbiór produktów przeniesionych po zużyciu w celu ponownego zakupu. |
| Lista draft | Lista produktów zakupionych, oczekujących na uzupełnienie szczegółów (data ważności, ilość) przed dodaniem do inwentarza. |
| Digest | Dzienne zestawienie e-mailem z produktami zbliżającymi się do końca ważności. |
| Raport tygodniowy | Podsumowanie liczby zepsutych produktów w minionym tygodniu. |
| Raport miesięczny | Podsumowanie liczby zepsutych produktów w minionym miesiącu, generowane na żądanie użytkownika. |
| Raport roczny | Podsumowanie liczby zepsutych produktów w minionym roku, generowane na żądanie użytkownika. |
| OCR | Mechanizm rozpoznawania tekstu na zdjęciu (Tesseract.js). |
| Skanowanie kodu | Proces wykrycia i odczytu kodu kreskowego (QuaggaJS). |

## 16. Decyzje końcowe (zamknięcie otwartych punktów)
**Odświeżanie signed URL:** Transparentne – automatyczne żądanie nowego signed URL po wygaśnięciu (brak dodatkowej interakcji użytkownika). Timeout odświeżenia inicjowany przy błędzie 403 lub utracie obrazu.

**Komunikacja limitu produktów:** Przy osiągnięciu 90% limitu (4 500 aktywnych) wyświetlany baner informacyjny + CTA do ewentualnego usuwania/oznaczania jako zużyte. Przy osiągnięciu 5 000 blokada dodawania z komunikatem i linkiem do pomocy.

**Raport tygodniowy:** E-mail wysyłany tylko jeśli w danym tygodniu ≥1 produkt oznaczony jako `spoiled`. W przypadku braku zepsutych produktów – brak wysyłki; w UI widoczna informacja „Brak zepsutych produktów w ostatnim tygodniu”.

Brak otwartych pytań dla MVP – dalsze rozszerzenia (tracking otwarć e-mail, offline queue) w backlogu P1/P2.


