export interface CurrentUser {
  id: string | null;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  photoURL: string | null;
  phoneNumber: string | null;
  lastSignInTime?: string;
  sessionExpire?: number;
}
