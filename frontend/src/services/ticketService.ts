/**
 * Couche : Service API.
 * Responsabilité : encapsuler TOUS les appels HTTP vers le backend.
 *
 * Règle du sujet : aucun fetch/axios directement dans un composant.
 * Ce fichier est le seul endroit où l'on communique avec le backend.
 *
 * Gestion d'erreurs normalisée :
 *   - Si fetch() lève une TypeError (réseau injoignable) → ErreurAPI.injoignable = true
 *   - Si le backend répond avec un code d'erreur (400/404/409) → ErreurAPI.injoignable = false
 *   - On ne lance jamais d'erreur non typée vers les composants
 */

import type { ErreurAPI, ErreurBackend, Statut, Ticket, TicketCreation } from '../types/ticket';

const BASE_URL = 'http://localhost:8080/api/tickets';

// ============================================================
// Utilitaire : normalise n'importe quelle erreur en ErreurAPI
// ============================================================

/**
 * Convertit une erreur brute (réseau ou réponse backend) en ErreurAPI normalisée.
 * Cette fonction est appelée dans chaque catch — les composants reçoivent
 * toujours le même type d'erreur, peu importe la cause.
 */
async function normaliserErreur(erreur: unknown): Promise<ErreurAPI> {
  // Erreur réseau : le serveur est injoignable (backend arrêté, mauvais port…)
  if (erreur instanceof TypeError) {
    return {
      injoignable: true,
      status: 0,
      message: 'Le serveur est injoignable. Vérifiez que le backend est démarré.',
    };
  }

  // Réponse HTTP d'erreur du backend (400, 404, 409…)
  if (erreur instanceof Response) {
    try {
      const corps: ErreurBackend = await erreur.json();
      return {
        injoignable: false,
        status: corps.status ?? erreur.status,
        message: corps.message ?? 'Erreur inconnue.',
        details: corps.details,
        erreur: corps.erreur,
      };
    } catch {
      return {
        injoignable: false,
        status: erreur.status,
        message: `Erreur ${erreur.status} : réponse inattendue du serveur.`,
      };
    }
  }

  // Erreur JavaScript inattendue
  return {
    injoignable: false,
    status: 0,
    message: 'Une erreur inattendue est survenue.',
  };
}

// ============================================================
// Lancer une Response comme erreur depuis fetch
// ============================================================

/**
 * Vérifie si la réponse fetch est une erreur (status >= 400).
 * Si oui, lance la Response comme exception pour qu'elle soit
 * capturée par normaliserErreur().
 */
function verifierReponse(reponse: Response): Response {
  if (!reponse.ok) {
    throw reponse;
  }
  return reponse;
}

// ============================================================
// GET /api/tickets — Lister les tickets
// ============================================================

/**
 * Récupère la liste des tickets.
 * @param statut filtre optionnel (OUVERT, EN_COURS, FERME)
 * @returns tableau de tickets ou ErreurAPI
 */
export async function listerTickets(statut?: Statut): Promise<Ticket[] | ErreurAPI> {
  try {
    const url = statut ? `${BASE_URL}?statut=${statut}` : BASE_URL;
    const reponse = await fetch(url);
    verifierReponse(reponse);
    return await reponse.json() as Ticket[];
  } catch (erreur) {
    return normaliserErreur(erreur);
  }
}

// ============================================================
// POST /api/tickets — Créer un ticket
// ============================================================

/**
 * Crée un nouveau ticket.
 * @param donnees titre et description optionnelle
 * @returns le ticket créé ou ErreurAPI
 */
export async function creerTicket(donnees: TicketCreation): Promise<Ticket | ErreurAPI> {
  try {
    const reponse = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donnees),
    });
    verifierReponse(reponse);
    return await reponse.json() as Ticket;
  } catch (erreur) {
    return normaliserErreur(erreur);
  }
}

// ============================================================
// PATCH /api/tickets/{id}/fermer — Fermer un ticket
// ============================================================

/**
 * Ferme un ticket existant.
 * @param id identifiant du ticket à fermer
 * @returns le ticket mis à jour ou ErreurAPI
 */
export async function fermerTicket(id: number): Promise<Ticket | ErreurAPI> {
  try {
    const reponse = await fetch(`${BASE_URL}/${id}/fermer`, {
      method: 'PATCH',
    });
    verifierReponse(reponse);
    return await reponse.json() as Ticket;
  } catch (erreur) {
    return normaliserErreur(erreur);
  }
}

// ============================================================
// Utilitaire : distinguer ErreurAPI d'un résultat valide
// ============================================================

/**
 * Type guard : retourne true si la valeur est une ErreurAPI.
 * Permet aux composants de faire : if (estUneErreur(resultat)) { ... }
 */
export function estUneErreur(valeur: unknown): valeur is ErreurAPI {
  return (
    typeof valeur === 'object' &&
    valeur !== null &&
    'injoignable' in valeur &&
    'status' in valeur &&
    'message' in valeur
  );
}
