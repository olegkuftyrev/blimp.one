// src/hooks/useCrossTabState.js
import { useEffect, useRef, useState } from "react";

export function useCrossTabState(key, initialValue) {
  const storageKey = `xTab:${key}`;
  const instanceId = useRef(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch { return initialValue; }
  });

  const channelRef = useRef(null);
  useEffect(() => {
    if ("BroadcastChannel" in window) {
      const ch = new BroadcastChannel("react-cross-tab-sync");
      channelRef.current = ch;
      const onMessage = (msg) => {
        if (!msg || msg.key !== storageKey || msg.sender === instanceId.current) return;
        setState(msg.value);
      };
      ch.addEventListener("message", onMessage);
      return () => { ch.removeEventListener("message", onMessage); ch.close(); };
    }
  }, [storageKey]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== storageKey || e.newValue == null) return;
      try { setState(JSON.parse(e.newValue)); } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
    if (channelRef.current) {
      channelRef.current.postMessage({ key: storageKey, value: state, sender: instanceId.current });
    }
  }, [state, storageKey]);

  return [state, setState];
}
