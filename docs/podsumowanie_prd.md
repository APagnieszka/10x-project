<conversation_summary>

<decisions>
1. Główny użytkownik docelowy: rodzina (household).
2. Dane będą przechowywane zdalnie i synchronizowane — backend MVP: Supabase (email+password auth).
3. Model konta w MVP: proste wspólne konto (jeden email+hasło używany przez wszystkich domowników).
4. Autoryzacja/ujawnienia: reset hasła obsługiwany domyślnym mechanizmem Supabase.
5. Powiadomienia: obsługa obu kanałów — web‑push (PWA/service worker) i dzienny e‑mailowy digest (użytkownik może włączyć oba).
6. Digest: wysyłany codziennie o 08:00 według strefy czasowej konta/household; digest równiez dostępny na stronie dla zalogowanych użytkowników.
7. Przypomnienia indywidualne: lokalne web‑push (service worker) + e‑mail daily; domyślne przypomnienia przy produktach: 3 dni i 1 dzień przed datą ważności.
8. OCR dat: format przyjęty YYYY‑MM‑DD; OCR automatycznie zapisuje datę gdy pewność ≥ 90%; przy niższej pewności prosi użytkownika o potwierdzenie; ręczny wpis wspiera skróty tydzień/miesiąc/rok.
9. Zdjęcia: 
   - `barcode_photo` — przechowywane bezterminowo (debug).
   - `product_photo` — przechowywane bezterminowo (opcjonalne).
   - `date_photo` (zdjęcia daty ważności) — przechowywane 100 dni, potem automatyczne usunięcie.
10. Barcode opcjonalne (np. dla warzyw/owoców); jeśli produkt kupowany ponownie, użytkownik wybiera z listy (nie musi robić zdjęcia ponownie).
11. Pole/status `ToBuy`: po kliknięciu przenosi produkt z inwentarza do listy zakupów (produkt usuwany z inwentarza, dodawany do zakupów).
12. Oznaczenie „opened”: `opened` (bool) i `opened_date` przechowywane oddzielnie; nie przeliczamy automatycznie nowej daty ważności — system monitów wykrywa produkty otwarte >3 dni (domyślnie) i można wydłużyć czas per‑produkt.
13. Analityka: anonimowe eventy (np. `product_added`, `ocr_success`, `notification_clicked`) zapisane w Supabase (tabela events); zapewniony przełącznik opt‑out i krótka notka prywatności przy rejestracji.
14. OCR i skanowanie: QuaggaJS + Open Food Facts do rozpoznawania produktu; Tesseract.js (client‑side) dla OCR daty.
15. Koszty i zakres: MVP ma minimalne koszty, używamy darmowych bibliotek/API; hostowanie Supabase i storage według potrzeb — domyślny adres usługi do wysyłki e‑maili (bez własnej domeny) — akceptowane.
</decisions>

<matched_recommendations>
1. Zostać przy remote-first z Supabase, ale zaprojektować model danych z myślą o przyszłej rozbudowie synchronizacji i multi‑user household — (dopasowane do decyzji: Supabase + wspólne konto; zalecenie o elastycznym modelu danych).
2. Domyślne przypomnienia 3 dni i 1 dzień przed oraz możliwość konfiguracji per‑produkt i globalnie — (dopasowane: implementacja digest + przypomnienia).
3. Po każdej próbie skanu powinna być opcja ręcznej korekty i zapisania „custom product” — (dopasowane: QuaggaJS + manual fallback + lista wyboru przy ponownych zakupach).
4. OCR: pokazać rozpoznaną datę z poziomem pewności i automatycznie zapisać tylko powyżej progu — (dopasowane: YYYY‑MM‑DD, próg 90% automatyczny zapis, potwierdzenie przy niższej pewności).
5. Trzymać zdjęcia barcode i product long‑term dla wygody (indexowanie/wybór produktu), a zdjęcia daty krótkoterminowo — (dopasowane: barcode/product bezterminowo, date_photo 100 dni).
6. Oznaczenie `opened` przechowywać oddzielnie i wysyłać monit gdy otwarty >3 dni (możliwość edycji per‑produkt) — (dopasowane: opened_date + monitor >3 dni).
7. Implementować prostą politykę prywatności i opt‑out dla analytics — (dopasowane: notka przy rejestracji + opt‑out).
8. Instrumentować kluczowe eventy w Supabase aby mierzyć sukces: product_added, product_displayed, product_removed, notification_sent, notification_clicked, ocr_result — (dopasowane: zapis eventów w Supabase).
9. Przygotować harmonogram wdrożenia: prototyp scan → OCR → PWA + push → digest + analytics — (zalecenie uzgodnione, planowanie kolejnych kroków).
10. Zapewnienie, że barcode jest opcjonalne i że użytkownik może wybierać z listy przy ponownym zakupie (uniknięcie ponownych zdjęć) — (dopasowane).
</matched_recommendations>

