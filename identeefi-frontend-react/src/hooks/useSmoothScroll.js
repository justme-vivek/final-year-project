import { useEffect } from "react";

export const useSmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis = null;
    let raf = 0;
    (async () => {
      try {
        const mod = await import("lenis");
        const Lenis = mod.default || mod.Lenis || mod;
        lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
        raf = requestAnimationFrame(loop);
      } catch (e) { /* lenis not installed, native scroll */ }
    })();
    return () => { cancelAnimationFrame(raf); try { lenis && lenis.destroy(); } catch (e) {} };
  }, []);
};

export default useSmoothScroll;
