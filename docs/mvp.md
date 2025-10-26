# Application - DoNotWasteFood (MVP)

## Main Problem
Users have difficulty with food in the fridge that becomes expired just because they forget about it when it stands somewhere on the back shelf.

## Minimal Viable Product Features
- **Adding Products:** The user can scan the barcode using QuaggaJS, and the product name is automatically retrieved from the Open Food Facts database. If scanning fails, the user can manually enter the data.
- **Expiration Date:** The user can manually enter the expiration date or take a photo of the label with the date, which will be processed by AI (Tesseract.js) to automatically recognize the date. If AI does not recognize the date, the user can enter it manually.
- **Push Notifications:** The user receives push notifications about products approaching their expiration date.
- **Progressive Web App (PWA):** The application allows installation on mobile devices as a Progressive Web App (PWA), enabling the app to work without installation from the app store, providing a better user experience through offline access, fast loading, and the ability to add to the device's home screen.
- **UX Simplification:** Minimize the number of steps required to add a product so that the process is intuitive and fast, reducing the risk of user frustration.
- **Marking Products as Opened:** The user can mark products as opened to track their status (e.g., indicating if a product like a bottle of milk is opened).
- **Convenient Removal of Consumed Products:** The user can easily remove products that have been consumed, with a simple and intuitive interface to delete items from the list.

## What is NOT in Scope for MVP
Integration with smart devices, advanced analytics and recommendations, synchronization between devices, mobile app version, payments, and monetization.

## Use of AI
AI is used exclusively for recognizing the expiration date from a photo of the product label. The integration is based on the Tesseract.js library, which enables optical character recognition (OCR) on the client side in the browser. The date recognition process includes:
- Uploading a photo of the label by the user.
- Processing the image by Tesseract.js to extract text.
- Analyzing the extracted text for date patterns (e.g., DD/MM/YYYY, MM/YYYY).
- Automatically filling the expiration date field based on the recognized text.
- Fallback to manual data entry if recognition fails or accuracy is insufficient.
This integration ensures low costs, as Tesseract.js is a free open-source library that works locally without the need to connect to external paid services.

## Success Criteria
- **Performance:** The time from adding a product (e.g., scanning a barcode or manual entry) to displaying it on the list in the app does not exceed 30 seconds.
- **Quality:** Accuracy of product recognition through barcode scanning is 80-90% coverage for popular products. Accuracy of expiration date recognition by AI (Tesseract.js) is at least 80%. The error rate when adding products or processing dates is below 10%.
- **Usability:** At least 50% of users add at least 3 products in the first session (measured by app analytics).
- **Development Costs:** 0 USD, as the application is self-developed using free libraries and APIs.

## Cost Monitoring
Regularly monitor costs associated with the use of free libraries and APIs to keep the project within a low budget. Monthly operating costs are below 100 USD, thanks to the use of QuaggaJS, Open Food Facts, and Tesseract.js without fees for commercial AI services.