<prd_planning_summary>
Problem użytkownika
- Ludzie (w szczególności rodziny) zapominają o produktach w lodówce i przez to żywność się marnuje. Aplikacja ma zapobiegać przeterminowaniom poprzez szybkie dodawanie produktów, wykrywanie dat ważności i przypominanie użytkownikom.

Główne wymagania funkcjonalne (MVP)
- Logowanie: Supabase Auth (email + hasło), jedno wspólne konto dla household (MVP).
- Dodawanie produktu:
  - Skan barcode (QuaggaJS) → zapytanie Open Food Facts → prefill pola.
  - Fallback: manualne pole (barcode opcjonalne dla warzyw/owoców).
  - Możliwość zrobienia zdjęcia daty (Tesseract.js OCR) — rozpoznanie daty YYYY‑MM‑DD.
  - Automatyczne zapisanie daty OCR jeśli pewność ≥ 90%; w przeciwnym wypadku prośba o potwierdzenie/edycję.
  - Ręczny wpis daty z wygodnymi skrótami: +1 week / +1 month / +1 year.
- Statusy produktu i operacje:
  - `opened` (bool) + `opened_date` (nullable) — monitorowanie >3 dni (domyślnie) i możliwość wydłużenia per‑produkt.
  - `ToBuy` status — po kliknięciu: usuń z inwentarza i przenieś do listy zakupów.
  - Usuwanie produktu (consumed) → opcja `ToBuy` zamiast delete.
- Powiadomienia i digest:
  - Web‑push (PWA service worker) i dzienny e‑mailowy digest (08:00 household timezone). Użytkownik może włączyć oba kanały.
  - Domyślne przypomnienia: 3 dni i 1 dzień przed datą ważności; dodatkowy monit dla produktów otwartych >3 dni.
  - Digest dostępny także na stronie (widoczny dla każdego zalogowanego na wspólnym koncie).
- Zdjęcia i retencja:
  - `barcode_photo` — przechowywane bezterminowo (Supabase Storage).
  - `product_photo` — przechowywane bezterminowo (opcjonalnie).
  - `date_photo` — przechowywane 100 dni, potem usuwane (retencja automatyczna).
- Analityka i prywatność:
  - Zbieranie anonimowych eventów w Supabase (tabela events).
  - Krótka notka prywatności przy rejestracji i przełącznik opt‑out w ustawieniach.
- Integracje i biblioteki:
  - QuaggaJS, Open Food Facts, Tesseract.js, Supabase (Auth, Postgres, Storage), Service Worker web‑push (VAPID), domyślna usługa e‑mail od Supabase.
- UI/UX:
  - UX skoncentrowany na minimalnych krokach do dodania produktu (cel: <30s od rozpoczęcia dodawania do pojawienia się na liście).
  - Widoki: inwentarz, lista zakupów, ustawienia konta, digest page, add-product flow (scan/manual/photo).
- Dane produktu (proponowany model / pola MVP):
  - id, barcode (nullable), name, brand (optional), quantity + unit, expiration_date (YYYY‑MM‑DD), opened (bool), opened_date (nullable), photos { barcode_photo_url, product_photo_url, date_photo_url }, added_by (email), household_id (string), to_buy (bool), notes, created_at, updated_at.

Kluczowe historie użytkownika i ścieżki korzystania
- Jako członek rodziny chcę szybko dodać produkt skanując barcode, aby automatycznie wypełnić nazwę i datę ważności.
- Jako osoba chcąca uniknąć ponownego fotografowania chcę, aby barcode i product_photo były przechowywane bezterminowo i mogli wybrać produkt z listy przy kolejnym zakupie.
- Jako użytkownik chcę, żeby OCR automatycznie zapisał rozpoznaną datę jeśli ma wysoką pewność, a w przypadku wątpliwej rozpoznania poprosił o potwierdzenie.
- Jako rodzina chcemy otrzymywać dzienny digest o 08:00 w strefie household i widzieć go też na stronie.
- Jako użytkownik chcę mieć możliwość przeniesienia pozycji do listy zakupów (ToBuy) przy usuwaniu/oznaczaniu jako spożyte.
- Jako użytkownik chcę opcję opt‑out z anonimowej analityki i krótką notkę prywatności podczas rejestracji.
- Jako deweloper chcę, żeby `date_photo` było usuwane po 100 dniach automatycznie, aby ograniczyć przechowywanie wrażliwych obrazów.

