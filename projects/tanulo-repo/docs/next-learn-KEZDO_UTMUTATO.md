# next-learn – a működés magyarázata

Az útmutató a klónozott kód alapján készült. A példákat nem futtattuk.

## Ez több példa gyűjteménye

A repó a Next.js hivatalos oktatási példáit tartalmazza. Nem egyetlen, a gyökérből indítandó alkalmazás. Előbb válassz egy almappát, és ott telepítsd, illetve indítsd a példát.

| Mappa | Mit találsz benne? |
|---|---|
| `dashboard/starter-example` | A dashboard tananyag kiindulópontja: sok komponens és adatkezelő segédfüggvény már készen van, az alkalmazást tovább kell építeni. |
| `dashboard/final-example` | A kész dashboard App Routerrel, számlakezeléssel és bejelentkezéssel. |
| `basics` | Pages Router alapok, lépésenkénti kezdőpéldák és kész blog. |
| `basics/typescript-final` | Az alap blog TypeScript-változata. |
| `seo` | Keresőoptimalizálást szemléltető példák és demo. |

A `starter` mappák szándékosan részlegesek; nem üres, hibás projektek. A gyökér `package.json` inkább a repó közös fejlesztői feladatait írja le. Az egyes példáknak saját csomaglistájuk van.

## A kész dashboard feladata

A `dashboard/final-example` egy pénzügyi adminisztrációs felület. Megjelenít bevételi és számlaösszesítéseket, ügyfeleket, valamint kereshető és lapozható számlalistát. Számlát létrehozhatsz, módosíthatsz és törölhetsz.

React és Next.js mellett TypeScript, Tailwind CSS, PostgreSQL, Zod és NextAuth szerepel benne. A TypeScript típusok a fejlesztőt segítik; a Zod futás közben ellenőrzi például az űrlapadatokat. Ez a példa közvetlen SQL-lekérdezéseket használ a `postgres` csomaggal, nincs SQLAlchemy vagy FastAPI.

## Az App Router fájljai

Az alábbi útvonalak a `dashboard/final-example` mappán belül értendők.

| Fájl vagy mappa | Szerep |
|---|---|
| `app/layout.tsx` | Minden oldal közös gyökér-elrendezése. |
| `app/page.tsx` | A nyitóoldal. |
| `app/dashboard/layout.tsx` | A dashboard közös elrendezése és navigációja. |
| `app/dashboard/(overview)/page.tsx` | Dashboard összesítőoldal. A zárójeles mappanév nem része az URL-nek. |
| `app/dashboard/invoices/page.tsx` | Kereső, lista és lapozás. |
| `app/dashboard/invoices/create/page.tsx` | Új számla űrlapja. |
| `app/dashboard/invoices/[id]/edit/page.tsx` | Számlaszerkesztés, dinamikus azonosítóval. |
| `app/lib/data.ts` | Adatbázis-lekérdezések. |
| `app/lib/actions.ts` | Szerveren futó űrlapműveletek és belépés. |
| `app/lib/definitions.ts` | Az adatok TypeScript-típusai. |
| `app/ui` | A megjelenítés kisebb komponensei. |
| `auth.ts`, `auth.config.ts`, `proxy.ts` | Bejelentkezés és útvonalvédelem. |
| `app/seed/route.ts` | Táblák és oktatási mintaadatok létrehozása. |

A `page.tsx` oldalt definiál, a `layout.tsx` közös keretet, a `route.ts` pedig HTTP-végpontot. A `loading.tsx` várakozó állapotot, az `error.tsx` hibafelületet ad.

## Mi fut a szerveren és mi a böngészőben?

A dashboard oldalkomponensei alapvetően szerverkomponensek: közvetlenül lekérhetik az adatbázist, és a megjelenítés eredménye kerül a klienshez. Az interaktív kereső például `'use client'` jelölésű, ezért a böngészőben kezeli a gépelést.

A `'use server'` jelölésű `actions.ts` függvényei a szerveren futnak. Az adatbázis kapcsolati adatait nem kell a böngészőbe küldeni. A kliens interakciója és a szerver adatkezelése ugyanannak a Next.js alkalmazásnak a része.

## A számlalista adatainak útja

1. Megnyitod a `/dashboard/invoices` oldalt.
2. Az oldal kiolvassa az URL-ből a `query` keresőkifejezést és a `page` oldalszámot.
3. A `fetchInvoicesPages()` megszámolja a keresésnek megfelelő rekordokat.
4. A táblakomponens a `fetchFilteredInvoices()` segítségével betölti az adott oldalt.
5. Az SQL a számlákat az ügyfelekkel `JOIN` művelettel összekapcsolja; így név és e-mail is látható.
6. A lekérdezés oldalanként hat rekordot ad a `LIMIT` és `OFFSET` használatával.
7. A `Suspense` várakozás közben helykitöltő táblát mutat.

