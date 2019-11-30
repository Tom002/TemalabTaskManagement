
# Projekt felépítése
Az elkészült program egy .Net Core backendből és egy React frontend alkalmazásból áll.
A .Net Core alkalmazás a **TaskManagement** mappában található és az alábbi 3 projektből épül fel.
 - `TaskManagement.Web`: 
	 - Az alkamazás belépési pontja
	 - Itt található a REST api ami kiszolgálja a beérkező HTTP kéréseket
	 - Két Controller-t tartalmaz amik a kéréseket feldolgozzák, `TodosController` és `StatesController`
 - `TaskManagement.DAL`:
	 - Az alkalmazás adatelérési rétege
	 - Entity Framework Core-t használ az adatelérés megvalósításához
	 - Megvalósítja a Repository pattern-t
 - `TaskManagement.Test`:
	 - Unit teszteket tartalmaz
	 - XUnit NuGet csomagot használja a teszteléshez
	 - InMemory providert használ

A React alkalmazás a `client-app` mappában található, vázlatos felépítése, az `src` mappából indulva:

 - `app`
	 - `api`/`agent.ts`: Itt vannak definiálva a lehetséges API hívások és itt van megadva az API alapértelmezett címe (`http://localhost:52126/api`).  Valamint itt történik a szerver által visszaküldött hibát jelző HTTP válaszok kezelése. Axios HTTP klienst használ.
	 - `models`: Alkalmazásban használt Typescript interfészek itt vannak definiálva.
	 - `stores`/`taskStore.ts`: Állapotkezelés megvalósítása Mobx alapon.
	 - `App.tsx`: Itt vannak felsorolva a különböző route-ok, és hogy melyik route esetén komponenst kell kirenderelni.
 - `features`: Itt találhatók az alkalmazás React komponensei, kategóriánként külön mappában
	 - `home`/`HomePage.tsx`: Landing page, egy gomb van rajta egyből a TasksGrid komponensre továbbít
	 - `nav`/`NavBar.tsx`: A navbar-t megvalósító komponens
	 - `state`/`StateCreateForm.tsx`: Állapot létrehozó form komponens
	 - `task`
		 - `TasksGrid.tsx`: 

## React alkalmazás beüzemelése

A react alkalmazás beüzemeléséhez az **npm** csomagkezelőre lesz szükségünk.
Ezt legegyszerűbben a **NodeJs** telepítésével szerezhetjük be.
[https://nodejs.org/en/download/](https://nodejs.org/en/download/)
Telepítés után kiadhatjuk egy terminálban az `npm -v` parancsot hogy ellenőrizzük hogy feltelepült-e, illetve hogy milyen verzió települt fel.

Ezután navigáljunk a **client-app** mappába egy terminálban és adjuk ki az `npm install` parancsot, ez majd letölti a szükséges függőségeket.
Ezután az alkalmazás az `npm start` paranccsal indítható el.
Az alkalmazás alapértelmezeten a `localhost:3000/` url-en fut.

## .Net Core alkalmazás beüzemelése

Az alkalmazásnak egy SQL Server alapú adatbázisra van szüksége a működéshez. A `TaskManagement.Web`/`appsettings.json` fájlban kell átírni a connection string-et.

 - Megnyitva TaskManagement.sln fájlt, a Visual Studio automatikusan letölti a függőségeket, ezután egyből futtathatjuk az alkalmazást a beépített IIS webszerveren.
 - Visual Studio nélkül 
	 - Navigáljunk terminálban a **Task management** mappába és adjuk ki a
		`dotnet restore` parancsot, ez fogja letölteni a függőségeket
	 - Ezután a `dotnet run` paranccsal elindíthatjuk az alkalmazást

Az alkalmazás mindkét esetben a `http://localhost:52126/api` url-en fog futni.
Ezt át lehet írni `TaskManagement.Web`/`Properties`/`launchSettings.json` fájlban, ekkor azonban ezt a React alkalmazásban is át kell írni az `src`/`app`/`api`/`agent.ts` fájlban.

Unit tesztek futtathatóak fordítás után a Visual Studio Test/TestExplorer ablakában.
