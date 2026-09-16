# Next.js todo app – a működés magyarázata

Ez a leírás a klónozott kód alapján készült. Az alkalmazást nem futtattuk, az itt jelzett hiányosságokat kódolvasással találtuk.

## Mire való?

Bejelentkezéshez kötött jegyzet- és feladatkezelő. Egy elemnek címe és tartalma van; létrehozhatod, szerkesztheted és törölheted. Nincs külön készre jelölő mező.

A projekt Next.js 13.3-at és React 18-at használ, a **Pages Router** felépítésével. A React rajzolja a felületet; a Next.js szerveren oldal-előkészítést és API-végpontokat is futtat. Az adatbázis MongoDB, az adatmodelleket Mongoose írja le. Itt nincs FastAPI vagy SQLAlchemy.

## A fontos fájlok

| Fájl | Feladat |
|---|---|
| `src/pages/_app.js` | Közös elrendezés és a NextAuth munkamenetének biztosítása a felületnek. |
| `src/pages/index.js` | Lista, hozzáadás, sorrendváltás és értesítések. |
| `src/pages/login/index.js` | Bejelentkezési és regisztrációs folyamat. |
| `src/pages/[noteId]/index.js` | Az azonosítóval kiválasztott jegyzet szerkesztőoldala. |
| `src/components/form/NoteForm.js` | Ugyanaz az űrlap új és meglévő jegyzethez. |
| `src/components/notes-list` | A jegyzetek megjelenítése és műveleti menüje. |
| `src/pages/api/notes.js` | Listázás és létrehozás. |
| `src/pages/api/notes/[noteId].js` | Módosítás és törlés. |
| `src/pages/api/auth/[...nextauth].js` | NextAuth bejelentkezés. |
| `src/pages/api/auth/signup.js` | Új felhasználó mentése. |
| `src/utils/auth.js` | bcryptjs jelszóhash és összehasonlítás. |
| `src/utils/mongoose.js` | MongoDB-kapcsolat és annak újrahasználata. |
| `src/models/User.js`, `src/models/Note.js` | A felhasználó és jegyzet adatmodellje. |

A szögletes zárójel dinamikus útvonalat jelent: a `/123` cím a `[noteId]` oldalon a `123` azonosítójú jegyzetet választja. A `pages/api` alatti fájlok szerveren futó végpontok, nem böngészőoldalak.

## Bejelentkezés és regisztráció

Regisztrációkor a kliens a nevet, e-mailt és jelszót küldi a `POST /api/auth/signup` végpontra. A backend megkeresi az e-mailt, bcryptjs segítségével hash készül a jelszóból, és menti a `User` dokumentumot.

Bejelentkezéskor a NextAuth Credentials provider megkeresi a felhasználót, és összehasonlítja a megadott jelszót a hashsel. Siker esetén a NextAuth JWT-alapú munkamenetet kezel. A `SessionProvider` teszi elérhetővé a munkamenet állapotát a React-felület számára.

A munkamenet azt jelzi, hogy a kliens már bejelentkezett. Ez nem ugyanaz, mint a jogosultságellenőrzés: azt is külön vizsgálni kellene, hogy az adott jegyzet az adott felhasználóé-e.

## Mi történik a főoldal megnyitásakor?

1. A szerveren futó `getServerSideProps` ellenőrzi a munkamenetet.
2. Bejelentkezés nélkül `/login` átirányítást ad.
3. Bejelentkezve megjelenik a React-oldal.
4. A böngésző `useEffect` hatására meghívja a `fetchNotes()` függvényt.
5. A `GET /api/notes/?sort=desc` végpont a munkamenet e-mailje alapján betölti a felhasználót.
6. A `Note.find({ user: currentUser.id })` csak ennek a felhasználónak a jegyzeteit listázza, létrehozási idő szerint rendezve.
7. A JSON-válasz a React `notes` állapotába kerül, és megjelenik a rács.

