export const sanitizeId = (id: string) => (id ? id.replace(/\//g, '_') : '');
