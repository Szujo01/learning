# React + FastAPI Todo alkalmazás

Ez egy teljes webalkalmazás, amelyben a React kezeli a felületet, a FastAPI pedig a backend API-t.

A program Todo feladatokat kezel:

- a React felületen feladatokat lehet létrehozni és listázni;
- a feladatok állapota módosítható és törölhető;
- a FastAPI JSON API-n keresztül kommunikál a frontenddel;
- az adatokat PostgreSQL adatbázis tárolja.

A projekt Docker Compose-szal indítható, ezért a frontend, a backend és az adatbázis külön szolgáltatásként fut. Kezdőként ebből megtanulható a frontend-backend kommunikáció és egy több részből álló alkalmazás felépítése.