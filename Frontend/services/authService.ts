import { supabase } from '../lib/supabase';

/**
 * Sign in with email and password.
 */
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Register a new user with email and password.
 */
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

/**
 * Send a password reset email.
 */
export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  return supabase.auth.signOut();
}

/**
 * Get the current session.
 */
export async function getSession() {
  return supabase.auth.getSession();
}

/**
 * Update user password (after reset flow).
 */
export async function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({ password: newPassword });
}
