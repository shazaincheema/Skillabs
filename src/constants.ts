export const ADMIN_EMAILS = [
  'shazaincheemaac30@gmail.com',
  // Add more admin emails here
];

export const isSuperAdmin = (email: string | null | undefined) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
};
