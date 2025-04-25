function convertirEnMillisecondes(duree: string) {
  // Vérifier si le format est correct (hh:mm)
  const regex = /^(\d{1,2}):(\d{2})$/;
  const match = duree.match(regex);

  if (!match) {
    throw new Error("Format invalide. Utilisez le format hh:mm.");
  }

  // Extraire les heures et les minutes
  const heures = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  // Convertir en millisecondes
  const millisecondes = (heures * 60 * 60 * 1000) + (minutes * 60 * 1000);

  return millisecondes;
}

