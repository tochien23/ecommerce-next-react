import React from "react";

// ** MUI Imports
import IconButton from '@mui/material/IconButton';

import IconifyIcon from "src/components/Icon";

// ** Hooks Imports

import { useSettings } from "src/hooks/useSettings";
import { Mode } from "src/types/layouts";


type TProps = {
}

const ModeToggle = (props: TProps) => {
    const { settings, saveSettings } = useSettings();
    
    const handleModeChange = (mode: Mode) => {
        saveSettings({...settings, mode})
    }
    
    const handleToggleMode = () => {
        if (settings.mode === "dark") {
            handleModeChange("light")
        } else {
            handleModeChange("dark")
        }
    }

    return (
        <IconButton color="inherit" onClick={handleToggleMode}>
            <IconifyIcon icon={settings.mode === "light" ? "material-symbols:dark-mode-outline" : "material-symbols:light-mode-outline"} />
        </IconButton>
    )
}

export default ModeToggle