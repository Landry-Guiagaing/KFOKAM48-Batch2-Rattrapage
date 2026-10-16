/**
 * Composant : ListeTickets
 * Couche : Présentation (composant "muet").
 *
 * Responsabilité : afficher le tableau des tickets et gérer les 4 états :
 *   1. Chargement  → spinner visible, jamais d'écran figé
 *   2. Erreur      → message + bouton "Réessayer" (détecte serveur injoignable)
 *   3. Liste vide  → message "Aucun ticket" avec les en-têtes du tableau
 *   4. Données     → tableau rempli avec bouton Fermer conditionnel
 *
 * Ce composant ne fait AUCUN appel API — il reçoit tout via props.
 */

import type { ErreurAPI, Ticket } from '../types/ticket';

interface Props {
  tickets: Ticket[];
  chargement: boolean;
  erreur: ErreurAPI | null;
  onReessayer: () => void;
  onFermer: (id: number) => void;
}

/** Formate une date ISO-8601 en français lisible */
function formaterDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Badge Bootstrap coloré selon le statut */
function BadgeStatut({ statut }: { statut: string }) {
  const couleurs: Record<string, string> = {
    OUVERT: 'bg-success',
    EN_COURS: 'bg-warning text-dark',
    FERME: 'bg-secondary',
  };
  const labels: Record<string, string> = {
    OUVERT: 'Ouvert',
    EN_COURS: 'En cours',
    FERME: 'Fermé',
  };
  return (
    <span className={`badge ${couleurs[statut] ?? 'bg-secondary'}`}>
      {labels[statut] ?? statut}
    </span>
  );
}

export default function ListeTickets({ tickets, chargement, erreur, onReessayer, onFermer }: Props) {

  // ── État 1 : Chargement ──────────────────────────────────────────────────
  if (chargement) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary me-3" role="status">
          <span className="visually-hidden">Chargement…</span>
        </div>
        <span className="text-muted">Chargement des tickets…</span>
      </div>
    );
  }

  // ── État 2 : Erreur ──────────────────────────────────────────────────────
  if (erreur) {
    const messageErreur = erreur.injoignable
      ? 'Le serveur est injoignable. Vérifiez que le backend est démarré sur le port 8080.'
      : erreur.message;

    return (
      <div className="alert alert-danger d-flex flex-column gap-2" role="alert">
        <div className="d-flex align-items-center gap-2">
          <strong>⚠ Erreur de chargement</strong>
        </div>
        <p className="mb-1">{messageErreur}</p>
        {erreur.details && erreur.details.length > 0 && (
          <ul className="mb-1">
            {erreur.details.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        )}
        <div>
          <button className="btn btn-outline-danger btn-sm" onClick={onReessayer}>
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  // ── État 3 & 4 : Tableau (vide ou rempli) ───────────────────────────────
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Titre</th>
            <th scope="col">Statut</th>
            <th scope="col">Date de création</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* État 3 : liste vide — en-têtes présents, message explicite */}
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-muted py-4">
                Aucun ticket pour le moment.
              </td>
            </tr>
          ) : (
            /* État 4 : données */
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>
                  <strong>{ticket.titre}</strong>
                  {ticket.description && (
                    <div className="text-muted small">{ticket.description}</div>
                  )}
                </td>
                <td><BadgeStatut statut={ticket.statut} /></td>
                <td>{formaterDate(ticket.dateCreation)}</td>
                <td>
                  {/* Bouton visible uniquement si OUVERT ou EN_COURS (RG-03) */}
                  {ticket.statut !== 'FERME' && (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => onFermer(ticket.id)}
                    >
                      Fermer
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