Tehát a bejelentkezés ellenőrzése szerveroldali, a főoldal listájának lekérése böngészőoldali. A főoldal `searchQuery` értéket is kap, de a listalekérés nem használja keresésre.

## Egy jegyzet létrehozásának útja

Az űrlap `useState` változókban tartja a címet és a tartalmat. Beküldéskor meghívja a szülő `addNote()` függvényét, amely JSON-t küld a `POST /api/notes` végpontra.

A végpont a munkamenetből megkeresi a felhasználót, készít egy `Note` dokumentumot, és hozzáadja annak hivatkozását a felhasználó `notes` listájához. A kód MongoDB-tranzakciót is használ: ez több összetartozó változtatást próbál egyetlen egységként véglegesíteni. Ehhez tranzakciókat támogató MongoDB-környezet szükséges.

A `Note` mezői: tulajdonos (`user`), kötelező `title`, kötelező `content`, és automatikus időbélyegek. A `User` mezői: név, egyedi e-mail, hashelt jelszó és jegyzethivatkozások.

## Szerkesztés és törlés

A szerkesztőoldal szerveren tölti be a jegyzetet, majd a közös `NoteForm` előre kitöltött mezőkkel jelenik meg. Mentéskor `PATCH /api/notes/{noteId}` kérést küld, és siker után a főoldalra navigál.

A `DELETE /api/notes/{noteId}` végpont eltávolítja a jegyzetet és a felhasználó jegyzethivatkozását. A módosítás és törlés sikerre jelenleg 201-et ad; ez a meglévő kód viselkedése, bár létrehozásra szokás ezt a státuszt használni.

## Amit a tényleges kódról tudnod kell

- A MongoDB-kapcsolat címe a szerző klaszternevét tartalmazza. A README-ben felsorolt változók megadása önmagában nem elég saját klaszterhez: a `src/utils/mongoose.js` hostját is a sajátodra kell cserélni. A `DB_COLLECTION` változó az URI adatbázisnév-részébe kerül, a neve félrevezető.
- A listázás tulajdonosra szűr, de a szerkesztőoldal és a PATCH/DELETE végpont azonosító alapján keres, külön tulajdonosellenőrzés nélkül. Emiatt a projektet tanulópéldaként kezeld; a jogosultságkezelés ezen része hiányos.
- A PATCH ág nem hívja meg explicit a kapcsolatnyitó függvényt, így egy már meglévő kapcsolatra támaszkodik.
- A létrehozás először tranzakción kívül menti a jegyzetet, majd tranzakción belül ismét ment. Hiba esetén így maradhat félkész adatkapcsolat.
- A regisztráció több hibaválasz után nem tér vissza rögtön, ezért a feldolgozás folytatódhat.
- A főoldali `addNote()` nem várja meg a mentés végét az első újralekérés előtt. Későbbi állapotváltozások is újralekérést indítanak; ez nem ideális sorrend.

Ezeket nem javítottuk át: az útmutató a jelenlegi működést magyarázza. Jó tanulási feladatok, de az alap adatáramlás megértése legyen az első lépés.

## Indítás előkészítése

Szükséges Node.js, npm és saját MongoDB. A gyökérben `.env.local` fájlba kerül a `NEXTAUTH_SECRET`, `DB_USER`, `DB_PASSWORD`, `DB_COLLECTION`; a kódban a MongoDB-hostot a saját klaszteredhez kell igazítani.

```powershell
npm install
npm run dev
```

Felület: `http://localhost:3000`. A projekt régebbi Next.js-verziót használ; a benne lévő Pages Router példákat ne keverd a `next-learn` App Router fájlszerkezetével.

## Tanulási sorrend

Kezdd a `NoteForm`, a főoldal `addNote` és a `pages/api/notes.js` összekapcsolásával. Ezután nézd meg a modelleket, az adatbázis-kapcsolatot és a bejelentkezést. Első javításként a listafrissítés csak a sikeres mentés után történjen; utána tanuld meg a tulajdonosellenőrzést.
