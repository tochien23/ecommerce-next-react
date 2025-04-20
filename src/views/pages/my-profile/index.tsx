// import Next
import { NextPage } from 'next';

// React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import {Avatar, Box, Button, FormHelperText, Grid, IconButton, InputLabel, useTheme } from '@mui/material';

// Form
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { EMAIL_REG } from 'src/configs/regex';

// ** Translation Imports
import {t} from "i18next";
import { useTranslation } from 'react-i18next';

// ** Components Imports
import WrapperFileUpload from 'src/components/wrapper-file-upload';
import CustomTextField from 'src/components/text-field';
import IconifyIcon from 'src/components/Icon';

// ** Services
import { getAuthMe } from 'src/services/auth';

// ** Types Imports
import { convertBase64ToFile, separationFullName, ToFullName } from 'src/utils';

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/stores';
import { resetInitialState } from 'src/stores/apps/auth';
import { updateAuthMeAsync } from 'src/stores/apps/auth/actions';

// ** Other Imports
import toast from 'react-hot-toast';
import Spinner from 'src/components/spinner';
import CustomSelect from 'src/components/custom-select';

type TProps = {

}
type TDefaultValue = {
    email: string;
    address: string;
    city: string;
    phone: string;
    role: string;
    fullName: string;
}

const MyProfilePage: NextPage<TProps> = () => {
    // ** States
    const [loading, setLoading] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<string>("");
    const [roleId, setRoleId] = useState<string>("");

    // ** Redux
    const dispatch: AppDispatch = useDispatch();
    const {isLoading, isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe} = useSelector((state: RootState) => state.auth);

    // ** Translation
    const { i18n } = useTranslation();

    // Theme
    const theme = useTheme();

    const schema = yup.object().shape({
        email: yup.string().required("The field is required").email("Email is not valid").matches(EMAIL_REG, "Email is not valid"),
        fullName: yup.string().required("The field is required"),
        phone: yup.string().required("The field is required").min(8, "Phone number must be at least 8 characters").max(10, "Phone number must be at most 10 characters"),
        role: yup.string().required("The field is required"),
        city: yup.string().notRequired(),
        address: yup.string().notRequired(),
    })

    const defaultValues: TDefaultValue = {
        email: "",
        address: "",
        city: "",
        phone: "",
        role: "",
        fullName: ""
    }

    const { handleSubmit, control, reset, formState: {errors} } = useForm({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    const fetchGetAuthMe = async () => { 
        await getAuthMe()
        .then(async response => {
            setLoading(false)
            const data = response?.data;
            if (data) { 
                setRoleId(data?.role?._id)
                setAvatar(data?.avatar || "");
                reset({
                    email: data?.email,
                    address: data?.address,
                    city: data?.city,
                    phone: data?.phone,
                    role: data?.role.name,
                    fullName: ToFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language),
                })
            }
        })
        .catch(() => {
            setLoading(false)
        })
    }


    useEffect(() => {
        fetchGetAuthMe()
    }, [i18n.language]);

    useEffect(() => { 
        if(messageUpdateMe) {
            if (isErrorUpdateMe) {
                toast.error(messageUpdateMe)
            } else if (isSuccessUpdateMe) {
                toast.success(messageUpdateMe)
                fetchGetAuthMe()
            }
            dispatch(resetInitialState())
        }
    }, [isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe])

    const onSubmit = (data: any) => { 
        const { firstName, lastName, middleName } = separationFullName(data.fullName, i18n.language);
        dispatch(updateAuthMeAsync({
            email: data.email,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            address: data.address,
            phone: data.phone,
            role: roleId,
            avatar: avatar || undefined
        }))
    }

    const handleUploadAvatar = async (file: File) => {
        const base64 = await convertBase64ToFile(file);
        setAvatar(base64 as string);
    }

    return (
        <>
            {loading || (isLoading && <Spinner />)}
            <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
                <Grid container>
                    <Grid container item md={6} xs={12} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: "15px", py: 5, px: 4 }}>
                        <Box sx={{ height: "100%", width: "100%" }}>
                            <Grid container spacing={4}>
                                <Grid item md={12} xs={12} >
                                    <Box sx={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center" }}>
                                        {avatar && (
                                            <IconButton edge="start" color='inherit' sx={{ position: "absolute", top: 0, right: 0, color: theme.palette.error.main }} onClick={() => setAvatar("")}>
                                                <IconifyIcon icon="eva:trash-2-outline" />
                                            </IconButton>
                                        )}
                                        {avatar ? (
                                            <Avatar src={avatar} sx={{ width: 100, height: 100 }} />
                                        ) : (
                                            <Avatar sx={{ width: 100, height: 100 }}>
                                                <IconifyIcon icon="eva:person-fill" width={50} height={50} />
                                            </Avatar>
                                        )}
                                        <WrapperFileUpload uploadFunc={handleUploadAvatar} objectAcceptFile={{
                                            "image/jpeg": [".jpg", ".jpeg"],
                                            "image/png": [".png"],
                                        }}>
                                            <Button variant="outlined" sx={{ width: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <IconifyIcon icon="ph:camera-thin" />
                                                {avatar ? t("change_avt") : t("upload_avt")}
                                            </Button>
                                        </WrapperFileUpload>
                                    </Box>
                                </Grid>
                                <Grid item md={6} xs={12} >
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <CustomTextField
                                                required
                                                fullWidth
                                                disabled
                                                label="Email"
                                                placeholder={t("enter_your_email")}
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
                                </Grid>
                                <Grid item md={6} xs={12} >
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Box>
                                                <InputLabel sx={{ fontSize: "13px", display: "inline-block", mb: 1, color: errors?.role ? theme.palette.error.main : `rgba(${theme.palette.customColors.main}, 0.42)` }}>
                                                    {t("role")}
                                                </InputLabel>
                                                <CustomSelect
                                                    fullWidth
                                                    options={[]}
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                    error={Boolean(errors?.role)}
                                                    value={value}
                                                    placeholder={t("enter_your_role")}
                                                />
                                                {!errors?.role?.message && (
                                                    <FormHelperText sx={{ color: !errors?.role ? theme.palette.error.main : `rgba(${theme.palette.customColors.main}, 0.42)`, fontSize: "12px", mt: 1 }}>
                                                        {errors?.role?.message}
                                                    </FormHelperText>
                                                )}
                                            </Box>
                                        )}
                                        name="role"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid container item md={6} xs={12} mt={{ md: 0, xs: 5 }}>
                        <Box sx={{ height: "100%", width: "100%", backgroundColor: theme.palette.background.paper, borderRadius: "15px", py: 5, px: 4 }} marginLeft={{ md: 5, xs: 0 }}>
                            <Grid container spacing={4}>
                                <Grid item md={6} xs={12} >
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <CustomTextField
                                                required
                                                fullWidth
                                                label={t("full_name")}
                                                placeholder={t("enter_your_fullname")}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                error={Boolean(errors?.fullName)}
                                                helperText={errors?.fullName?.message}
                                            />
                                        )}
                                        name="fullName"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12} >
                                    <Controller
                                        name="address"
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <CustomTextField
                                                required
                                                fullWidth
                                                label={t("address")}
                                                placeholder={t("enter_your_address")}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12} >
                                    <Controller
                                        name="city"
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Box>
                                                <InputLabel sx={{ fontSize: "13px", display: "inline-block", mb: 1, color: errors?.city ? theme.palette.error.main : `rgba(${theme.palette.customColors.main}, 0.42)` }}>
                                                    {t("city")}
                                                </InputLabel>
                                                <CustomSelect
                                                    fullWidth
                                                    options={[]}
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                    error={Boolean(errors?.city)}
                                                    value={value}
                                                    placeholder={t("enter_your_city")}
                                                />
                                                {!errors?.city?.message && (
                                                    <FormHelperText sx={{ color: !errors?.city ? theme.palette.error.main : `rgba(${theme.palette.customColors.main}, 0.42)`, fontSize: "12px", mt: 1 }}>
                                                        {errors?.city?.message}
                                                    </FormHelperText>
                                                )}
                                            </Box>
                                        )}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12} >
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <CustomTextField
                                                required
                                                fullWidth
                                                label={t("phone")}
                                                placeholder={t("enter_your_phone")}
                                                onChange={(e) => {
                                                    const numValue = e.target.value.replace(/\D/g, "");
                                                    onChange(numValue);
                                                }}
                                                inputProps={{
                                                    inputMode: "numeric",
                                                    pattern: "[0-9]*",
                                                    minLength: 8,
                                                }}
                                                onBlur={onBlur}
                                                value={value}
                                                error={Boolean(errors?.phone)}
                                                helperText={errors?.phone?.message}
                                            />
                                        )}
                                        name="phone"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                        {t("update")}
                    </Button>
                </Box>
            </form>
        </>
    )
}

export default MyProfilePage;