Ważne kryteria sukcesu i sposoby ich mierzenia
- Performance: czas od rozpoczęcia dodawania produktu (scan/manual) do jego wyświetlenia ≤ 30s — mierzone eventami `product_added` i `product_displayed` w Supabase.
- Jakość OCR: automatyczny zapis przy progu pewności 90%; ogólna celowana accuracy OCR ≥ 80% (monitorować `ocr_success/ocr_fail` eventy, zbiór walidacyjny).
- Jakość rozpoznania produktu: coverage 80–90% dla popularnych produktów (metryka: % produktów rozpoznanych przez Open Food Facts vs. manual).
- Usability: ≥ 50% użytkowników dodaje ≥ 3 produkty w pierwszej sesji — metryka: eventy sesji i `product_added`.
- Błędy: wskaźnik błędów przy dodawaniu/processing < 10% (liczone z błędów API/OCR/validation).
- Analityka: rejestrowanie eventów `product_added`, `ocr_success`, `notification_sent`, `notification_clicked`, `to_buy_action`, `date_photo_deleted` w Supabase.

Operacje techniczne / wymagania implementacyjne (krótkie)
- Supabase:
  - Auth (email+password), Postgres tables: products, households, shopping_list, events, users (minimal fields), photos metadata.
  - Storage buckets: barcode_photos (infinite retention), product_photos (infinite), date_photos (with lifecycle rule / cleanup job).
- Cron/background jobs:
  - Daily digest sender (08:00 household tz) — wysyłka mail + zapisywanie sent status.
  - Cleanup job: usuwa `date_photo` po 100 dniach.
  - Job do wysyłki web‑push i przypomnień 3/1 dni przed (może być CRON lub background worker wyzwalany co godzinę).
- Web‑push:
  - VAPID keys, przechowywanie subskrypcji w Supabase, service worker w PWA.
- OCR:
  - Client‑side Tesseract.js z preprocessing (crop/contrast) i confidence scoring; client wysyła date_photo do Supabase only if user approves or for debug storage.
- E‑mail:
  - Domyślny provider Supabase/SendGrid usage; support for no‑reply default service.
- UI:
  - Add product flow with prefilled fields, OCR confirmation modal when confidence < 90%, manual quick pick buttons (week/month/year).
- Privacy:
  - Short privacy notice during signup; opt‑out toggle stored in user settings; events stored anonymized (no PII in events).

Ważne ryzyka techniczno‑produkcyjne
- Wspólne konto (single shared credentials) jest prostsze, ale ma ograniczenia bezpieczeństwa i audytowalności.
- Web‑push wymaga VAPID + konfiguracji serwera; mail deliverability zależna od usługodawcy.
- OCR accuracy zależy od jakości zdjęć; klient‑side Tesseract ma ograniczenia (zalecane testy i preprocessing).
- Retencja zdjęć i ich koszt przechowywania (Supabase storage) — monitorować koszty.
- Open Food Facts coverage może być niższe dla lokalnych/niszowych produktów — konieczność fallback manual.

Unresolved / follow‑ups needed
- Dokładna treść krótkiej notki prywatności (potrzebne sformułowanie prawne / język).
- Konfiguracja deliverability maili (czy w przyszłości chcesz własną domenę do wysyłki? teraz używamy domyślnej usługi).
- Mechanizm automatycznego usuwania `date_photo`: implementacja (lifecycle rule w Supabase Storage vs. background job) — wybór techniczny do podjęcia.
- Szczegóły DB schema i relationships (pełne ERD) — potrzebne do implementacji backendu.
- Strategia konfliktów edycji przez wielu domowników logujących się na to samo konto (opcje: last‑write‑wins, pokaż konflikt) — decyzja do podjęcia.
- Plan monitoringu kosztów przechowywania zdjęć i limitów API (Supabase, Open Food Facts).
- Proces testów OCR i baza walidacyjna (ile zdjęć, z jakich kategorii) do osiągnięcia celów accuracy.
</prd_planning_summary>

<unresolved_issues>
1. Finalny tekst notki prywatności / polityki — wymagane sformułowanie prawne i miejsce wyświetlania.
2. Wybór mechanizmu usuwania `date_photo` (Supabase lifecycle rule vs. background cleanup job) i szczegóły harmonogramu.
3. Pełne, wersjonowane DB schema (tabele, indeksy, constraints) do implementacji — wymaga generacji ERD.
4. Konfiguracja VAPID i deployment service dla web‑push (klucze i bezpieczne przechowywanie).
5. Strategia obsługi konfliktów przy wspólnym koncie i reguły edycji współbieżnej.
6. Test plan i zbiór zdjęć do walidacji OCR (liczba/zakres) aby zweryfikować próg 90% i target 80% accuracy.
7. Monitoring kosztów Supabase Storage i limitów Open Food Facts — wymagane progi alarmowe i decyzje o ewentualnych optymalizacjach.
8. Szczegółowy plan wysyłki maili (retry, bounces, unsubscribe flows) i ewentualna konfiguracja własnej domeny w przyszłości.
</unresolved_issues>

</conversation_summary>