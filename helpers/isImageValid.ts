export const isImageValid = (type: string) => {
  if (
    type === 'image/png' ||
    type === 'image/jpg' ||
    type === 'image/jpeg' ||
    type === 'image/gif' ||
    type === 'image/webp' ||
    type === 'image/svg' ||
    type === 'image/avif'
  )
    return true;
};
