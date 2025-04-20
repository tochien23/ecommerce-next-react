import * as React from 'react';

// ** Next Imports
import { NextPage } from 'next';

// ** MUI Imports
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';

// ** Layout Import
import IconifyIcon from 'src/components/Icon';

// ** Configs
import { VerticalItems } from 'src/configs/layout';


type TProps = {
    open: boolean
};

type TListItems = {
    level: number,
    openItems: { [key: string]: boolean },
    items: any,
    setOpenItems: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
    disabled: boolean
}

const RecursiveListItems: NextPage<TListItems> = ({items, level, openItems, setOpenItems, disabled}) => {

    const handleClick = (title: string) => {
        if (!disabled) {
            setOpenItems(prev => ({
                ...prev,
                [title]: !prev[title]
            }));
        }
    };
    
    return (
        <>
            {items?.map((item: any) => {
                return (
                    <React.Fragment key={item?.title}>
                        <ListItemButton
                            sx={{
                                padding: `8px 10px 8px ${level * 10}px`
                            }}
                            onClick={() => {
                                if (item?.childrens) {
                                    handleClick(item?.title)
                                }
                            }}
                        >
                            <ListItemIcon>
                                <IconifyIcon icon={item?.icon} />
                            </ListItemIcon>
                            {!disabled && <ListItemText primary={item?.title} />}
                            {item?.childrens && item?.childrens?.length > 0 ? openItems[item.title] ? <IconifyIcon icon="eva:chevron-up-fill" /> : <IconifyIcon icon="eva:chevron-down-fill" /> : null}
                        </ListItemButton>
                        {item?.childrens && item?.childrens?.length > 0 && (
                            <>
                                <Collapse in={openItems[item.title]} timeout="auto" unmountOnExit>
                                    <RecursiveListItems items={item?.childrens} level={level + 1} openItems={openItems} setOpenItems={setOpenItems} disabled={disabled} />
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
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav"        >
            <RecursiveListItems disabled={!open} items={VerticalItems} level={1} openItems={openItems} setOpenItems={setOpenItems} />
        </List>
    );
}

export default ListVerticalLayout