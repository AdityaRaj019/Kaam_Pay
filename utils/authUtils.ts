export const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Canada'
];

export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName.trim()} ${lastName.trim()}`;
};

export const getDisplayRole = (isClient: boolean): string => {
  return isClient ? 'hire talent' : 'find work';
};
