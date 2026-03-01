import { useRef, useCallback } from "react";
import { updateUserConfig } from "@/lib/api";

export function useDebouncedSave(delayMs = 600) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    (partial: Record<string, unknown>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        updateUserConfig(partial).catch((err) => {
          console.error("Auto-save failed:", err);
        });
      }, delayMs);
    },
    [delayMs]
  );

  return save;
}