/**
 * Composant : ModaleConfirmation
 * Couche : Présentation.
 *
 * Responsabilité : demander une confirmation avant de fermer un ticket.
 * Composant maison (pas window.confirm, pas alert) — conforme au sujet.
 *
 * Affiche également l'erreur 409 si la fermeture échoue (RG-03 ou autre).
 */

interface Props {
  titre: string;
  message: string;
  erreur: string | null;
  onConfirmer: () => void;
  onAnnuler: () => void;
}

export default function ModaleConfirmation({
  titre,
  message,
  erreur,
  onConfirmer,
  onAnnuler,
}: Props) {
  return (
    <>
      {/* Fond semi-transparent */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onAnnuler}
      />

      {/* Boîte de dialogue */}
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modale-titre"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">
            {/* En-tête */}
            <div className="modal-header">
              <h5 className="modal-title" id="modale-titre">{titre}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onAnnuler}
                aria-label="Annuler"
              />
            </div>

            {/* Corps */}
            <div className="modal-body">
              <p>{message}</p>

              {/* Erreur 409 (RG-03 : ticket déjà fermé) */}
              {erreur && (
                <div className="alert alert-danger py-2 mb-0" role="alert">
                  {erreur}
                </div>
              )}
            </div>

            {/* Pied */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onAnnuler}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirmer}
              >
                Confirmer la fermeture
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
