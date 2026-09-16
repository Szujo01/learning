# Kezdőprojektek – rövid összefoglaló

Öt GitHub-repót klónoztunk a `kezdo-projektek` közös mappába. A négy üres, `realtime-voice-chat` kezdetű mappát eltávolítottuk. Minden repóban készült egy magyar `KEZDO_UTMUTATO.md`, amely bemutatja a fájlokat és a működést.

## Melyik projekt mire jó?

| Projekt | Technológiák | Rövid magyarázat |
|---|---|---|
| **FastAPI-CRUD-Todo** | FastAPI, SQLAlchemy, SQLite | Egyszerű feladatkezelő API. Jó első lépés az adatbázisos létrehozás, lekérdezés, módosítás és törlés megértéséhez. |
| **react-fastapi-todo** | React, FastAPI, SQLAlchemy, PostgreSQL | Teljes webalkalmazás: a React-felület API-kéréseket küld, a backend pedig az adatbázisba ment. Docker Compose kapcsolja össze a részeket. |
| **todo_api** | FastAPI, SQLAlchemy, SQLite, JWT | Bejelentkezéshez kötött API. Minden felhasználó a saját feladatait kezeli; az adatbázis-műveletek aszinkron módon futnak. |
| **nextjs-todo-app** | Next.js, React, NextAuth, MongoDB | Jegyzetkezelő felülettel és bejelentkezéssel. A Next.js az oldalakat és az API-t is kiszolgálja. Saját adatbáziscím beállítása és több kódhiba javítása szükséges. |
| **next-learn** | Next.js, React, TypeScript | Hivatalos oktatási példák gyűjteménye: egyszerű blog és adatbázisos pénzügyi dashboard. Az egyes példákat külön almappából kell indítani. |

## Az alap működés

**Felület → API/backend → adatbázis → válasz → felület frissítése.**

A React a felületet kezeli, a FastAPI a Python-alapú háttérrendszert biztosítja, a SQLAlchemy az adatbázis-műveleteket segíti. A Next.js Reactre épül, és szerveroldali feladatokat is ellát. Nem minden projekt tartalmazza mind a négy technológiát.

## Hol érdemes kezdeni?

- **Backendhez:** FastAPI-CRUD-Todo, majd todo_api.
- **Teljes webalkalmazáshoz:** react-fastapi-todo.
- **Next.js-hez:** next-learn egyszerű blogpéldája, utána a dashboard.

A repókat klónoztuk és a kódot átnéztük. Függőségeket még nem telepítettünk, az alkalmazásokat nem futtattuk. A részletes útmutatók az indítási lépéseket és a feltárt hiányosságokat is tartalmazzák.