A kereső gépelés után 300 ms-os késleltetéssel módosítja az URL-t, és az oldalszámot 1-re állítja. Ez a debounce: csökkenti a gyors egymás utáni frissítéseket. Az új URL alapján a szerver új adatokat kér le. A keresés nem csupán a már megjelenített hat sort szűri.

## Új számla mentése

```text
Űrlap → createInvoice → Zod ellenőrzés → SQL INSERT → lista frissítése → átirányítás
```

Az űrlap `FormData` formában küldi az ügyfelet, összeget és státuszt. A Zod ellenőrzi, hogy az összeg pozitív szám, az állapot pedig `pending` vagy `paid`. Hiba esetén a függvény mezőhibákat ad vissza.

Siker esetén az összeget a kód százzal megszorozza, mert a tárolt érték centben van. A dátumot a szerver készíti. Az `INSERT` elmenti a számlát, a `revalidatePath` érvényteleníti a lista korábbi gyorsítótárát, a `redirect` pedig a számlalistára küld.

A módosítás `UPDATE`, a törlés `DELETE` SQL-t használ. A sablonba tett értékeket a `postgres` csomag paraméterekként kezeli; nem egyszerű szöveg-összefűzés történik.

## Bejelentkezés és adatok

Az `auth.ts` e-mail alapján keresi a `users` tábla rekordját, és bcrypttel ellenőrzi a jelszót. Az `auth.config.ts` szabályozza, hogy bejelentkezés nélkül a dashboard ne legyen megnyitható. A `proxy.ts` bekapcsolja ezt az útvonalellenőrzést.

A mintaadatok táblái: `users`, `customers`, `invoices`, `revenue`. Ez közös oktatási dashboard; a számlalekérdezések nem szűrnek bejelentkezett felhasználó szerinti tulajdonosra.

A `/seed` végpont mintaadatokat ír az adatbázisba. A számlák beszúrása új azonosítókat generál, így ismételt meghívása további példaszámlákat hozhat létre. Csak a tanuláshoz használt adatbázison kezeld ezt a feltöltést.

## A basics blog másképp működik

A `basics/basics-final` a régebbi Pages Routert szemlélteti. Az adatforrás a `posts` mappában lévő Markdown-fájlok gyűjteménye, nem PostgreSQL.

A `lib/posts.js` beolvassa a fájlokat; a `gray-matter` kiemeli a fejléc metaadatait, a `remark` HTML-re alakítja a tartalmat. A `getStaticPaths()` megadja a bejegyzések útvonalait, a `getStaticProps()` pedig előkészíti az egyes oldalak adatait. A kész termelési buildben a blogoldalak előre elkészülnek, nem minden kéréskor olvassák újra az összes fájlt. A `fallback: false` miatt az ismeretlen bejegyzésazonosítók 404-et adnak.

Ez jó első példa, ha még a routingot, komponenseket és adatátadást tanulod. A dashboardot az App Router tanulásához válaszd; a két routingrendszer fájljait ne keverd.

## Indítás előkészítése

Egyszerű bloghoz a repó gyökeréből:

```powershell
Set-Location basics/basics-final
npm install
npm run dev
```

A dashboardhoz külön a `dashboard/final-example` mappában telepíts és indíts. Saját PostgreSQL-kapcsolatot (`POSTGRES_URL`) és NextAuth-kulcsot (`AUTH_SECRET`) is be kell állítani a példa környezeti fájljában. A kód `ssl: 'require'` kapcsolattal dolgozik; egy SSL nélküli helyi PostgreSQL-hez a kapcsolati beállítást is igazítani kell.

A dashboard `next` és `react` függőségei `latest` értékűek; a tényleges verziót a csomagkezelő és a lockfile határozza meg. A gyökér Node-verziókövetelménye önmagában nem bizonyítja minden almappa kompatibilitását. Az indítást és a csomagtelepítést nem teszteltük.

## Javasolt tanulási út

Elsőként a kész blogból kövesd végig egy Markdown-bejegyzés megjelenítését. Utána az App Router dashboardban a számlalista, a kereső és a `data.ts` kapcsolatát olvasd. Ezután jöhet a létrehozó űrlap és a `createInvoice`, majd a bejelentkezés. Első önálló bővítésnek a bloghoz új bejegyzés, a dashboardhoz külön státuszszűrő jó feladat.
