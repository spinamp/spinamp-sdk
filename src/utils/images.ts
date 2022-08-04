export const getResizedArtworkUrl = (originalUrl: string, width: number) =>
  `${originalUrl}?img-width=${width}&img-fit=cover`;
