import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Container,
    IconButton,
    Link as MuiLink,
    Stack,
    Typography,
} from "@mui/material";
import Link from "next/link";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHoriz";
import HelpIcon from "@mui/icons-material/Help";
import HomeIcon from "@mui/icons-material/Home";
import { useState } from "react";
import { NAV_BAR_FOOTER_ITEM_ID } from "./constants";
import { setIsAboutPopupOpen } from "@/redux/slices/applicationSlice";
import { useAppDispatch } from "@/redux/store/hooks";

function ReferenceButtons() {
    return (
        <Stack justifyContent={`center`} direction="row">
            <IconButton
                size="small"
                target={`_blank`}
                href="https://t.me/algoworld_nft"
            >
                <TelegramIcon />
            </IconButton>
            <IconButton
                size="small"
                target={`_blank`}
                href="https://twitter.com/algoworld_nft"
            >
                <TwitterIcon />
            </IconButton>
            <IconButton
                size="small"
                target={`_blank`}
                href="https://github.com/AlgoWorldNFT"
            >
                <GitHubIcon />
            </IconButton>
        </Stack>
    );
}

const navBarItems = [
    {
        id: `gallery`,
        url: `/gallery`,
        label: `Gallery`,
        icon: HomeIcon,
    },
    {
        id: `myTransactions`,
        url: `/my-transactions`,
        label: `My Transactions`,
        icon: SwapHorizontalCircleIcon,
    },
    {
        id: `about`,
        url: ``,
        label: `About`,
        action: setIsAboutPopupOpen,
        icon: HelpIcon,
    },
];

const Footer = () => {
    const [navBarValue, setNavBarValue] = useState(0);
    const dispatch = useAppDispatch();

    return (
        <>
            <Box
                sx={{
                    py: 2,
                    px: 2,
                    mt: `auto`,
                    display: { xs: `flex`, md: `flex` },
                }}
                alignItems="center"
                justifyContent="center"
                component="footer"
            >
                <Container>
                    <ReferenceButtons />
                </Container>
            </Box>
        </>
    );
};

export default Footer;
