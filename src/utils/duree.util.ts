export function convertirEnMillisecondes(duree: string): number {
  const regex = /^(\d{1,2}):(\d{2})$/;
  const match = duree.match(regex);

  if (!match) {
    throw new Error('Format invalide. Utilisez le format hh:mm.');
  }

  const heures = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  return heures * 60 * 60 * 1000 + minutes * 60 * 1000;
}
