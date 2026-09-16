# React + FastAPI todo – a működés magyarázata

Az útmutató a klónozott kódot magyarázza; az alkalmazást nem futtattuk.

## Mire való?

Egy teljes webes feladatkezelő: új feladatot írhatsz be, készre jelölheted és törölheted. Három része van:

- **React frontend:** a böngészőben látható felület.
- **FastAPI backend:** fogadja a kéréseket, ellenőrzi az adatokat és kezeli a mentést.
- **PostgreSQL:** tartósan tárolja a feladatokat; a SQLAlchemy közvetít a Python-kód és az adatbázis között.

```text
Böngésző → frontend nginx → FastAPI → SQLAlchemy → PostgreSQL
          ← JSON-válasz és a React felületének frissítése ←
```

## A fontos fájlok

| Fájl | Szerep |
|---|---|
| `frontend/src/main.jsx` | Elindítja a React-felületet. |
| `frontend/src/App.jsx` | Állapotok, API-hívások, űrlap, lista és hibajelzések. |
| `frontend/vite.config.js` | A fejlesztéshez használt Vite beállítása. |
| `backend/app/main.py` | Az összes API-végpont és az induláskori táblalétrehozás. |
| `backend/app/models.py` | A `todos` tábla SQLAlchemy-modellje. |
| `backend/app/schemas.py` | A kérések és válaszok Pydantic-sémái. |
| `backend/app/database.py` | Kapcsolat és kérésenkénti adatbázis-munkamenet. |
| `docker-compose.yml` | Összekapcsolja a három szolgáltatást. |
| `frontend/Dockerfile`, `frontend/nginx.conf` | A React build elkészítése, kiszolgálása és az API-kérések továbbítása. |

## Mi történik induláskor?

A Compose először elindítja a PostgreSQL-t, és megvárja az adatbázis egészségellenőrzését. A backend a `db:5432` címen éri el; a `db` a szolgáltatás neve a konténerek hálózatában.

A backend induláskor a `create_all` segítségével létrehozza a hiányzó táblát. A frontend build során a Vite HTML-, JavaScript- és CSS-fájlokat készít a `dist` mappába. A futó frontend konténerben ezeket nginx szolgálja ki, belül a 8080-as porton; a gépeden ez a 3000-es port.

A Compose jelenlegi frontendje nginxet használ. A repóban található `server.mjs` egy másik, Node-alapú kiszolgáló, amelyet ez a Dockerfile nem indít el.

## Mi történik az oldal megnyitásakor?

1. A React létrehozza az állapotokat: `todos`, `title`, `health`, `loading`, `error`, `busy`.
2. A `useEffect` meghívja a `refresh()` függvényt.
3. A `Promise.all` párhuzamosan lekéri az `/api/health` és `/api/todos` végpontokat.
4. A válaszokat a `setHealth()` és `setTodos()` eltárolja a böngésző memóriájában.
5. A React újrarajzolja a szükséges felületrészeket. Betöltéskor várakozó szöveg, hiba esetén hibaüzenet jelenik meg.

A `useState` a felület változó adatait tárolja; a `useEffect` az első megjelenítéshez kapcsolódó adatlekérést indítja. Ez nem folyamatos, valós idejű szinkronizálás: másik böngésző változtatásait a Refresh gombbal vagy újratöltéssel látod.

## Egy feladat létrehozása

1. A gépelés frissíti a `title` állapotot.
2. Az Add gomb a `handleAdd()` függvényt hívja; az megakadályozza az oldal szokásos újratöltését.
3. Levágja a szélső szóközöket, és üres címnél nem küld kérést.
4. A `busy` ideiglenesen letiltja a vezérlőket.
5. A `fetch` elküldi a `POST /api/todos` kérést, például `{"title":"React tanulása"}` törzzsel.
6. A Pydantic ellenőrzi a cím 1–255 karakteres hosszát.
7. A backend létrehoz egy `Todo` objektumot, majd `add`, `commit`, `refresh` lépésekkel menti és visszaolvassa.
8. A válasz 201-es státusszal tartalmazza a mentett rekordot.
9. A frontend a lista elejére teszi, és kiüríti az inputot.

A böngészőben lévő lista csak megjelenítési állapot. A végleges adat a PostgreSQL-ben van.

## Készre jelölés és törlés

A jelölőnégyzet `PATCH /api/todos/{id}` kérést küld, az aktuális `completed` érték ellenkezőjével. Siker után a React `map()` segítségével lecseréli a megfelelő listaelemet.

A törlés `DELETE` kérést küld. A backend 204-es választ ad, amelynek nincs JSON-törzse; ezért az `api()` segédfüggvény ezt külön kezeli. A frontend `filter()` segítségével kiveszi az elemet a listából. Hiányzó azonosítónál a backend 404-et ad.

## Adatok és végpontok

A feladat mezői: `id`, `title`, `completed` és `created_at`. A kész állapot alapértéke hamis. A lista azonosító szerint csökkenő sorrendű.

| Végpont | Szerep |
|---|---|
| `GET /api/health` | `SELECT 1` lekérdezéssel is ellenőrzi az adatbázist. |
| `GET /api/todos` | Minden feladat listája. |
| `POST /api/todos` | Létrehozás. |
| `PATCH /api/todos/{id}` | Cím vagy kész állapot módosítása. |
| `DELETE /api/todos/{id}` | Törlés. |

Az API engedi a cím átírását, de a felület nem ad hozzá külön szerkesztőmezőt. Nincs bejelentkezés: a lista közös. A health válasz `status` mezője adatbázishibánál is `ok`; az adatbázis valódi eredménye a `database` mezőben van.

## Miért kell proxy?

A proxy továbbítja a kérést: a böngésző ugyanarra a címre küldi az `/api/...` kéréseit, amelyről a felületet betöltötte, az nginx pedig a backendhez irányítja őket. A `VITE_API_URL` más API-alapcímet is beállíthat; ez Vite build során beépülő érték.

## Indítás és tartós tárolás

Docker és működő Compose szükséges. A projekt gyökerében:

```powershell
docker compose up --build
```

Felület: `http://localhost:3000`; API-dokumentáció: `http://localhost:8000/docs`.

```powershell
docker compose down
```

A `pgdata` volume őrzi az adatokat a konténerek leállítása után is. A `down -v` ezt is törölné, ezért a szokásos leállításhoz a fenti parancsot használd. A `k8s` mappa Kubernetes-példákat tartalmaz; az első helyi próbához nem kell.

## Tanulási sorrend

Először az `App.jsx` létrehozási folyamatát olvasd, aztán a hozzá tartozó backend-végpontot, sémát és modellt. Végül nézd meg a Compose és nginx összekötését. Első bővítésként készíts címszerkesztést a már meglévő PATCH végponthoz.
