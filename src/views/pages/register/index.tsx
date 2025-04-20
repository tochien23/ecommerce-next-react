// import Next
import { NextPage } from 'next';

// React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import {Box, Button,  CssBaseline,  Grid, IconButton, InputAdornment, Typography, useTheme } from '@mui/material';

// Form
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex';

// Components
import Icon from 'src/components/Icon';
import Image from 'next/image';

// Image
import RegisterDark from "/public/images/register-dark.png";
import RegisterLight from "/public/images/register-light.png";
import FacebookSvg from '/public/svgs/facebook.svg';
import GoogleSvg from '/public/svgs/google.svg';


import CustomTextField from 'src/components/text-field';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { registerAuthAsync } from 'src/stores/apps/auth/actions';
import { AppDispatch, RootState } from 'src/stores';
import toast from 'react-hot-toast';
import FallbackSpinner from 'src/components/fall-back';
import { resetInitialState } from 'src/stores/apps/auth';
import { useRouter } from 'next/router';
import { ROUTE_CONFIG } from 'src/configs/route';

type TProps = {

}
type TDefaultValue = {
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage: NextPage<TProps> = () => {
    // State
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // ** Router
    const router = useRouter();

    // ** Redux
    const dispatch: AppDispatch = useDispatch();
    const { isLoading, isError, isSuccess, message } = useSelector((state: RootState) => state.auth);

    // Theme
    const theme = useTheme();

    const schema = yup.object().shape({
        email: yup.string().required("The field is required").email("Email is not valid").matches(EMAIL_REG, "Email is not valid"),
        password: yup.string().required("The field is required").matches(PASSWORD_REG, "Password is not valid").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
        confirmPassword: yup.string().required("The field is required").matches(PASSWORD_REG, "Password is not valid").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters").oneOf([yup.ref('password'), ""], "Passwords must match")
    })

    const defaultValues: TDefaultValue = {
        email: '',
        password: '',
        confirmPassword: ''
    }

    const { handleSubmit, control, formState: {errors} } = useForm({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    const onSubmit = (data: { email: string, password: string }) => { 
        if (!Object.keys(errors).length) {
            dispatch(registerAuthAsync({ email: data.email, password: data.password }));
        }
    }

    useEffect(() => {
        if (message) {
            if (isError) {
                toast.error(message)
            } else if (isSuccess) {
                toast.success(message)
                router.push(ROUTE_CONFIG.LOGIN)
            }
            dispatch(resetInitialState())
        }
    }, [isError, isSuccess, message]);

    return (
        <>
            {isLoading && <FallbackSpinner />}
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
                            Register
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
                                            placeholder='Nhập mật khẩu của bạn'
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
                            <Box sx={{ mt: 2, width: "300px" }}>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <CustomTextField
                                            required
                                            fullWidth
                                            label="Confirm Password"
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            placeholder='Nhập lại mật khẩu của bạn'
                                            error={Boolean(errors?.confirmPassword)}
                                            helperText={errors?.confirmPassword?.message}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton edge="end" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                            {showConfirmPassword ? <Icon icon="material-symbols:visibility-off" /> : <Icon icon="material-symbols:visibility" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                    name="confirmPassword"
                                />
                            </Box>

                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                Register
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link style={{ color: theme.palette.primary.main }} href="/login">
                                        Do you have already account? Login
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
        </>
    )
}

export default RegisterPage;