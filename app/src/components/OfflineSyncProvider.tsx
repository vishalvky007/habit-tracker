import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../services/supabase';

// Simple operation type for queue
type QueuedOperation = {
  table: string;
  method: 'insert' | 'update' | 'delete';
  payload: any;
};

type OfflineSyncContextType = {
  enqueue: (op: QueuedOperation) => void;
};

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

export const useOfflineSync = () => {
  const ctx = useContext(OfflineSyncContext);
  if (!ctx) throw new Error('useOfflineSync must be used within OfflineSyncProvider');
  return ctx;
};

export const OfflineSyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queueRef = useRef<QueuedOperation[]>([]);

  // Load persisted queue on mount
  useEffect(() => {
    const loadQueue = async () => {
      const stored = await AsyncStorage.getItem('offlineQueue');
      if (stored) queueRef.current = JSON.parse(stored);
    };
    loadQueue();
  }, []);

  // Persist queue whenever it changes
  const persistQueue = async () => {
    await AsyncStorage.setItem('offlineQueue', JSON.stringify(queueRef.current));
  };

  const enqueue = (op: QueuedOperation) => {
    queueRef.current.push(op);
    persistQueue();
  };

  // Process queue when back online
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        // Process all queued operations sequentially
        const process = async () => {
          const ops = [...queueRef.current];
          queueRef.current = [];
          await persistQueue();
          for (const op of ops) {
            try {
              // Generic handling based on method
              if (op.method === 'insert') {
                await supabase.from(op.table).insert(op.payload);
              } else if (op.method === 'update') {
                const { id, ...rest } = op.payload;
                await supabase.from(op.table).update(rest).eq('id', id);
              } else if (op.method === 'delete') {
                await supabase.from(op.table).delete().eq('id', op.payload.id);
              }
            } catch (e) {
              // Re‑queue on failure
              queueRef.current.push(op);
            }
          }
          await persistQueue();
        };
        process();
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <OfflineSyncContext.Provider value={{ enqueue }}>
      {children}
    </OfflineSyncContext.Provider>
  );
};
