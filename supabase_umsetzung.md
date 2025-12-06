# Supabase Integration - Umsetzungsplan

## Übersicht

Dieses Dokument beschreibt, wie Supabase in das bestehende Nuxt-Projekt integriert werden kann, um Bewerbungsdaten zu speichern und später über einen Login abrufbar zu machen.

---

## 1. Was ist Supabase?

Supabase ist eine Open-Source Alternative zu Firebase. Es bietet:
- **PostgreSQL Datenbank** (relationale Datenbank)
- **Authentifizierung** (Login/Registrierung)
- **REST API** (automatisch generiert aus der Datenbank)
- **Realtime** (Live-Updates)

---

## 2. Benötigte Packages

```bash
npm install @supabase/supabase-js
# Optional: Nuxt-Modul für bessere Integration
npm install @nuxtjs/supabase
```

---

## 3. Neue Ordner und Dateien

### 3.1 Ordnerstruktur (NEU)

```
app/
├── composables/
│   └── useSupabase.ts        # NEU: Supabase Client Composable
├── server/
│   └── api/
│       └── bewerbungen/
│           ├── index.post.ts  # NEU: POST /api/bewerbungen (Bewerbung speichern)
│           └── index.get.ts   # NEU: GET /api/bewerbungen (Bewerbungen abrufen - nur mit Auth)
├── types/
│   └── database.ts            # NEU: TypeScript-Typen für die Datenbank
```

### 3.2 Konfigurationsdateien (ANPASSEN)

```
nuxt.config.ts                 # Supabase-Modul registrieren
.env                           # NEU: Supabase Credentials (NICHT in Git!)
```

---

## 4. Umgebungsvariablen (.env)

```env
# .env (im Projekt-Root, in .gitignore eintragen!)
SUPABASE_URL=https://deine-projekt-id.supabase.co
SUPABASE_KEY=dein-anon-public-key
```

Diese Werte erhältst du im Supabase Dashboard unter:
Project Settings → API → Project URL & anon/public key

---

## 5. Datenbank-Struktur (in Supabase)

### Tabelle: `bewerbungen`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | uuid (PK) | Automatisch generiert |
| created_at | timestamp | Zeitstempel der Bewerbung |
| job_id | text | ID des Jobs (z.B. "it", "hr") |
| job_title | text | Titel des Jobs |
| evil_score | integer | Berechneter Evil Score |
| name | text | Name des Bewerbers |
| email | text | E-Mail des Bewerbers |
| salary | text | Gehaltsvorstellung |
| availability | text | Verfügbarkeit |
| motivation | text | Wechselgrund |
| answers | jsonb | Alle Quiz-Antworten als JSON |

### SQL zum Erstellen der Tabelle:

```sql
CREATE TABLE bewerbungen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  job_id TEXT NOT NULL,
  job_title TEXT NOT NULL,
  evil_score INTEGER DEFAULT 0,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  salary TEXT,
  availability TEXT,
  motivation TEXT,
  answers JSONB
);

-- Row Level Security aktivieren (optional, aber empfohlen)
ALTER TABLE bewerbungen ENABLE ROW LEVEL SECURITY;
```

---

## 6. Code-Implementierung

### 6.1 nuxt.config.ts (ANPASSEN)

```typescript
export default defineNuxtConfig({
  // ... bestehende Config
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase'  // NEU
  ],
  
  supabase: {
    redirect: false  // Kein automatischer Redirect bei fehlender Auth
  },
  
  runtimeConfig: {
    // Server-only (nicht im Browser sichtbar)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    // Public (auch im Browser verfügbar)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  }
})
```

### 6.2 server/api/bewerbungen/index.post.ts (NEU)

```typescript
// Server API Route: POST /api/bewerbungen
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)
  
  // Validierung
  if (!body.job_id || !body.name || !body.email) {
    throw createError({
      statusCode: 400,
      message: 'Pflichtfelder fehlen: job_id, name, email'
    })
  }
  
  // In Supabase speichern
  const { data, error } = await client
    .from('bewerbungen')
    .insert({
      job_id: body.job_id,
      job_title: body.job_title,
      evil_score: body.evil_score,
      name: body.name,
      email: body.email,
      salary: body.salary,
      availability: body.availability,
      motivation: body.motivation,
      answers: body.answers
    })
    .select()
    .single()
  
  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
  
  return { success: true, data }
})
```

### 6.3 app/pages/bewerbung/[id].vue (ANPASSEN)

Die `submitApplication` Funktion muss angepasst werden:

