import React from "react";

// ** MUI Imports
import IconButton from '@mui/material/IconButton';
import { Box, BoxProps, Menu, MenuItem, styled } from "@mui/material";

// ** Next Imports
import IconifyIcon from "src/components/Icon";
import { useTranslation } from "react-i18next";

// ** Configs
import { LANGUAGE_OPTIONS } from "src/configs/i18n";

type TProps = {
}

interface TStyledItem extends BoxProps {
    selected: boolean
}

const StyledItemLanguage = styled(Box)<TStyledItem>(({ theme, selected }) => ({
    cursor: "pointer",
    ".MuiTypography-root": {
        padding: "8px 12px",
    },
    "&:hover": {
        
    }
}))

const LanguageDropdown = (props: TProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const { i18n } = useTranslation();

    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOnChangeLang = (lang: string) => {
        i18n.changeLanguage(lang);
    }

    return (
        <>
            <IconButton color="inherit" id="language-dropdown" onClick={handleOpen}>
                <IconifyIcon icon="material-symbols-light:translate" />
            </IconButton>
            <Menu
                id="language-dropdown"
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,

                        "& .MuiAvatar-root": {
                            height: 32,
                            width: 32,
                            ml: -0.5,
                            mt: 1
                        },

                        "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "Background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0
                        }
                    }
                }}
            >
                {LANGUAGE_OPTIONS.map((lang) => (
                    <MenuItem selected={lang.value === i18n.language} key={lang.value} onClick={() => handleOnChangeLang(lang.value)}>
                        {lang.lang }
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default LanguageDropdown