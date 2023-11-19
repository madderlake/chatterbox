export const titleCase = (txt: string) =>
  txt !== undefined &&
  txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
