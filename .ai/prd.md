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
    - Łatwe usuwanie produktów oznaczonych jako skonsumowane.
    - Oznaczanie produktu jako "zepsuty" (`spoiled`), co tworzy wpis w bazie danych i pozwala na śledzenie ilości zmarnowanej żywności oraz generowanie tygodniowego raportu. Po oznaczeniu, użytkownik jest pytany, czy usunąć produkt z inwentarza, czy przenieść do listy zakupów.
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

## 6. Metryki sukcesu
- **Wydajność:** Czas od rozpoczęcia dodawania produktu do jego pojawienia się na liście nie przekracza 30 sekund.
- **Jakość rozpoznawania:**
    - Dokładność rozpoznawania produktów przez skanowanie kodu kreskowego wynosi 80-90% dla popularnych artykułów.
    - Dokładność rozpoznawania daty ważności przez OCR wynosi co najmniej 80%.
- **Użyteczność:** Co najmniej 50% nowych użytkowników dodaje minimum 3 produkty podczas pierwszej sesji.
- **Stabilność:** Wskaźnik błędów podczas dodawania produktów lub przetwarzania danych jest niższy niż 10%.
- **Zaangażowanie:** Mierzony odsetek użytkowników, którzy regularnie otwierają powiadomienia i digest e-mailowy (wskaźnik `notification_clicked`).
