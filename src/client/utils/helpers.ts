export const titleCase = (str: string) =>
  str !== undefined && str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());
