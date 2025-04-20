import React from "react";

// ** MUI Imports
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// ** Hooks Imports
import { useAuth } from "src/hooks/useAuth";

// ** Next Imports
import Image from "next/image";
import IconifyIcon from "src/components/Icon";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { ROUTE_CONFIG } from "src/configs/route";
import { ToFullName } from "src/utils";
import { Typography } from "@mui/material";


type TProps = {
}

const UserDropdown = (props: TProps) => {
    // ** Translation
    const { t, i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const {user, logout} = useAuth();

    const open = Boolean(anchorEl);

    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigateMyProfile = () => {
        router.push(ROUTE_CONFIG.MY_PROFILE);
        handleClose();
    }
    const handleNavigateChangePassword = () => {
        router.push(ROUTE_CONFIG.CHANGE_PASSWORD);
        handleClose();
    }

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title={t("Account")}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>
                            {user?.avatar ? (
                                <Image src={user?.avatar || ""} alt="User Avatar" width={32} height={32} style={{ borderRadius: '50%' }} />
                            ): (
                                <IconifyIcon icon="eva:person-fill" width={24} height={24} />
                            )}
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: "space-evenly" , alignItems: 'center', textAlign: 'center' }}>
                    {user?.avatar ? (
                        <Image src={user?.avatar || ""} alt="User Avatar" width={32} height={32} style={{ borderRadius: '50%' }} /> 
                    ): (
                        <IconifyIcon icon="eva:person-fill" width={24} height={24} />
                    )}
                    <Typography component={"span"}>
                        {ToFullName(user?.lastName || "", user?.middleName || "", user?.firstName || "", i18n.language)}
                    </Typography>
                    {user?.role?.name}
                </Box>
                <MenuItem onClick={handleNavigateMyProfile}>
                    <Avatar>
                        <IconifyIcon icon="eva:person-fill" width={24} height={24} />
                    </Avatar>
                    {t("my_profile")}
                </MenuItem>
                <MenuItem onClick={handleNavigateChangePassword}>
                    <Avatar sx={{backgroundColor: "transparent"}}>
                        <IconifyIcon icon="eva:edit-2-outline" fontSize="2rem" />
                    </Avatar>
                    {t("change_password")}
                </MenuItem>
                <Divider />
                <MenuItem onClick={logout}>
                    <Avatar sx={{backgroundColor: "transparent"}}>
                        <IconifyIcon icon="eva:log-out-outline" fontSize="2rem" />
                    </Avatar>
                    {t("logout")}
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}

export default UserDropdown