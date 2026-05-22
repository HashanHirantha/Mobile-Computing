import { useAuthContext } from '../contexts/AuthContext';

/**
 * Hook to access auth state and methods.
 * Must be used within <AuthProvider>.
 */
export function useAuth() {
  return useAuthContext();
}
