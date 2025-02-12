import { useState } from 'react';
import Link from 'next/link';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Container,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme,
    Divider
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../lib/context/AuthContext';

export default function Navigation() {
    const { user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'About', href: '/about' },
        { text: 'Pricing', href: '/pricing' },
        { text: 'Free Coloring Pages', href: '/coloring-pages' },
    ];

    const drawer = (
        <Box sx={{ width: 275 }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1,
                px: 2,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
            }}>
                <Typography variant="subtitle1">
                    Menu
                </Typography>
                <IconButton
                    onClick={handleDrawerToggle}
                    size="small"
                    edge="end"
                    aria-label="close menu"
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            <List disablePadding>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        component="a"
                        href={item.href}
                        onClick={handleDrawerToggle}
                        sx={{
                            py: 1,
                            px: 2,
                        }}
                    >
                        <ListItemText
                            primary={item.text}
                        />
                    </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                {user ? (
                    <ListItem
                        component="a"
                        href="/account"
                        onClick={handleDrawerToggle}
                        sx={{
                            py: 1,
                            px: 2,
                        }}
                    >
                        <ListItemText
                            primary="Account"
                        />
                    </ListItem>
                ) : (
                    <ListItem
                        component="a"
                        href="/login"
                        onClick={handleDrawerToggle}
                        sx={{
                            py: 1,
                            px: 2,
                        }}
                    >
                        <ListItemText
                            primary="Login"
                        />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
            <Container maxWidth="lg">
                <Toolbar
                    disableGutters
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        component="a"
                        href="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                            gap: 1
                        }}
                    >
                        <PaletteIcon />
                        <Typography variant={isMobile ? 'body2' : 'body1'} fontWeight={500}>
                            ColoringPageMagic
                        </Typography>
                    </Box>

                    {isMobile ? (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {menuItems.map((item) => (
                                <Button
                                    key={item.text}
                                    component="a"
                                    href={item.href}
                                    variant="text"
                                    disableElevation
                                >
                                    {item.text}
                                </Button>
                            ))}
                            {user ? (
                                <Button
                                    component="a"
                                    href="/account"
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <AccountCircleIcon fontSize='small' />
                                    <Box component="span">
                                        Account
                                    </Box>
                                </Button>
                            ) : (
                                <Button
                                    component="a"
                                    href="/login"
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Box component="span">
                                        Login
                                    </Box>
                                </Button>
                            )}
                        </Box>
                    )}
                </Toolbar>
            </Container>

            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
} 