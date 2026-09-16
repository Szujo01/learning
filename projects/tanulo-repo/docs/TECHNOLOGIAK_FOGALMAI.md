# Webfejlesztési alapfogalmak

## FastAPI

A FastAPI egy Python-keretrendszer backendek és API-k készítéséhez. Fogadja a kliens kéréseit, ellenőrzi a beküldött adatokat, végrehajtja a szükséges műveleteket, majd választ küld. Például egy feladatkezelőben fogadhatja az új feladat mentésére érkező kérést. Automatikusan készít interaktív API-dokumentációt, amelyen a végpontok kipróbálhatók.

## SQLAlchemy

A SQLAlchemy egy Python-könyvtár relációs adatbázisok kezeléséhez. ORM-funkciója lehetővé teszi, hogy az adatbázistáblákat Python-osztályokként, a rekordokat pedig objektumokként kezeld. A könyvtár ezekből adatbázis-műveleteket készít, például lekérdezést vagy mentést. Nem maga az adatbázis: például SQLite-hoz vagy PostgreSQL-hez kapcsolódik.

## Next.js

A Next.js Reactre épülő keretrendszer webalkalmazások készítéséhez. Biztosítja többek között az oldalak útvonalkezelését és a szerveroldali működést. Egyes feladatok a böngészőben, mások a szerveren futhatnak, például az adatbázis lekérdezése. Így egyetlen alkalmazásban készíthetsz React-felületet és backendfunkciókat is.

## React

A React egy JavaScript-könyvtár felhasználói felületek készítéséhez. A felületet kisebb, újrahasználható elemekből, úgynevezett komponensekből építed fel. Az állapot tárolja a változó adatokat, például egy űrlap tartalmát, és változásakor a React frissíti a megjelenítést. A React-felület API-kérésekkel kapcsolódhat egy backendhez, például FastAPI-hoz.
