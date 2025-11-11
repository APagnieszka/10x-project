# Prompt: Integracja Tesseract.js dla OCR w komponencie OcrScanner

## Cel
Zaimplementuj rzeczywiste rozpoznawanie tekstu (OCR) przy użyciu Tesseract.js w komponencie `OcrScanner.tsx`, aby zastąpić obecną mockową implementację w funkcji `handleQuickScan`.

## Wymagania techniczne

### 1. Instalacja zależności
```bash
npm install tesseract.js
```

### 2. Lokalizacja pliku
`/Users/agnieszka.podbielska/reposSSH/AI/10x-project/src/components/OcrScanner.tsx`

### 3. Funkcjonalność do zaimplementowania

#### Import Tesseract.js
Na początku pliku dodaj:
```typescript
import Tesseract from 'tesseract.js';
```

#### Zastąp mockową implementację w funkcji `handleQuickScan`
Obecna mockowa implementacja (linie ~145-165):
```typescript
const handleQuickScan = useCallback(() => {
  if (!selectedImage) return;

  setIsScanning(true);
  setScanResult(null);
  setError(null);

  // Simulate OCR processing - in real implementation, use Tesseract.js or API
  setTimeout(() => {
    // Mock result - in production, this would be actual OCR
    const mockResult = {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      confidence: Math.floor(Math.random() * 30) + 70, // Random confidence 70-100
    };

    setScanResult(mockResult);
    setIsScanning(false);
  }, 1500);
}, [selectedImage]);
```

#### Nowa implementacja z Tesseract.js

Zastąp powyższy kod implementacją, która:

1. **Rozpoznaje tekst z obrazu** używając Tesseract.js
2. **Szuka wzorców dat** w rozpoznanym tekście:
   - Format DD/MM/YYYY
   - Format DD.MM.YYYY
   - Format DD-MM-YYYY
   - Format YYYY-MM-DD
   - Format MM/DD/YYYY
   - Tekstowe daty jak "Best before: 15 Dec 2025"
   
3. **Oblicza poziom pewności** (confidence):
   - Używa confidence z Tesseract dla słów zawierających datę
   - Jeśli znaleziono wiele dat, wybiera tę z najwyższym confidence
   - Jeśli nie znaleziono daty, zwraca odpowiedni błąd

4. **Obsługuje błędy**:
   - Brak wykrytego tekstu
   - Brak rozpoznanej daty w tekście
   - Błędy Tesseract.js

5. **Pokazuje progress** (opcjonalnie):
   - Można dodać stan `scanProgress` (0-100) i wyświetlać pasek postępu

### 4. Struktura zwracanego wyniku

Wynik powinien mieć format:
```typescript
{
  date: string;        // Format YYYY-MM-DD (ISO)
  confidence: number;  // 0-100
}
```

### 5. Obsługa błędów

W przypadku błędu, ustaw:
```typescript
setError("No expiration date found in the image. Please try another photo or ensure the date is clearly visible.");
setScanResult(null);
setIsScanning(false);
```

### 6. Konfiguracja Tesseract

Użyj następujących opcji:
```typescript
{
  lang: 'eng',  // Język angielski (można dodać więcej języków)
  logger: (info) => {
    // Opcjonalnie: loguj progress
    if (info.status === 'recognizing text') {
      console.log(`OCR Progress: ${Math.round(info.progress * 100)}%`);
    }
  }
}
```

### 7. Wzorce regex do wykrywania dat

Przykładowe regex do znalezienia dat w tekście:
```typescript
const datePatterns = [
  /\b(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{4})\b/,  // DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY
  /\b(\d{4})[\/\.\-](\d{1,2})[\/\.\-](\d{1,2})\b/,  // YYYY-MM-DD
  /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b/i, // 15 Dec 2025
];
```

### 8. Optymalizacje

- Rozważ użycie Web Worker dla Tesseract, aby nie blokować głównego wątku
- Dodaj debouncing, jeśli użytkownik szybko klika "Scan Again"
- Cache wyników OCR dla tego samego obrazu
- Przeskaluj obraz przed OCR dla lepszej wydajności (jeśli jest bardzo duży)

### 9. Testy

Po implementacji przetestuj z różnymi typami zdjęć:
- Wyraźne etykiety z datami
- Rozmyte zdjęcia
- Różne formaty dat
- Różne języki (opcjonalnie)
- Zdjęcia z niskim kontrastem

### 10. Walidacja daty

Po wykryciu daty, zwaliduj czy:
- Data jest prawidłowa (nie 32/13/2025)
- Data jest w rozsądnym zakresie (np. nie wcześniej niż dzisiaj minus 1 rok, nie później niż +10 lat)

## Przykładowa struktura funkcji

```typescript
const handleQuickScan = useCallback(async () => {
  if (!selectedImage) return;

  setIsScanning(true);
  setScanResult(null);
  setError(null);

  try {
    // 1. Rozpoznaj tekst z obrazu używając Tesseract
    const result = await Tesseract.recognize(selectedImage, 'eng', {
      logger: (info) => {
        // Opcjonalnie: pokazuj progress
      }
    });

    // 2. Wyodrębnij tekst
    const text = result.data.text;

    // 3. Znajdź datę w tekście używając regex
    // ... implementacja wyszukiwania daty

    // 4. Oblicz confidence na podstawie Tesseract confidence dla słów z datą
    // ... implementacja obliczania confidence

    // 5. Ustaw wynik
    setScanResult({
      date: foundDate,  // Format YYYY-MM-DD
      confidence: calculatedConfidence
    });
    
  } catch (error) {
    console.error('OCR Error:', error);
    setError('Failed to scan the image. Please try again.');
  } finally {
    setIsScanning(false);
  }
}, [selectedImage]);
```

## Dodatkowe uwagi

- Tesseract.js może być wolny przy pierwszym uruchomieniu (ładowanie modeli), rozważ pokazanie informacji użytkownikowi
- Dla lepszej wydajności, możesz użyć `createWorker()` i ponownie go używać zamiast tworzyć za każdym razem
- Rozważ preprocessing obrazu (zwiększenie kontrastu, binaryzacja) przed OCR dla lepszych wyników

## Status implementacji

- [ ] Zainstalowano tesseract.js
- [ ] Zaimplementowano funkcję `handleQuickScan` z Tesseract.js
- [ ] Dodano wzorce regex do wykrywania dat
- [ ] Zaimplementowano obliczanie confidence
- [ ] Dodano obsługę błędów
- [ ] Dodano walidację dat
- [ ] Przetestowano z różnymi typami zdjęć
- [ ] Zoptymalizowano wydajność
