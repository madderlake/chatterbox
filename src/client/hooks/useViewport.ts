import { useState, useEffect } from "react";

export const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  type ViewportStrings = {
    [key: string]: boolean;
  };
  const viewports: ViewportStrings = {
    xsmall: width <= 320,
    small: width > 320 && width < 768,
    medium: width >= 768 && width < 992,
    large: width >= 992 && width < 1200,
    xlarge: width >= 1200,
  };
  const viewport = () => {
    for (const key in viewports) {
      if (viewports[key] === true) return key;
    }
  };

  return viewport() as keyof ViewportStrings;
};
