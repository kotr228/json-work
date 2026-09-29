'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

type NotificationType = 'success' | 'error';
type Notify = (message: string, type?: NotificationType) => void;

const NotificationContext = createContext<Notify>(() => {});

export function useNotify(): Notify {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ message: string; type: NotificationType; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback<Notify>((message, type = 'success') => {
    clearTimeout(timer.current);
    setState({ message, type, visible: true });
    timer.current = setTimeout(() => setState((s) => ({ ...s, visible: false })), 3000);
  }, []);

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div role="status" aria-live="polite" className={`notification ${state.type}${state.visible ? ' show' : ''}`}>
        {state.message}
      </div>
    </NotificationContext.Provider>
  );
}
