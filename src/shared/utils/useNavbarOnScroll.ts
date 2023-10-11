import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const useNavbarOnScroll = () => {
  const offset = 80;
  const { pathname } = useRouter();
  const [isBrowser, setIsBrowser] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [transparent, setTransparent] = useState(
    pathname === "/" ? true : false
  );

  useEffect(() => {
    if (isBrowser) {
      window.addEventListener("scroll", () => setLastScrollY(window.scrollY));
      return () => {
        window.removeEventListener("scroll", () =>
          setLastScrollY(window.scrollY)
        );
      };
    }
  }, [isBrowser, lastScrollY]);

  useEffect(() => {
    setIsBrowser(true);
    if (isBrowser && pathname === "/") {
      if (window.scrollY > offset) setTransparent(false);
      else setTransparent(true);
    }
  }, [isBrowser, pathname]);

  return transparent;
};

export default useNavbarOnScroll;
