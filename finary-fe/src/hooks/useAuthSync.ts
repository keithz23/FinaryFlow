import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";

type Options = {
  runOnMount?: boolean;
  refetchOnFocus?: boolean;
  refetchIntervalMs?: number | null;
  onlyWhenAuthenticated?: boolean;
};

export function useAuthSync({
  runOnMount = true,
  refetchOnFocus = true,
  refetchIntervalMs = null,
  onlyWhenAuthenticated = false,
}: Options = {}) {
  const getMe = useAuthStore((s) => s.getMe);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const ran = useRef(false);

  const shouldRun = () => (onlyWhenAuthenticated ? isAuthenticated() : true);

  useEffect(() => {
    if (runOnMount && !ran.current && shouldRun()) {
      ran.current = true;
      getMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runOnMount]);

  useEffect(() => {
    if (!refetchOnFocus) return;
    const onFocus = () => {
      if (shouldRun()) getMe();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchOnFocus]);

  useEffect(() => {
    if (!refetchIntervalMs) return;
    const id = window.setInterval(() => {
      if (!isLoading && shouldRun()) getMe();
    }, refetchIntervalMs);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchIntervalMs, isLoading]);
}
