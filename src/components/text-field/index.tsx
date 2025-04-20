import { TextFieldProps, TextField, styled } from '@mui/material'

const TextFieldStyled = styled(TextField)<TextFieldProps>(({ theme }) => {
    return {
        '& .MuiInputLabel-root': {
            transform: "none",
            lineHight: 1.2,
            position: "relative",
            marginBottom: theme.spacing(1),
            fontSize: theme.typography.body2.fontSize,
        },
        "& .MuiInputBase-root": {
            borderRadius: 8,
            backgroundColor: "transparent !important",
            border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`,
            transition: theme.transitions.create(["border-color", "box-shadow"], {
                duration: theme.transitions.duration.shorter
            }),
            "& MuiInputBase-input": {
                padding: "8px 10px",
            },
            "&.Mui-focused": {
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: `0 0 0 4px ${theme.palette.primary.main}33`,
            },
            "&.Mui-error": {
                border: `1px solid ${theme.palette.error.main}`,
                boxShadow: `0 0 0 4px ${theme.palette.error.main}33`,
            },
            
        },

        "& .MuiFormHelperText-root": {
            lightHight: 1.154,
            margin: theme.spacing(1, 0, 0),
            fontSize: theme.typography.body2.fontSize,
            color: theme.palette.text.secondary,
            "&.Mui-error": {
                color: theme.palette.error.main,
            },
        }
    }
})

const CustomTextField = (props: TextFieldProps) => {
    const { InputLabelProps, size="small", variant="filled", ...rests } = props;
    return <TextFieldStyled size={size} variant={variant} InputLabelProps={{...InputLabelProps, shrink: true}} {...rests}  />
}

export default CustomTextField
