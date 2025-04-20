// import Next
import { NextPage } from 'next';

// React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import {Box, Button,  CssBaseline, IconButton, InputAdornment, Typography, useTheme } from '@mui/material';

// Form
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { PASSWORD_REG } from 'src/configs/regex';

// Components
import CustomTextField from 'src/components/text-field';
import Icon from 'src/components/Icon';
import Image from 'next/image';

// Image
import RegisterDark from "/public/images/register-dark.png";
import RegisterLight from "/public/images/register-light.png";

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/stores';


import toast from 'react-hot-toast';

import FallbackSpinner from 'src/components/fall-back';
import { resetInitialState } from 'src/stores/apps/auth';
import { useRouter } from 'next/router';

// ** Translate Imports
import { useTranslation } from 'react-i18next';
import { changePasswordMeAsync } from 'src/stores/apps/auth/actions';
import { useAuth } from 'src/hooks/useAuth';

type TProps = {

}
type TDefaultValue = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const ChangePasswordPage: NextPage<TProps> = () => {
    // State
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);

    // ** Translation
    const { t } = useTranslation();

    // ** Auth  
    const {logout} = useAuth();

    // ** Redux
    const dispatch: AppDispatch = useDispatch();
    const { isLoading, isErrorChangePassword, isSuccessChangePassword, messageChangePassword } = useSelector((state: RootState) => state.auth);

    // Theme
    const theme = useTheme();

    const schema = yup.object().shape({
        currentPassword: yup.string().required("The field is required").matches(PASSWORD_REG, "Password is not valid").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
        newPassword: yup.string().required("The field is required").matches(PASSWORD_REG, "Password is not valid").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
        confirmNewPassword: yup.string().required("The field is required").matches(PASSWORD_REG, "Password is not valid").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters").oneOf([yup.ref('newPassword'), ""], "Passwords must match")
    })

    const defaultValues: TDefaultValue = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    }

    const { handleSubmit, control, formState: {errors} } = useForm({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    const onSubmit = (data: { currentPassword: string, newPassword: string}) => { 
        if (!Object.keys(errors).length) {
            dispatch(changePasswordMeAsync({currentPassword: data.currentPassword, newPassword: data.newPassword}))
        }
    }

    useEffect(() => {
        if (messageChangePassword) {
            if (isErrorChangePassword) {
                toast.error(messageChangePassword)
            } else if (isSuccessChangePassword) {
                toast.success(messageChangePassword)
                setTimeout(() => {
                    logout()
                }, 500)
            }
            dispatch(resetInitialState())
        }
    }, [isErrorChangePassword, isSuccessChangePassword, messageChangePassword]);

    return (
        <>
            {isLoading && <FallbackSpinner />}
            <Box sx={{
                backgroundColor: theme.palette.background.paper,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
            }}>
                <Box
                    display={{
                        sm: "flex",
                        xs: "none"
                    }}
                    sx={{ justifyContent: "center", alignItems: "center", borderRadius: "20px", backgroundColor: theme.palette.customColors.bodyBg, height: "100%", minWidth: "50vw" }}>
                    <Image src={theme.palette.mode === "light" ? RegisterLight : RegisterDark} alt="Register Image" style={{
                        height: "auto",
                        width: "auto",
                    }} />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                    }}>
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            {t("change_password")}
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
                            <Box sx={{ mt: 2, width: "300px" }}>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <CustomTextField
                                            required
                                            fullWidth
                                            label={t("current_password")}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            placeholder={t("enter_your_current_password")}
                                            error={Boolean(errors?.currentPassword)}
                                            helperText={errors?.currentPassword?.message}
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton edge="end" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                                            {showCurrentPassword ? <Icon icon="material-symbols:visibility-off" /> : <Icon icon="material-symbols:visibility" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                    name="currentPassword"
                                />
                            </Box>
                            <Box sx={{ mt: 2, width: "300px" }}>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <CustomTextField
                                            required
                                            fullWidth
                                            label={t("new_password")}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            placeholder={t("enter_your_new_password")}
                                            error={Boolean(errors?.newPassword)}
                                            helperText={errors?.newPassword?.message}
                                            type={showNewPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton edge="end" onClick={() => setShowNewPassword(!showNewPassword)}>
                                                            {showNewPassword ? <Icon icon="material-symbols:visibility-off" /> : <Icon icon="material-symbols:visibility" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                    name="newPassword"
                                />
                            </Box>
                            <Box sx={{ mt: 2, width: "300px" }}>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <CustomTextField
                                            required
                                            fullWidth
                                            label={t("confirm_new_password")}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            placeholder={t("confirm_your_new_password")}
                                            error={Boolean(errors?.confirmNewPassword)}
                                            helperText={errors?.confirmNewPassword?.message}
                                            type={showConfirmNewPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton edge="end" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                                                            {showConfirmNewPassword ? <Icon icon="material-symbols:visibility-off" /> : <Icon icon="material-symbols:visibility" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                    name="confirmNewPassword"
                                />
                            </Box>

                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                {t("change_password")}
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default ChangePasswordPage;