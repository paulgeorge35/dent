import { useEffect, useRef, useState } from "react";

export const useResizeObserver = () => {
  const [width, setWidth] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setWidth(entry.contentRect.width);
        }
      }
    });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref]);

  return [ref, width];
};
