/**
 * Composant : App (conteneur principal)
 * Couche : Conteneur (état + appels via service).
 *
 * Responsabilité :
 *   - Gérer l'état global : liste des tickets, chargement, erreurs
 *   - Appeler le service API (jamais directement fetch)
 *   - Passer les données et callbacks aux composants enfants
 *
 * Architecture respectée :
 *   App (conteneur) → ListeTickets (présentation)
 *                   → FiltreStatut  (présentation)
 *                   → FormulaireCreation (présentation)
 *                   → ModaleConfirmation (présentation)
 */

import { useCallback, useEffect, useState } from 'react';
import type { ErreurAPI, Statut, Ticket } from './types/ticket';
import { estUneErreur, fermerTicket, listerTickets } from './services/ticketService';
import ListeTickets from './components/ListeTickets';
import FiltreStatut from './components/FiltreStatut';
import FormulaireCreation from './components/FormulaireCreation';
import ModaleConfirmation from './components/ModaleConfirmation';

export default function App() {
  // ── État ──────────────────────────────────────────────────────────────────
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreurListe, setErreurListe] = useState<ErreurAPI | null>(null);
  const [filtre, setFiltre] = useState<Statut | undefined>(undefined);

  // Modale de confirmation de fermeture
  const [idAFermer, setIdAFermer] = useState<number | null>(null);
  const [erreurFermeture, setErreurFermeture] = useState<string | null>(null);

  // ── Chargement de la liste ────────────────────────────────────────────────
  const chargerTickets = useCallback(async () => {
    setChargement(true);
    setErreurListe(null);
    const resultat = await listerTickets(filtre);
    if (estUneErreur(resultat)) {
      setErreurListe(resultat);
    } else {
      setTickets(resultat);
    }
    setChargement(false);
  }, [filtre]);

  useEffect(() => {
    chargerTickets();
  }, [chargerTickets]);

  // ── Fermeture d'un ticket ─────────────────────────────────────────────────
  const demanderFermeture = (id: number) => {
    setErreurFermeture(null);
    setIdAFermer(id);
  };

  const confirmerFermeture = async () => {
    if (idAFermer === null) return;
    const resultat = await fermerTicket(idAFermer);
    if (estUneErreur(resultat)) {
      setErreurFermeture(resultat.message);
    } else {
      // Mise à jour locale sans rechargement complet
      setTickets((prev) =>
        prev.map((t) => (t.id === resultat.id ? resultat : t))
      );
      setIdAFermer(null);
    }
  };

  const annulerFermeture = () => {
    setIdAFermer(null);
    setErreurFermeture(null);
  };

  // ── Titre du ticket à fermer (pour la modale) ─────────────────────────────
  const ticketAFermer = tickets.find((t) => t.id === idAFermer);

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div className="container py-4">
      {/* En-tête */}
      <div className="mb-4">
        <h1 className="h3 fw-bold">🎫 Gestion des Tickets</h1>
        <p className="text-muted mb-0">Créez, consultez et fermez vos tickets de support.</p>
      </div>

      <div className="row g-4">
        {/* Colonne gauche : formulaire de création */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header fw-semibold">Nouveau ticket</div>
            <div className="card-body">
              <FormulaireCreation onCreation={chargerTickets} />
            </div>
          </div>
        </div>

        {/* Colonne droite : filtre + liste */}
        <div className="col-12 col-lg-8">
          <FiltreStatut valeur={filtre} onChange={setFiltre} />
          <ListeTickets
            tickets={tickets}
            chargement={chargement}
            erreur={erreurListe}
            onReessayer={chargerTickets}
            onFermer={demanderFermeture}
          />
        </div>
      </div>

      {/* Modale de confirmation de fermeture */}
      {idAFermer !== null && (
        <ModaleConfirmation
          titre="Confirmer la fermeture"
          message={
            ticketAFermer
              ? `Voulez-vous fermer le ticket « ${ticketAFermer.titre} » ?`
              : 'Voulez-vous fermer ce ticket ?'
          }
          erreur={erreurFermeture}
          onConfirmer={confirmerFermeture}
          onAnnuler={annulerFermeture}
        />
      )}
    </div>
  );
}
