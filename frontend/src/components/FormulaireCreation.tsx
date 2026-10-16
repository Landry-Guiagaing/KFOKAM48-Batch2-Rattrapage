/**
 * Composant : FormulaireCreation
 * Couche : Présentation + interaction.
 *
 * Responsabilité : saisir titre et description, créer le ticket via le service,
 * afficher les erreurs serveur (400/409) à côté du formulaire.
 *
 * Règles respectées :
 *   - Bouton inactif tant que le titre est vide
 *   - PAS de maxLength côté client — le refus vient du serveur (400)
 *   - Erreur 400 (titre > 100) → message à côté du champ titre
 *   - Erreur 409 (doublon RG-02) → message sous le formulaire
 *   - Succès → liste rafraîchie sans rechargement de page
 *   - Aucun alert(), aucun message générique
 */

import { useState } from 'react';
import { creerTicket, estUneErreur } from '../services/ticketService';

interface Props {
  /** Appelé après une création réussie pour rafraîchir la liste */
  onCreation: () => void;
}

export default function FormulaireCreation({ onCreation }: Props) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [envoi, setEnvoi] = useState(false);

  // Erreurs affichées à côté des champs
  const [erreurTitre, setErreurTitre] = useState<string | null>(null);
  const [erreurGlobale, setErreurGlobale] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  const reinitialiserErreurs = () => {
    setErreurTitre(null);
    setErreurGlobale(null);
    setSucces(false);
  };

  const handleSoumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    reinitialiserErreurs();
    setEnvoi(true);

    const resultat = await creerTicket({ titre, description: description || undefined });

    if (estUneErreur(resultat)) {
      if (resultat.injoignable) {
        setErreurGlobale('Le serveur est injoignable. Vérifiez que le backend est démarré.');
      } else if (resultat.status === 400) {
        // Erreurs de validation : on cherche celle sur "titre"
        const detailTitre = resultat.details?.find((d) =>
          d.toLowerCase().startsWith('titre')
        );
        if (detailTitre) {
          setErreurTitre(detailTitre.replace(/^titre\s*:\s*/i, ''));
        } else {
          setErreurGlobale(resultat.message);
        }
      } else if (resultat.status === 409) {
        // RG-02 : doublon de titre
        setErreurGlobale(resultat.message);
      } else {
        setErreurGlobale(resultat.message);
      }
    } else {
      // Succès : réinitialiser le formulaire et rafraîchir la liste
      setTitre('');
      setDescription('');
      setSucces(true);
      onCreation();
    }

    setEnvoi(false);
  };

  return (
    <form onSubmit={handleSoumettre} noValidate>
      {/* Message de succès */}
      {succes && (
        <div className="alert alert-success py-2 mb-3" role="status">
          ✅ Ticket créé avec succès !
        </div>
      )}

      {/* Erreur globale (409 doublon, serveur injoignable…) */}
      {erreurGlobale && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          {erreurGlobale}
        </div>
      )}

      {/* Champ titre */}
      <div className="mb-3">
        <label htmlFor="titre" className="form-label fw-semibold">
          Titre <span className="text-danger">*</span>
        </label>
        <input
          id="titre"
          type="text"
          className={`form-control ${erreurTitre ? 'is-invalid' : ''}`}
          value={titre}
          onChange={(e) => {
            setTitre(e.target.value);
            if (erreurTitre) setErreurTitre(null);
          }}
          placeholder="Titre du ticket"
          disabled={envoi}
          // Pas de maxLength — le refus vient du serveur
        />
        {/* Message d'erreur 400 affiché à côté du champ */}
        {erreurTitre && (
          <div className="invalid-feedback">{erreurTitre}</div>
        )}
      </div>

      {/* Champ description */}
      <div className="mb-3">
        <label htmlFor="description" className="form-label fw-semibold">
          Description <span className="text-muted fw-normal">(facultative)</span>
        </label>
        <textarea
          id="description"
          className="form-control"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du problème…"
          disabled={envoi}
        />
      </div>

      {/* Bouton — inactif si titre vide ou envoi en cours */}
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={titre.trim() === '' || envoi}
      >
        {envoi ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Création…
          </>
        ) : (
          '+ Créer le ticket'
        )}
      </button>
    </form>
  );
}
