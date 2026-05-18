# TODO App — Documentation du projet

Application Todo full-stack composée d'un backend **Spring Boot** (Java) et d'un frontend **Angular**.

---

## Architecture globale

```
Folder-JAVA/
├── TODO-JAVA/          → Backend Spring Boot (API REST)
├── todo-fontend/       → Frontend Angular (SPA)
└── test.http           → Fichier de tests HTTP manuels
```

---

## Backend — Spring Boot (`TODO-JAVA/`)

> **Stack :** Java 21 · Spring Boot 3.5 · Spring Data JPA · H2 (base en mémoire) · Maven

### `pom.xml`

Fichier de configuration Maven du projet.

- **GroupId :** `com.todo` · **ArtifactId :** `TODO-JAVA`
- **Dépendances principales :**
  | Dépendance | Rôle |
  |---|---|
  | `spring-boot-starter-web` | Serveur HTTP / REST |
  | `spring-boot-starter-data-jpa` | ORM / accès base de données |
  | `h2` (runtime) | Base de données en mémoire |
  | `spring-boot-devtools` (runtime) | Rechargement à chaud |
  | `spring-boot-starter-test` (test) | Tests unitaires |

---

### `src/main/resources/application.properties`

Configuration de l'application.

```properties
spring.application.name=TODO-JAVA
spring.datasource.url=jdbc:h2:mem:tododb          # BDD H2 en mémoire
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create-drop         # Schéma recréé à chaque démarrage
spring.h2.console.enabled=true                    # Console H2 accessible sur /h2-console
server.port=8080
```

---

### `Task.java`

**Entité JPA** représentant une tâche.

**Chemin :** `src/main/java/com/todo/TODO_JAVA/Task.java`

| Champ         | Type            | Contrainte                                                 |
| ------------- | --------------- | ---------------------------------------------------------- |
| `id`          | `long`          | Clé primaire, auto-incrémentée                             |
| `title`       | `String`        | `NOT NULL`                                                 |
| `description` | `String`        | Optionnel                                                  |
| `completed`   | `boolean`       | Défaut : `false`                                           |
| `createdAt`   | `LocalDateTime` | Non modifiable (`updatable = false`), initialisé à `now()` |

- Annoté `@Entity` + `@Table(name = "Task")`
- Getters/setters manuels pour chaque champ

---

### `TaskRepository.java`

**Repository JPA** pour l'accès aux données.

**Chemin :** `src/main/java/com/todo/TODO_JAVA/TaskRepository.java`

- Étend `JpaRepository<Task, Long>` → hérite des opérations CRUD de base
- Méthode dérivée ajoutée : `findByCompleted(boolean completed)` — filtre les tâches par statut

---

### `TaskController.java`

**Contrôleur REST** exposant l'API sur `/api/tasks`.

**Chemin :** `src/main/java/com/todo/TODO_JAVA/TaskController.java`

| Méthode HTTP | Route             | Action                                                      |
| ------------ | ----------------- | ----------------------------------------------------------- |
| `GET`        | `/api/tasks`      | Récupère toutes les tâches                                  |
| `POST`       | `/api/tasks`      | Crée une nouvelle tâche                                     |
| `PUT`        | `/api/tasks/{id}` | Met à jour une tâche existante (titre, description, statut) |
| `DELETE`     | `/api/tasks/{id}` | Supprime une tâche                                          |

- `@CrossOrigin(origins = "http://localhost:4200")` → autorise les requêtes depuis le frontend Angular
- Injection de `TaskRepository` via `@Autowired`
- La mise à jour (`PUT`) lève une `RuntimeException` si la tâche n'est pas trouvée

---

### `TodoJavaApplication.java`

**Point d'entrée** de l'application Spring Boot.

**Chemin :** `src/main/java/com/todo/TODO_JAVA/TodoJavaApplication.java`

- Annoté `@SpringBootApplication`
- Démarre le contexte Spring via `SpringApplication.run(...)`

---

## Frontend — Angular (`todo-fontend/`)

> **Stack :** Angular (standalone components) · TypeScript · FormsModule · HttpClient

### `src/main.ts`

**Point d'entrée** de l'application Angular.

- Appelle `bootstrapApplication(AppComponent, appConfig)` pour démarrer l'app en mode standalone

---

### `src/app/app.config.ts`

**Configuration applicative** Angular.

