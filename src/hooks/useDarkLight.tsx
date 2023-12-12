import { useEffect } from "react";
import { useTheme } from "next-themes";

const useDarkLight = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", theme === "dark");
  }, [theme]);
  return { theme };
};

export default useDarkLight;
