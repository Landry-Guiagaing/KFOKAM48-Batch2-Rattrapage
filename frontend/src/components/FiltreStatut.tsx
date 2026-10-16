/**
 * Composant : FiltreStatut
 * Couche : Présentation.
 * Responsabilité : boutons radio pour filtrer la liste par statut.
 */

import type { Statut } from '../types/ticket';

interface Props {
  valeur: Statut | undefined;
  onChange: (statut: Statut | undefined) => void;
}

const OPTIONS: { label: string; valeur: Statut | undefined }[] = [
  { label: 'Tous', valeur: undefined },
  { label: 'Ouvert', valeur: 'OUVERT' },
  { label: 'En cours', valeur: 'EN_COURS' },
  { label: 'Fermé', valeur: 'FERME' },
];

export default function FiltreStatut({ valeur, onChange }: Props) {
  return (
    <div className="d-flex gap-2 flex-wrap mb-3">
      <span className="fw-semibold me-1 align-self-center">Filtrer :</span>
      {OPTIONS.map((opt) => (
        <button
          key={opt.label}
          className={`btn btn-sm ${valeur === opt.valeur ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onChange(opt.valeur)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
