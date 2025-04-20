import { Box, InputLabel, InputLabelProps, MenuItem, MenuItemProps, Select, SelectProps, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

type TCustomSelect = SelectProps & { 
    options: {label: string, value: string}[];
}

const StyledSelect = styled(Select)<SelectProps>(({ theme }) => ({
  "& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input": {
    padding: "10px 14px",
    height: "40px",
    boxSizing: "border-box",
    },
    "legend": {
        display: "none",
    }
}));

const StyledMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  "&.Mui-selected:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const CustomPlaceholder = styled(InputLabel)<InputLabelProps>(({ theme }) => ({
    position: "absolute",
    top: "8px",
    left: "10px"

}));

const CustomSelect = (props: TCustomSelect) => {
    const { value, label, onChange, options, placeholder, fullWidth, ...rest } = props;

    // ** Translation 
    const { t } = useTranslation();

    return (
        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
            {((Array.isArray(value) && !value.length) || !value) && (
                <CustomPlaceholder>
                    {placeholder}
                </CustomPlaceholder>
            )}
            <StyledSelect
                fullWidth={fullWidth}
                labelId=""
                value={value}
                label={label}
                onChange={onChange}
                {...rest}
            >
                {options?.length > 0 ? options.map((option) => (
                    <StyledMenuItem key={option.value} value={option.value}>
                        {option.label}
                    </StyledMenuItem>
                )) : (
                    <StyledMenuItem value="">
                        {t("no_data")}
                    </StyledMenuItem>
                )}
                {/* Add a divider */}
                <StyledMenuItem disabled value="divider" style={{ display: 'none' }} />
            </StyledSelect>
        </Box>
    )
};

export default CustomSelect;