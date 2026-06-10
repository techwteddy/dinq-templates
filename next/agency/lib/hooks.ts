import { useEffect, useRef, useCallback } from "react";
import { useActiveSectionContext } from "@/context/active-section-context";
import { useInView, IntersectionOptions } from "react-intersection-observer";
import type { SectionName } from "@/lib/types";

export function useSectionInView(sectionName: SectionName, threshold = 0.3) {
  const { setActiveSection, setSectionRef, timeOfLastClick } = useActiveSectionContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const options: IntersectionOptions = {
    threshold,
    triggerOnce: false,
    rootMargin: "-100px 0px -50% 0px",
  };

  const [inViewRef, inView] = useInView(options);

  const combinedRef = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        inViewRef(node);
        setSectionRef(sectionName, { current: node });
      }
    },
    [inViewRef, sectionName, setSectionRef]
  );

  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > 1000) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setActiveSection(sectionName);
      }, 150);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inView, setActiveSection, sectionName, timeOfLastClick]);

  return combinedRef;
}