```typescript
// VORHER (nur alert):
const submitApplication = () => {
  alert(`Bewerbung versendet!`)
  router.push('/')
}

// NACHHER (API-Call):
const submitApplication = async () => {
  try {
    const response = await $fetch('/api/bewerbungen', {
      method: 'POST',
      body: {
        job_id: job?.id,
        job_title: job?.title,
        evil_score: evilScore.value,
        name: adminData.value.name,
        email: adminData.value.email,
        salary: adminData.value.salary,
        availability: adminData.value.availability,
        motivation: adminData.value.motivation,
        answers: {
          // Optional: Alle Antworten als JSON speichern
          evilScore: evilScore.value,
          jobScores: jobScores.value
        }
      }
    })
    
    // Erfolg
    router.push('/bewerbung/erfolg')
    
  } catch (error) {
    console.error('Fehler beim Speichern:', error)
    alert('Fehler beim Senden der Bewerbung')
  }
}
```

---

## 7. Datenfluss-Diagramm

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (Client)                        │
│                                                             │
│  bewerbung/[id].vue                                         │
│       │                                                     │
│       │ submitApplication()                                 │
│       │ $fetch('/api/bewerbungen', { method: 'POST', ... }) │
│       ▼                                                     │
└───────┬─────────────────────────────────────────────────────┘
        │
        │  HTTP POST Request
        ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVER (Nuxt)                           │
│                                                             │
│  server/api/bewerbungen/index.post.ts                       │
│       │                                                     │
│       │ serverSupabaseClient(event)                         │
│       │ client.from('bewerbungen').insert(...)              │
│       ▼                                                     │
└───────┬─────────────────────────────────────────────────────┘
        │
        │  PostgreSQL Insert
        ▼
┌─────────────────────────────────────────────────────────────┐
│                     SUPABASE (Cloud)                        │
│                                                             │
│  PostgreSQL Datenbank                                       │
│  Tabelle: bewerbungen                                       │
│       │                                                     │
│       │ INSERT INTO bewerbungen (...)                       │
│       │ RETURNING *                                         │
│       ▼                                                     │
│  Daten gespeichert!                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Warum diese Struktur?

### Nuxt Best Practices:

| Ordner | Zweck | Warum hier? |
|--------|-------|-------------|
| `server/api/` | Backend-Logik | API-Routen laufen auf dem Server, Credentials sind sicher |
| `composables/` | Wiederverwendbare Logik | Falls Client-seitig Supabase genutzt wird |
| `.env` | Secrets | Credentials nie im Code, nur in Umgebungsvariablen |

### Vorteile:

1. **Sicherheit**: Supabase-Credentials sind nur auf dem Server
2. **Typsicherheit**: TypeScript-Typen für die Datenbank
3. **Trennung**: Frontend (Vue) und Backend (Server API) sind getrennt
4. **Nuxt-Konform**: Nutzt die offizielle Nuxt-Supabase-Integration

---

## 9. Nächste Schritte (Implementierung)

1. [ ] Supabase-Projekt erstellen (supabase.com)
2. [ ] Packages installieren (`@nuxtjs/supabase`)
3. [ ] `.env` Datei erstellen mit Credentials
4. [ ] Tabelle `bewerbungen` in Supabase anlegen
5. [ ] `nuxt.config.ts` anpassen
6. [ ] Server API Route erstellen (`server/api/bewerbungen/index.post.ts`)
7. [ ] `bewerbung/[id].vue` anpassen (API-Call statt alert)
8. [ ] Erfolgsseite erstellen (`bewerbung/erfolg.vue`)
9. [ ] Testen!

---

## 10. Spätere Erweiterung: Admin-Bereich mit Login

Für den späteren Login-Bereich (Bewerbungen abrufen):

```
app/
├── pages/
│   └── admin/
│       ├── index.vue          # Dashboard mit Bewerbungsliste
│       └── login.vue          # Login-Seite
├── middleware/
│   └── auth.ts                # Schutz für Admin-Bereich
└── server/
    └── api/
        └── bewerbungen/
            └── index.get.ts   # GET (nur mit Auth)
```

Das ist aber ein separates Thema für später.

---

## Zusammenfassung

| Was | Datei | Beschreibung |
|-----|-------|--------------|
| Package | `@nuxtjs/supabase` | Offizielle Nuxt-Integration |
| Config | `nuxt.config.ts` | Modul registrieren |
| Secrets | `.env` | Supabase URL + Key |
| API | `server/api/bewerbungen/index.post.ts` | Daten speichern |
| Frontend | `bewerbung/[id].vue` | API aufrufen |
| Datenbank | Supabase Dashboard | Tabelle anlegen |

