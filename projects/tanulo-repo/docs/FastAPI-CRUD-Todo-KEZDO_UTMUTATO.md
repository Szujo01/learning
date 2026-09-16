# FastAPI-CRUD-Todo – a működés magyarázata

Ez az útmutató a klónozott kód alapján készült. Az alkalmazást nem futtattuk; az indítási lépések előkészítést jelentenek.

## Mire való?

Egy feladatlista háttérrendszere. Feladatokat lehet létrehozni, listázni, módosítani és törölni. Nincs React-felülete: a böngészőben a FastAPI `/docs` oldalán próbálhatod ki az API-t.

Az API olyan elérési pontok gyűjteménye, amelyekhez egy kliens HTTP-kérést küld. A válasz itt általában JSON, például egy feladat mezőinek gyűjteménye.

## Melyik fájl mit csinál?

| Fájl | Feladat |
|---|---|
| `main.py` | Létrehozza a FastAPI alkalmazást, létrehozatja a hiányzó táblákat, és bekapcsolja a feladatok útvonalait. |
| `database/database.py` | Beállítja az SQLite-kapcsolatot és a kérésenként használt adatbázis-munkamenetet. |
| `models/models.py` | A `TodoItem` Python-osztállyal leírja a `todos` táblát. |
| `schemas/schemas.py` | Meghatározza a bemeneti és kimeneti adatok szerkezetét. |
| `routers/todo.py` | Az öt feladatkezelő végpont megvalósítása. |
| `requirements.txt` | A szükséges Python-csomagok rögzített verziói. |

## Mi történik induláskor?

1. A `main.py` importálja a routert; ezen keresztül a modell is betöltődik.
2. A SQLAlchemy megismeri a `todos` tábla szerkezetét.
3. A `Base.metadata.create_all(bind=engine)` létrehozza a hiányzó táblát.
4. Az alkalmazás a `/todos` előtag alá helyezi a feladatkezelő útvonalakat.

Az adatok a `todo.db` fájlba kerülnek, a futtatás aktuális munkamappájában. Ez tartós tárolás: a szerver újraindításától nem vész el a lista. A `create_all` nem adatbázis-migráció: egy meglévő tábla mezőit nem alakítja automatikusan át.

## Hogyan néz ki egy feladat?

| Mező | Jelentés |
|---|---|
| `id` | Adatbázis által kiosztott azonosító. |
| `title` | A feladat címe; létrehozáskor kötelező szöveg. |
| `description` | Opcionális leírás. |
| `status` | Szöveges állapot, alapértéke `pending`. |

A státusz nincs megengedett értékekre korlátozva. A cím típusa ellenőrzött, de nincs minimumhossz: az üres szöveget a séma nem tiltja.

## Egy új feladat útja

Példa a `POST /todos/` kérés törzsére:

```json
{"title": "FastAPI tanulása", "description": "Első végpont", "status": "pending"}
```

1. A Pydantic a `TodoCreate` séma szerint feldolgozza a JSON-t.
2. A `Depends(get_db)` biztosít egy adatbázis-munkamenetet. Ez a munkamenet fogja össze a lekérdezéseket és módosításokat.
3. A `TodoItem(**todo.dict())` adatbázis-modellt készít a mezőkből.
4. A `db.add()` előkészíti a beszúrást, a `db.commit()` véglegesíti a mentést.
5. A `db.refresh()` visszaolvassa a rekordot, például a kiosztott azonosítót.
6. A `TodoOut` séma alakítja a választ JSON-ná; az `orm_mode` lehetővé teszi az adatbázis-objektum mezőinek olvasását.
7. A `get_db()` végül lezárja a munkamenetet.

A SQLAlchemy ORM azt jelenti, hogy Python-osztályokkal és objektumokkal dolgozol, a könyvtár pedig ebből SQL-műveleteket készít.

## Végpontok

| Módszer és útvonal | Működés |
|---|---|
| `GET /` | Üdvözlő JSON. |
| `POST /todos/` | Új feladat mentése; nincs külön 201 beállítva, így siker esetén 200 a válasz. |
| `GET /todos/?skip=0&limit=10` | Lista; a `skip` kihagy rekordokat, a `limit` korlátozza a darabszámot. |
| `GET /todos/{todo_id}` | Egy feladat; hiányzó azonosítónál 404. |
| `PUT /todos/{todo_id}` | Csak a beküldött mezőket változtatja meg. |
| `DELETE /todos/{todo_id}` | Töröl és visszaad egy megerősítő JSON-t. |

A PUT itt részleges módosításként működik az `exclude_unset=True` miatt. Nincs bejelentkezés vagy tulajdonosellenőrzés: minden kliens ugyanazt a listát kezeli.

## Indítás Windows alatt

A projekt gyökérmappájában, PowerShellből:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

Ez külön Python-környezetet készít, telepíti a csomagokat, majd elindítja a fejlesztői szervert. A virtuális környezet aktiválása nem szükséges, mert közvetlenül annak Pythonját hívjuk. Nyisd meg: `http://127.0.0.1:8000/docs`.

A projekt Pydantic 1-es mintát használ. Tanulás közben először a rögzített csomagverziókkal dolgozz; egy verzióváltás a séma kódjának módosítását is igényelheti.

## Ajánlott olvasási sorrend és gyakorlat

Olvasd el a modellt, a sémákat, az adatbázis-modult, a routert, végül a `main.py` fájlt. Kövesd végig a létrehozást a fenti hét lépéssel.

Első gyakorlatként adj minimumhosszt a címhez. Utána korlátozd a státuszt néhány értékre, majd készíts státusz szerinti szűrést. Figyeld meg a különbséget az adatok ellenőrzése és az adatbázisba mentése között.
