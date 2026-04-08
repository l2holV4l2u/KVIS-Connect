"use client";
import * as React from "react";
import type { ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 4000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

let count = 0;
function genId() { return `toast-${++count}`; }

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "DISMISS_TOAST"; toastId: string }
  | { type: "REMOVE_TOAST"; toastId: string };

interface State { toasts: ToasterToast[] }

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((l) => l(memoryState));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TOAST":
      return { toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "DISMISS_TOAST":
      setTimeout(() => dispatch({ type: "REMOVE_TOAST", toastId: action.toastId }), TOAST_REMOVE_DELAY);
      return { toasts: state.toasts.map((t) => t.id === action.toastId ? { ...t, open: false } : t) };
    case "REMOVE_TOAST":
      return { toasts: state.toasts.filter((t) => t.id !== action.toastId) };
  }
}

function toast(props: Omit<ToasterToast, "id">) {
  const id = genId();
  dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true, onOpenChange: (open) => { if (!open) dispatch({ type: "DISMISS_TOAST", toastId: id }); } } });
  return id;
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => { const i = listeners.indexOf(setState); if (i > -1) listeners.splice(i, 1); };
  }, []);
  return { ...state, toast, dismiss: (id: string) => dispatch({ type: "DISMISS_TOAST", toastId: id }) };
}

export { useToast, toast };
