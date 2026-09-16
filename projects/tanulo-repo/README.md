# Webfejlesztés és AI engineering – tanulórepó

Öt GitHub-projekt és magyar, kezdőbarát magyarázatok React, FastAPI, SQLAlchemy, Next.js és AI-val támogatott fejlesztés tanulásához.

## Dokumentáció

- [Projektek rövid összefoglalója](docs/PROJEKTEK_OSSZEFOGLALO.md)
- [A négy technológia fogalmai](docs/TECHNOLOGIAK_FOGALMAI.md)
- [Backend–backend és frontend–backend kommunikáció](docs/BACKEND_KOMMUNIKACIO_MAGYARAZAT.md)
- [AI engineering videóvázlat](docs/AI_ENGINEERING_VIDEO_VAZLAT.md)
- [FastAPI-CRUD-Todo útmutató](docs/FastAPI-CRUD-Todo-KEZDO_UTMUTATO.md)
- [React + FastAPI útmutató](docs/react-fastapi-todo-KEZDO_UTMUTATO.md)
- [todo_api útmutató](docs/todo_api-KEZDO_UTMUTATO.md)
- [Next.js todo útmutató](docs/nextjs-todo-app-KEZDO_UTMUTATO.md)
- [Next.js tananyag útmutató](docs/next-learn-KEZDO_UTMUTATO.md)
- [Codex használati keret – fogalom](docs/CODEX_HASZNALATI_KERET.md)
- [Eredeti projektforrások és verziók](SOURCES.md)

## Klónozás minden projekttel

Az öt projekt Git-almodul: a közös repó az eredeti repókat és azok konkrét commitját hivatkozza. A saját GitHub-repód címével:

```bash
git clone --recurse-submodules <REPO_URL>
```

Ha a közös repót már klónoztad:

```bash
git submodule update --init --recursive
```

A projektek a `projects/` mappába kerülnek. A magyar útmutatók a `docs/` mappában vannak; nem módosítják az eredeti projektek kódját.

## Tanulási sorrend

Backendhez a FastAPI-CRUD-Todo legyen az első, majd a todo_api. Teljes webalkalmazáshoz a react-fastapi-todo használható. Next.js-hez a next-learn blogpéldájával kezdj, majd nézd meg a dashboardot.

A kódot átnéztük, de függőségeket nem telepítettünk, alkalmazásokat nem futtattunk. A részletes útmutatók tartalmazzák a kódból feltárt hiányosságokat. A videóvázlat forráskorlátja és hivatkozásai a dokumentumban olvashatók.

## Feltöltés GitHubra

Hozz létre egy üres GitHub-repót, majd a közös repó gyökerében:

```bash
git remote add origin <REPO_URL>
git push -u origin main
```

Ha még nincs első commit, előbb állítsd be a szerzőt és készítsd el:

```bash
git config user.name "Saját neved"
git config user.email "Saját vagy GitHub noreply e-mail-címed"
git commit -m "Add beginner projects and Hungarian learning documentation"
```

Az almodulok eredeti repóit nem kell pusholnod: a közös repó már publikált commitokra hivatkozik. A külső projektek licenceit az eredeti forrásokban találod; ez a gyűjtemény nem ad nekik új licencet.
