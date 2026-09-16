# AI engineering – videóvázlat

**Videó:** Matt Pocock – [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4).

**Forráskorlát:** a teljes videóátirat nem volt elérhető. Ez tematikus vázlat az elérhető videóösszefoglaló és a szerző dokumentációja alapján, nem szó szerinti átirat. A videó fókusza az AI-val támogatott szoftverfejlesztés, nem egy teljes AI engineering tanterv.

## 1. Alapfogalom: skill

A skill újrahasználható utasításcsomag az AI-agent számára. Egy meghatározott feladathoz ad munkamenetet, például tervezéshez vagy ellenőrzéshez. Nem új modell, és nem modellbetanítás. [A szerző skillgyűjteménye](https://github.com/mattpocock/skills).

## 2. A videó fő témái

| Téma | Kezdőbarát magyarázat |
|---|---|
| Dokumentáció és telepítés | A skillgyűjteményhez dokumentációs oldal, plugin-csomagolás és agentekhez tartozó metaadatok készültek. |
| `/wait-what` | Egy nehezen érthető AI-választ érthetőbben újrafogalmaztat, a projekt szóhasználatához igazítva. |
| `/grill-me` | Kérdésekkel tisztázza az elképzelést. Az egymástól független kérdések egy körben jönnek, a függő kérdések később. |
| `/writing-for-agents` | Rövid, célzott dokumentumok írása agenteknek; az általános projektutasításokat és a speciális eljárásokat érdemes elkülöníteni. |
| `/wizard` | Interaktív scriptet készít az ember által elvégzendő beállításokhoz. |
| `/to-questionnaire` | A más ember válaszát igénylő döntésekből kitölthető Markdown-kérdőívet készít. |

Ezeket a v1.2-es változásokat a szerző [kiadási dokumentációja](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more) is ismerteti.

## 3. A fejlesztési folyamat

```text
Igény tisztázása → specifikáció → kis feladatok → megvalósítás → kódellenőrzés
```

A kapcsolódó skillek: `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement` → `/code-review`. A specifikáció leírja az elvárt működést; a ticket egy kisebb, végrehajtható feladat. [Hivatalos munkafolyamat](https://www.aihero.dev/skills).

## 4. Mit gyakorolj ebből? – saját tanulási javaslat

A korábban klónozott React–FastAPI feladatkezelőhöz tervezz címszerkesztést:

1. Írd le, mit lásson és tehessen a felhasználó.
2. Tisztázd az üres cím és a sikertelen mentés viselkedését.
3. Bontsd fel űrlapra, API-hívásra és felületfrissítésre.
4. Kérj az AI-tól kis lépésekben megvalósítást.
5. Ellenőrizd a működést, és kérj magyarázatot a nem értett kódra.

**Tanulási cél:** tudd pontosítani, irányítani és ellenőrizni az AI munkáját. Egy elkészült kódválasz önmagában még nem igazolja a helyes működést.

## Forrás az elérhető videóösszefoglalóhoz

[With Agents – a megadott videó tematikus összefoglalója](https://with-agents.dev/summaries/coding-with-agents/skills-v1-2-grill-me-writing-for-agents/). Másodlagos forrás; a technikai magyarázatokhoz a szerző fent hivatkozott dokumentációját használtuk.
