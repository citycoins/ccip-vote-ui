import React from "react";
import {
  IconButton,
  Icon,
  useColorMode,
  ScaleFade,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ThemeToggle = ({ mobile }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const handleClick = () => {
    toggleColorMode();
  };

  return (
    <Tooltip
      label={colorMode === "dark" ? "Light mode" : "Dark mode"}
      aria-label="theme tooltip"
    >
      <IconButton
        isRound
        aria-label="Switch theme"
        variant={"ghost"}
        icon={
          colorMode === "dark" ? <Icon as={SunIcon} /> : <Icon as={MoonIcon} />
        }
        onClick={handleClick}
      />
    </Tooltip>
  );
};
export default ThemeToggle;
