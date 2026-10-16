/**
 * Couche : Types / Modèles.
 * Responsabilité : définir les structures de données échangées avec le backend.
 *
 * Ces types correspondent exactement aux DTO Java du backend.
 * Aucun composant ne manipule de données brutes — tout passe par ces interfaces.
 */

/** Les trois statuts possibles d'un ticket (identiques à l'enum Java). */
export type Statut = 'OUVERT' | 'EN_COURS' | 'FERME';

/**
 * Représente un ticket tel que renvoyé par le backend (TicketReponseDTO).
 * L'id est nécessaire pour l'action de fermeture.
 */
export interface Ticket {
  id: number;
  titre: string;
  description: string | null;
  statut: Statut;
  dateCreation: string; // format ISO-8601 : "2026-10-16T14:47:12"
}

/**
 * Données envoyées au backend pour créer un ticket (TicketCreationDTO).
 * Pas d'id, pas de statut, pas de dateCreation — le serveur les détermine.
 */
export interface TicketCreation {
  titre: string;
  description?: string;
}

/**
 * Format JSON d'erreur renvoyé par le backend (ErreurDTO).
 * Utilisé pour afficher les messages d'erreur précis (400, 404, 409).
 */
export interface ErreurBackend {
  status: number;
  erreur: string;
  message: string;
  details?: string[];
}

/**
 * Erreur normalisée produite par le service API frontend.
 * Unifie les erreurs réseau (serveur injoignable) et les erreurs backend (400/409).
 */
export interface ErreurAPI {
  /** true = serveur injoignable (fetch échoue), false = réponse d'erreur du backend */
  injoignable: boolean;
  /** Code HTTP (0 si injoignable) */
  status: number;
  /** Message lisible à afficher à l'utilisateur */
  message: string;
  /** Détails de validation (uniquement pour les 400) */
  details?: string[];
  /** Code court de l'erreur backend (ex. "CONFLIT_RG02") */
  erreur?: string;
}
