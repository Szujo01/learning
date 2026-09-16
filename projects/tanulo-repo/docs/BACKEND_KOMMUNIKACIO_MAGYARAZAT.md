# Hogyan kommunikál a backend egy másik backenddel?

## 1. Az alapötlet

A backend a szerveren futó program: fogadja a kéréseket, feldolgozza az adatokat és válaszol. Egy backend másik backendnek is küldhet kérést. Ilyenkor a kérés küldője **kliensként**, a fogadója **szerverként** működik.

Például egy rendeléskezelő backend lekérheti egy raktárkezelő backendtől, hogy van-e készleten egy termék.

```text
Rendeléskezelő backend → HTTP-kérés → Raktárkezelő backend
                      ← JSON-válasz ←
```

Mindkettő backend, de az adott kérésben külön szerepük van. Nem szükséges ugyanazt a programnyelvet használniuk: a közös megállapodás az API.

## 2. Mi az API, a HTTP és a JSON?

- **API:** meghatározza, milyen címen milyen művelet kérhető, milyen adatot kell küldeni, és milyen válasz várható.
- **HTTP:** a kérés és válasz továbbításának szabályrendszere.
- **JSON:** gyakori szöveges adatformátum, amelyet mindkét program fel tud dolgozni.

Egy HTTP-kérés fontos részei:

| Rész | Példa | Jelentés |
|---|---|---|
| Módszer | `GET` | Mit szeretnénk csinálni? |
| Cím | `http://raktar:8000/api/products/42` | Melyik szolgáltatást és erőforrást kérjük? |
| Fejlécek | `Authorization: Bearer <token>` | Kiegészítő adatok, például hitelesítés. |
| Törzs | `{"quantity":2}` | Beküldött adatok; nem minden kéréshez szükséges. |

A fogadó backend végpontja egy adott útvonalhoz és módszerhez kapcsolt függvény.

## 3. Egy kérés teljes útja

Tegyük fel, hogy a rendeléskezelő a 42-es termék készletét kéri le.

1. A rendeléskezelő elküldi a `GET /api/products/42` kérést a raktárkezelőnek.
2. A raktárkezelő ellenőrzi a kérést és szükség esetén a hitelesítést.
3. Lekérdezi a saját adatbázisát.
4. Választ küld: HTTP-státuszkódot és JSON-adatot.
5. A rendeléskezelő ellenőrzi a státuszt, feldolgozza a JSON-t, majd folytatja a saját feladatát.

Példaválasz:

```json
{"id":42,"name":"Billentyűzet","stock":12}
```

A kérő backend itt nem a másik adatbázisát olvassa közvetlenül. A másik szolgáltatás API-ján keresztül jut az adathoz.

## 4. Rövid Python-példa

Ez külön szemléltető kód, nem a klónozott repók része. A futtatásához az `httpx` csomag szükséges.

```python
import httpx

async def get_product(product_id: int) -> dict:
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(
            f"http://raktar:8000/api/products/{product_id}"
        )
        response.raise_for_status()
        return response.json()
```

- Az `AsyncClient` küldi a HTTP-kérést.
- Az `await` megvárja az eredményt; közben az aszinkron szerver más feladatokat is kezelhet.
- A `timeout` időkorlátot ad a hálózati műveletekhez, hogy ne várjon korlátlanul a kód.
- A `raise_for_status()` hibát jelez sikertelen HTTP-válasznál.
- A `json()` Python-adattá alakítja a válasz JSON-törzsét.

A `raktar` név csak olyan hálózatban működik, amely ismeri ezt a szolgáltatásnevet. Két helyi szerverhez például `http://localhost:8001` lehet a célcím. Konténeren belül a `localhost` magát az adott konténert jelenti.

## 5. Műveletek és hibák

| HTTP-módszer | Szokásos cél |
|---|---|
| `GET` | Adatok lekérése. |
| `POST` | Új adat létrehozása vagy művelet kezdeményezése. |
| `PATCH` | Néhány mező módosítása. |
| `PUT` | Általában teljes erőforrás cseréje; egyes tanulóprojektek részleges módosításra használják. |
| `DELETE` | Törlés. |

Gyakori válaszkódok: **200** siker, **201** létrehozás, **204** siker választörzs nélkül, **401** hiányzó vagy hibás hitelesítés, **403** nincs jogosultság, **404** nem található, **500** szerverhiba.

Hálózati hibánál vagy időtúllépésnél HTTP-válasz sem feltétlenül érkezik. A kérő backendnek ezt is kezelnie kell. Egy mentési kérés ismétlése külön figyelmet igényel: ha az első mentés sikerült, de a válasz elveszett, az ismétlés duplázást okozhat.

## 6. És hogyan kommunikál a frontend a backenddel?

Ha a kérdésben erre gondoltál: az alapfolyamat ugyanez, csak a kliens a böngészőben futó React-felület.

```text
React frontend → HTTP-kérés → FastAPI backend → SQLAlchemy → adatbázis
               ← JSON-válasz ←
```

A `react-fastapi-todo` projektben az Add gomb után a frontend ezt küldi:

```javascript
const response = await fetch('/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Kommunikáció tanulása' }),
})

if (!response.ok) throw new Error('A mentés sikertelen')
const todo = await response.json()
```

A backend ellenőrzi a címet, elmenti a feladatot és visszaküldi a mentett rekordot az azonosítójával. A React ezt a saját állapotába teszi, így megjelenik az új listaelem. A `fetch` HTTP-hibakódnál önmagában nem dob hibát, ezért kell a `response.ok` ellenőrzése.

Docker Compose használatakor ebben a projektben az nginx továbbítja az `/api` kéréseket a FastAPI-nak. Ez **proxyzás**, nem egy második üzleti backend. A SQLAlchemy és az adatbázis közötti kapcsolat pedig adatbázis-kapcsolat, nem JSON-os HTTP API-hívás.

A böngésző eltérő eredetű címeknél CORS-szabályokat is ellenőriz. Két backend közötti szokásos HTTP-hívást ezek a böngészős szabályok nem korlátozzák; hitelesítésre és jogosultságellenőrzésre ettől még szükség lehet.

## 7. Kapcsolódás az öt projekthez

- **FastAPI-CRUD-Todo és todo_api:** API-t szolgáltatnak; a `/docs` felület vagy egy másik program lehet a kliensük.
- **react-fastapi-todo:** külön React-felület hívja a FastAPI-t.
- **nextjs-todo-app:** a böngésző a Next.js alkalmazás saját API-végpontjait hívja.
- **next-learn dashboard:** szerverkomponensek és szerverműveletek közvetlenül kezelik az adatbázist; nem minden adatkezeléshez tartozik külön, kézzel írt REST-végpont.

A klónozott projektekben nem azonosítottunk külön rendeléskezelő–raktárkezelő jellegű backendpárt. A fenti példa a backendek közötti kommunikáció elvét szemlélteti.

## 8. Gyakorlás

A FastAPI-CRUD-Todo `/docs` oldalán hozz létre egy feladatot, jegyezd fel az azonosítóját, majd kérd le azt a megfelelő GET végponttal. Figyeld meg a kérés címét, módszerét, törzsét és a válasz státuszkódját. Ugyanezt egy másik backend is el tudja végezni HTTP-klienssel.
