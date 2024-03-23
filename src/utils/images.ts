const setTransformationsOnCloudinaryUrl = (
  url: string,
  transformationString: string,
) => {
  if (!url.includes('upload')) {
    return url;
  }

  const [prefix, suffix] = url.split('/upload/');
  return `${prefix}/upload/${transformationString}/${suffix}`;
};

export const getResizedArtworkUrl = (originalUrl: string, width: number) => {
  return setTransformationsOnCloudinaryUrl(
    originalUrl,
    `c_fill,w_${width.toString()}`,
  );
};
