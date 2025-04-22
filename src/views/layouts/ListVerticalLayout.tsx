import * as React from 'react';

// ** Next Imports
import { NextPage } from 'next';

// ** MUI Imports
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListItemTextProps, styled, Tooltip, useTheme} from '@mui/material';

// ** Layout Import
import IconifyIcon from 'src/components/Icon';

// ** Configs
import { VerticalItems } from 'src/configs/layout';
import { useRouter } from 'next/router';
import { hexToRGBA } from 'src/utils/hex-to-rgba';


type TProps = {
    open: boolean
};

type TListItems = {
    level: number,
    openItems: { [key: string]: boolean },
    items: any,
    setOpenItems: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
    disabled: boolean,
    setActivePath: React.Dispatch<React.SetStateAction<null | string>>
    activePath: null | string
}

interface TListItemText extends ListItemTextProps { 
    active: boolean
}

const StyledListItemText = styled(ListItemText)<TListItemText>(({ theme, active }) => ({
    '.MuiTypography-root.MuiTypography-body1.MuiListItemText-primary': {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        display: "block",
        width: '100%',
        color: active ? `${theme.palette.primary.main} !important` : `rgba(${theme.palette.customColors.main}, 0.78)`,
        fontWeight: active ? 600 : 400,
    }
}));

const RecursiveListItems: NextPage<TListItems> = ({items, level, openItems, setOpenItems, disabled, setActivePath, activePath}) => {

    // ** Theme
    const theme = useTheme();

    // ** Router
    const router = useRouter();


    const handleClick = (title: string) => {
        if (!disabled) {
            setOpenItems(prev => ({
                [title]: !prev[title]
            }));
        }
    };

    const handleSelectItem = (path: string) => {
        setActivePath(path);
        if (path) {
            router.push(path);
        }
    };
    
    return (
        <>
            {items?.map((item: any) => {
                return (
                    <React.Fragment key={item?.title}>
                        <ListItemButton
                            sx={{
                                padding: `8px 10px 8px ${level * 10}px`,
                                margin: "1px 0",
                                backgroundColor: ((activePath && item.path === activePath) || !!openItems[item.title])
                                    ? `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`
                                    : theme.palette.background.paper,
                            }}
                            
                            onClick={() => {
                                if (item?.childrens) {
                                    handleClick(item?.title)
                                }
                                handleSelectItem(item.path)
                            }}
                        >
                            <ListItemIcon>
                                <Box sx={{
                                    borderRadius: "8px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    display: "flex",
                                    width: "30px",
                                    height: "30px",
                                    backgroundColor: ((activePath && item.path === activePath) || !!openItems[item.title]) ? theme.palette.primary.main : theme.palette.background.paper,
                                }}>
                                    <IconifyIcon style={{
                                        color: ((activePath && item?.path === activePath) || !!openItems[item.title]) ? `${theme.palette.customColors.lightPaperBg} !important` : theme.palette.customColors.main,
                                    }} icon={item?.icon} />
                                </Box>
                            </ListItemIcon>
                            {!disabled &&
                                <Tooltip title={item?.title}>
                                    <StyledListItemText
                                        active={Boolean((activePath && item?.path === activePath) || !!openItems[item.title])}
                                        primary={item?.title}
                                    />
                                </Tooltip>
                            }
                            {item?.childrens && item?.childrens?.length > 0 && (
                                <>
                                    {openItems[item.title] ? (
                                        <IconifyIcon
                                            icon="ic:twotone-expand-less"
                                            style={{
                                                transform: "rotate(180deg)",
                                                color: !!openItems[item.title]
                                                    ? theme.palette.primary.main
                                                    : `rgba(${theme.palette.customColors.main}, 0.78)`,
                                            }}
                                        />
                                    ) : (
                                        <IconifyIcon icon="ic:twotone-expand-less" />
                                    )}
                                </>
                            )}
                        </ListItemButton>
                        {item?.childrens && item?.childrens?.length > 0 && (
                            <>
                                <Collapse in={openItems[item.title]} timeout="auto" unmountOnExit>
                                    <RecursiveListItems items={item?.childrens} level={level + 1} openItems={openItems} setOpenItems={setOpenItems} disabled={disabled}
                                        setActivePath={setActivePath}
                                        activePath={activePath}
                                    />
                                </Collapse>
                            </>
                        )}
                    </React.Fragment>
                )
            })}
        </>
    )
}

const ListVerticalLayout: NextPage<TProps> = ({open}) => {
    const [openItems, setOpenItems] = React.useState<{ [key: string]: boolean }>({});
    const [activePath, setActivePath] = React.useState<null | string>('');
    
    React.useEffect(() => {
        if (!open) {
            handleToggleAll();
        }
    }, [open]);

    const handleToggleAll = () => {
        setOpenItems({})
    }

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }} component="nav"      >
            <RecursiveListItems
                disabled={!open}
                items={VerticalItems}
                level={1}
                openItems={openItems}
                setOpenItems={setOpenItems}
                setActivePath={setActivePath}
                activePath={activePath}
            />
        </List>
    );
}

export default ListVerticalLayout