- Fournit : `provideRouter(routes)` · `provideHttpClient()` · `provideBrowserGlobalErrorListeners()`
- Active `HttpClient` au niveau global (nécessaire pour les appels REST)

---

### `src/app/app.routes.ts`

**Fichier de routes** Angular.

- Routes vides pour ce mini-projet (pas de navigation multi-pages)

---

### `src/app/task.model.ts`

**Interface TypeScript** modélisant une tâche côté frontend.

```typescript
export interface Task {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  createAt?: string;
}
```

- `id` et `description` optionnels (absents lors de la création)
- Miroir du modèle Java côté backend

---

### `src/app/task.service.ts`

**Service Angular** gérant les appels HTTP vers l'API backend.

- URL de base : `http://localhost:8080/api/tasks`

| Méthode            | Appel HTTP               | Description                |
| ------------------ | ------------------------ | -------------------------- |
| `getAll()`         | `GET /api/tasks`         | Récupère toutes les tâches |
| `create(task)`     | `POST /api/tasks`        | Crée une tâche             |
| `update(id, task)` | `PUT /api/tasks/{id}`    | Met à jour une tâche       |
| `delete(id)`       | `DELETE /api/tasks/{id}` | Supprime une tâche         |

- Injecté via `providedIn: 'root'` (singleton global)

---

### `src/app/app.component.ts`

**Composant principal** (standalone) gérant toute la logique UI.

- **Propriétés :**
  - `tasks` : liste des tâches chargées depuis l'API
  - `newTask` : objet lié au formulaire de création
  - `filter` : filtre actif (`'all'` | `'active'` | `'done'`)

- **Méthodes :**
  | Méthode | Rôle |
  |---|---|
  | `ngOnInit()` | Charge les tâches au démarrage |
  | `loadTasks()` | Recharge la liste depuis l'API |
  | `addTask()` | Crée une tâche (ignore si titre vide) |
  | `toggleComplete(task)` | Inverse le statut et sauvegarde via API |
  | `deleteTask(id)` | Supprime une tâche et recharge la liste |
  | `filteredTask` _(getter)_ | Retourne les tâches filtrées selon `filter` |
  | `remaining` _(getter)_ | Compte les tâches non terminées |

---

### `src/app/app.component.html`

**Template HTML** du composant principal.

- Champ de saisie lié à `newTask.title` avec `[(ngModel)]`, soumission au `Enter` ou au clic
- Boutons de filtre (`Toutes` / `À faire` / `Terminés`) avec mise en évidence de l'actif (`[class.active]`)
- Liste `*ngFor` des tâches filtrées avec :
  - Checkbox pour `toggleComplete`
  - Affichage du titre
  - Bouton de suppression avec icône Tabler Icons (`ti-trash`)
  - Classe CSS `.done` appliquée si la tâche est terminée
- Compteur de tâches restantes en bas

---

### `src/app/app.component.css`

**Styles** du composant principal.

- Contient uniquement `body { background: red; }` (personnalisation minimale)

---

## Fichier de tests HTTP — `test.http`

Fichier utilisable avec l'extension REST Client de VS Code pour tester l'API manuellement.

| Requête               | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `POST /api/tasks`     | Crée une tâche `{ "title": "Apprendre", "completed": false }` |
| `GET /api/tasks`      | Liste toutes les tâches                                       |
| `PUT /api/tasks/3`    | Marque la tâche 3 comme terminée                              |
| `DELETE /api/tasks/3` | Supprime la tâche 3                                           |

---

## Flux de données

```
Angular (localhost:4200)
        │
        │  HTTP (JSON)
        ▼
Spring Boot (localhost:8080)
  TaskController  →  TaskRepository  →  H2 (mémoire)
```

1. L'utilisateur interagit avec le composant Angular
2. `TaskService` envoie une requête HTTP à `localhost:8080/api/tasks`
3. `TaskController` traite la requête et délègue à `TaskRepository`
4. `TaskRepository` (JPA) exécute l'opération sur la base H2 en mémoire
5. La réponse JSON remonte jusqu'au template Angular

---

## Lancer le projet

### Backend

```bash
cd TODO-JAVA
./mvnw spring-boot:run
# API disponible sur http://localhost:8080/api/tasks
# Console H2 sur  http://localhost:8080/h2-console
```

### Frontend

```bash
cd todo-fontend
npm install
ng serve
# App disponible sur http://localhost:4200
```
