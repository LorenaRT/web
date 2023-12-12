import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", theme === "dark");
  }, [theme]);

  return (
    <div>
      <Button
        isIconOnly
        aria-label="Toggle theme"
        variant="light"
        onClick={handleThemeToggle}
        endContent={theme === "light" ? <BsFillMoonFill /> : <BsFillSunFill />}
      ></Button>
    </div>
  );
};
