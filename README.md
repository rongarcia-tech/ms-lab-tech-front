# MsLabFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



# 🧱 Patrones de Diseño Implementados en el Proyecto

Este documento resume los principales patrones de diseño utilizados en la arquitectura del proyecto Angular, indicando dónde encontrarlos dentro del código.

---

## 1. Arquitectura por Módulos (Module / Feature Module Pattern)

### 📌 Qué es  
Organización por módulos con responsabilidades claras: núcleo, compartido, layouts y features.

### 📂 Dónde se ve

**Módulo raíz**
- `src/app/app-module.ts` → `AppModule`

**Infraestructura**
- `src/app/core/core-module.ts` → `CoreModule`
- `src/app/shared/shared-module.ts` → `SharedModule`
- `src/app/layout/layout-module.ts` → `LayoutModule`

**Features**
- `src/app/features/auth/auth-module.ts` → `AuthModule`
- `src/app/features/labs/labs-module.ts` → `LabsModule`
- `src/app/features/orders/orders-module.ts` → `OrdersModule`
- `src/app/features/users/users-module.ts` → `UsersModule`

---

## 2. Inyección de Dependencias + Singleton en Servicios

### 📌 Qué es  
Angular inyecta dependencias automáticamente y crea servicios singleton con `providedIn: 'root'`.

### 📂 Dónde se ve

Servicios:
- `AuthService` → `src/app/core/services/auth.ts`
- `LabsService` → `src/app/core/services/lab.service.ts`
- `OrdersService` → `src/app/core/services/orders.service.ts`
- `UserService` → `src/app/core/services/user.service.ts`

Inyección por constructor en componentes como:
- LoginPage, LabsPage, OrdersPage, ProfilePage, Header

---

## 3. Patrón Observer / Programación Reactiva

### 📌 Qué es  
Uso de Observables, BehaviorSubject y async pipe para manejar streams de datos reactivos.

### 📂 Ejemplos

**Estado de login (AuthService)**  
```ts
private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
loggedIn$ = this.loggedInSubject.asObservable();
```

**LabsPage usando Observables**
```ts
labs$!: Observable<LabResponse[]>;
```

**Header leyendo loggedIn$**
```ts
this.loggedIn$ = this.authService.loggedIn$;
```

**BreakpointObserver (layout responsivo)**
- `src/app/layout/components/main-layout/main-layout.ts`

---

## 4. Patrón Fachada (Facade)

### 📌 Qué es  
Capa que simplifica lógica interna y expone una API limpia.

### 📂 Ejemplos

**AuthService**
- Manejo del token
- Manejo del usuario actual
- Streams reactivos
- login(), logout(), isLoggedIn(), getCurrentUser()

**UserService**
```ts
getCurrentUser(): Observable<UserResponse>
```

**ProfilePage**
```ts
ngOnInit() {
  this.user$ = this.userService.getCurrentUser();
}
```

---

## 5. Patrón Repository / Capa de Acceso a Datos

### 📌 Qué es  
Abstracción del origen de los datos (mock ahora → API real después).

### 📂 Dónde se ve
- `LabsService`
- `OrdersService`
- `UserService`

---

## 6. Patrón Shell Layout + Guards

### 📌 Qué es  
Layout principal que envuelve páginas protegidas y usa router-outlet.  
`AuthGuard` controla acceso.

### 📂 Dónde se ve

**Shell Layout**
- `src/app/layout/components/main-layout/main-layout.ts`

**Rutas protegidas**
- `src/app/app-routing-module.ts`

**AuthGuard**
```ts
if (this.authService.isLoggedIn()) return true;
this.router.navigate(['/login']);
return false;
```

---

## 7. Patrón Contenedor / Presentacional

### 📌 Qué es  
Separar componentes que manejan lógica (contenedores) de los que muestran UI (presentacionales).

### 📂 Contenedores (pages)
- HomePage, LoginPage, RegisterPage, LabsPage, OrdersPage, ProfilePage

### 📂 Presentacionales
- Header
- Sidebar
- LabsList

---

## 8. DTOs / Modelos Tipados + Mocks

### 📌 Qué es  
DTOs definen estructura de datos y mocks simulan backend.

### 📂 DTOs
- `user.models.ts`
- `labs.models.ts`
- `orders.models.ts`
- `auth.models.ts`

### 📂 Mocks
- `auth.mocks.ts`
- `labs.mocks.ts`
- `orders.mocks.ts`
- `user.mocks.ts`

---
