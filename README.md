# Module Ticket — KFOKAM48 Batch 2 (Rattrapage)

Backend Spring Boot 3.2 (Java 17, Maven) + PostgreSQL (Docker) + frontend React/TypeScript/Vite (Bootstrap via CDN).

## Démarrage

```bash
# 1. Base PostgreSQL (port hôte 5433)
docker compose up -d

# 2. Backend  → http://localhost:8080  (Swagger : /swagger-ui.html)
cd backend && mvn spring-boot:run

# 3. Frontend → http://localhost:5173
cd frontend && npm install && npm run dev
```

Shell Fish : les commandes ci-dessus sont compatibles (pas de `&&` requis entre elles).

## Vérifier un ticket en base

```bash
docker exec ticketdb psql -U ticket_user -d ticketdb -c "SELECT id, titre, statut, date_creation FROM ticket ORDER BY date_creation DESC;"
```

## API

| Verbe | Chemin | Succès | Erreurs |
|---|---|---|---|
| POST | /api/tickets | 201 | 400, 409 (RG-02) |
| GET | /api/tickets?statut=OUVERT\|EN_COURS\|FERME | 200 | 400 (statut invalide) |
| PATCH | /api/tickets/{id}/fermer | 200 | 404, 409 (RG-03) |

Format d'erreur : `{ "status", "erreur", "message", "details": [] }`.

## Architecture

- `backend/` : `entity` → `repository` → `service` → `controleur`, DTO en entrée/sortie, `@RestControllerAdvice` pour les erreurs.
- `frontend/src/` : `services/ticketService.ts` (seul à appeler `fetch`), `components/TicketsPage` (conteneur), `TicketListe`, `TicketFormulaire`, `ConfirmationModal`.

## Scénarios à montrer au formateur

1. Liste vide → « Aucun ticket » avec en-têtes.
2. Backend arrêté + rechargement → message « serveur injoignable » + bouton Réessayer.
3. Titre de 101 caractères → message de validation du serveur sous le champ.
4. Titre en doublon (même en changeant la casse) → message RG-02 sous le champ.
5. Fermer un ticket, puis le re-fermer depuis Swagger et cliquer « Fermer » sur l'ancienne ligne → message RG-03.
