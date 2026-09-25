import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export default function SmoothScroll() {
  const { pathname } = useLocation();
  const lenis = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -80 } });
    lenis.current = instance;
    return () => {
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenis.current) lenis.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
