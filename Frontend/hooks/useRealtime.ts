import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to subscribe to Supabase Realtime Postgres changes.
 * Automatically subscribes on mount and cleans up on unmount.
 *
 * @param table - Table name to listen to
 * @param filter - Optional PostgREST filter string (e.g. "patient_id=eq.uuid")
 * @param onUpdate - Callback when a change is detected
 */
export function useRealtime(table: string, filter?: string, onUpdate?: () => void) {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const channelConfig: any = {
      event: '*',
      schema: 'public',
      table,
    };
    if (filter) {
      channelConfig.filter = filter;
    }

    channelRef.current = supabase
      .channel(`realtime-${table}-${filter ?? 'all'}`)
      .on('postgres_changes', channelConfig, (_payload: any) => {
        onUpdate?.();
      })
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [table, filter]);
}
