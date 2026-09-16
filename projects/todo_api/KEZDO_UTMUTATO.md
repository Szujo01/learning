# todo_api – a működés magyarázata

Ez a leírás a klónozott kód alapján készült, futtatási ellenőrzés nélkül.

## Mire való?

Egy többfelhasználós feladatkezelő API. Regisztrálhatsz, bejelentkezhetsz, és a saját feladataidat kezelheted. Nincs React- vagy Next.js-felülete; a FastAPI `/docs` oldalán lehet kipróbálni.

FastAPI fogadja a kéréseket, Pydantic ellenőrzi az adatokat, SQLAlchemy 2 kezeli az adatbázist, az `aiosqlite` pedig az SQLite aszinkron elérését biztosítja.

## A fő fájlok szerepe

| Fájl | Feladat |
|---|---|
| `app/main.py` | Alkalmazás, indulási életciklus, routerek és health végpont. |
| `app/core/config.py` | Alapbeállítások, valamint a gyökérmappában lévő `.env` olvasása. |
| `app/core/database.py` | Aszinkron engine és adatbázis-munkamenetek. |
| `app/core/security.py` | Jelszóhash, jelszóellenőrzés és JWT-készítés. |
| `app/api/deps.py` | Tokenből megállapítja az aktuális felhasználót. |
| `app/api/v1/router.py` | Összeköti az auth és todo útvonalakat. |
| `app/api/v1/endpoints/auth.py` | Regisztráció és bejelentkezés. |
| `app/api/v1/endpoints/todos.py` | Saját feladatok listázása és módosítása. |
| `app/models` | A `users` és `todos` táblák, valamint közös időbélyegek. |
| `app/schemas` | Bemeneti és kimeneti adatstruktúrák. |

## Indulás és adatbázis

A `lifespan` induláskor megnyit egy adatbázis-kapcsolatot, és létrehozza a hiányzó táblákat. Az alapértelmezett SQLite-fájl a projekt gyökerében a `todo_app.db`.

A `User` tárolja az e-mail-címet, a jelszó hashét és az aktív állapotot. A `Todo` tárolja a címet, leírást, kész állapotot és a `user_id` tulajdonosazonosítót. Mindkettőnek van `created_at` és `updated_at` mezője. Egy felhasználóhoz több feladat tartozhat: ez egy-több kapcsolat.

A `create_all` hiányzó táblákat hoz létre, meglévő táblák szerkezetét nem migrálja.

## Mi történik regisztrációkor?

Példa a `POST /api/v1/auth/register` JSON-törzsére:

```json
{"email":"tanulo@example.com","password":"tanulo-jelszo-123"}
```

1. A séma ellenőrzi az e-mail formátumát és a jelszó 8–128 karakteres hosszát.
2. A végpont lekérdezi, foglalt-e az e-mail; ha igen, 400-as választ ad.
3. A `get_password_hash()` bcrypttel hashelt változatot készít.
4. A backend a hasht menti el a felhasználóval, majd véglegesíti a mentést.
5. A válasz 201-es státuszú; a `UserResponse` nem küldi vissza a jelszóhash mezőt.

A hash nem visszafejtésre szolgáló titkosítás. Bejelentkezéskor a megadott jelszót összehasonlítjuk a tárolt hashsel. Ebben a kódban a bcrypt bemenetét 72 bájtra vágják; a séma karakterkorlátja ettől eltérő fogalom.

## Mi történik bejelentkezéskor?

A `POST /api/v1/auth/login` **űrlapadatot** vár, nem JSON-t. A mezők neve `username` és `password`, és a `username` helyére az e-mail-címet kell írni.

A backend megkeresi a felhasználót, ellenőrzi a jelszót és az aktív állapotot. Siker esetén JWT-t ad vissza. A JWT egy aláírt token: itt a `sub` a felhasználó azonosítója, az `iat` a kiadás ideje, az `exp` a lejárat. Alapértelmezésben hét napig érvényes. A token aláírt, a tartalma nem titkosított.

A további kérések fejlécében ezt kell elküldeni:

```text
Authorization: Bearer <kapott-token>
```

## Egy védett kérés útja

```text
Kérés → token ellenőrzése → aktuális felhasználó → saját rekordok keresése → válasz
```

A `Depends(get_current_user)` kiolvassa és ellenőrzi a tokent, betölti a felhasználót, és ellenőrzi az aktív állapotot. Hibás vagy lejárt hitelesítésnél 401 jár. Inaktív fióknál a kód 400-at ad.

A todo-végpontok `Todo.user_id == current_user.id` feltételt használnak. Ezért más felhasználó feladatának azonosítóját megadva sem lehet azt olvasni vagy módosítani; a keresés 404-hez vezet. Létrehozáskor a tulajdonosazonosítót a backend állítja be.

## A feladatkezelő végpontok

| Módszer és útvonal | Működés |
|---|---|
| `GET /api/v1/todos/` | Saját lista; `skip`, `limit` és opcionális `is_completed` szűrő. |
| `POST /api/v1/todos/` | Új feladat; kötelező cím, opcionális leírás. |
| `GET /api/v1/todos/{todo_id}` | Egy saját feladat. |
| `PUT /api/v1/todos/{todo_id}` | Csak a megadott mezők módosítása. |
| `DELETE /api/v1/todos/{todo_id}` | Törlés; siker esetén 204, választörzs nélkül. |
| `GET /health` | Egyszerű állapotjelzés; nem teszteli az adatbázis-kapcsolatot. |

A lista alapértelmezett és maximális mérete 100. A cím 1–255, a leírás legfeljebb 2000 karakter. A kész állapot mezője `is_completed`. Nincs explicit rendezés a listalekérdezésben. A `TodoListResponse` séma létezik, de a végpont közvetlen listát ad, nem `total/items` burkolót.

## Mit jelent az async/await?

Az adatbázis-műveletek itt `await`-tel futnak. Amíg egy művelet eredményére vár a szerver, az aszinkron felépítés lehetővé teszi más feladatok kiszolgálását. A mentésnél ezért `await db.commit()` és `await db.refresh()` szerepel. Az `add()` csak előkészíti a mentést, itt nem igényel `await`-et.

## Helyi indítás

A projekt gyökerében:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip install bcrypt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

A külön bcrypt telepítés azért szerepel, mert a kód importálja, de a klónozott `requirements.txt` nem sorolja fel. A rögzített csomagverziók telepíthetőségét nem ellenőriztük.

A `.env` fájlban saját `SECRET_KEY` adható meg; nélküle fejlesztői alapérték működik. Ezt a kulcsot használja a JWT aláírása. A `/docs` oldalon először regisztrálj, majd az Authorize gombnál add meg az e-mailt a username mezőben és a jelszót. Ezután próbáld a todo-végpontokat.

## Tanulási sorrend

Olvasd a modelleket és sémákat, utána a regisztrációt, bejelentkezést, a `deps.py` ellenőrzését és végül a todo-végpontokat. Jó első gyakorlat a cím szerinti keresés; ezt ugyanúgy a tulajdonosfeltétel mellett kell hozzáadni.
