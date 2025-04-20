// import Next
import { NextPage } from 'next';

// React Imports
import { useState } from 'react';

// ** MUI Imports
import { Box, Button, Checkbox, CssBaseline, FormControlLabel, Grid, IconButton, InputAdornment, Typography, useTheme } from '@mui/material';

// Form
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex';

// Components
import Icon from 'src/components/Icon';
import Image from 'next/image';

// Image
import LoginDark from "/public/images/login-dark.png";
import LoginLight from "/public/images/login-light.png";
import FacebookSvg from '/public/svgs/facebook.svg';
import GoogleSvg from '/public/svgs/google.svg';


import CustomTextField from 'src/components/text-field';
import Link from 'next/link';

// ** Hooks
import { useAuth } from 'src/hooks/useAuth';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type TProps = {

}

const LoginPage: NextPage<TProps> = () => {
    // State
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isRemember, setIsRemember] = useState<boolean>(true);

    // ** Translation
    const { t } = useTranslation();

    // ** Context
    const {login} = useAuth();

    // Theme
    const theme = useTheme();

    const schema = yup.object().shape({
        email: yup.string().required("The field is required").email("Email is not valid").matches(EMAIL_REG, "Email is not valid"),
        password: yup.string().required("The field is required").matches(PASSWORD_REG, "Password is not valid").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters")
    })
    .required()
    const { handleSubmit, control, formState: {errors} } = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    const onSubmit = (data: { email: string, password: string }) => { 
        if (!Object.keys(errors).length) {
            login({ ...data, rememberMe: isRemember }, (error: any) => {
                if (error?.response?.data?.typeError === "INVALID") {
                    toast.error(t("email_or_password_wrong"));
                }
            })
        }
    }

    return (
        <Box sx={{
            height: "100vh",
            width: "100vw",
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
                <Image src={theme.palette.mode === "light" ? LoginLight : LoginDark} alt="Login Image" style={{
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
                        Sign in
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
                                        label="Email"
                                        placeholder='Nhập email của bạn'
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={Boolean(errors?.email)}
                                        helperText={errors?.email?.message}
                                        type="email"
                                    />
                                )}
                                name="email"
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
                                        label="Password"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={Boolean(errors?.password)}
                                        helperText={errors?.password?.message}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? <Icon icon="material-symbols:visibility-off" /> : <Icon icon="material-symbols:visibility" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                )}
                                name="password"
                            />
                        </Box>

                        <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="rememberMe"
                                        checked={isRemember}
                                        onChange={(e) => setIsRemember(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            />
                            <Link href="#">
                                Forgot password?
                            </Link>
                        </Box>
                        
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link style={{ color: theme.palette.primary.main }} href="/register">
                                    Don't have an account? Register
                                </Link>
                            </Grid>
                        </Grid>

                        <Typography sx={{ textAlign: "center", mt: 2, mb: 2 }}>Or</Typography>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
                            <IconButton>
                                <Image src={FacebookSvg} alt="Facebook" width={24} height={24} />
                            </IconButton>
                            <IconButton>
                                <Image src={GoogleSvg} alt="Google" width={24} height={24} />
                            </IconButton>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    )
}

export default LoginPage;