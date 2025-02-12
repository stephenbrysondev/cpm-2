import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../lib/context/AuthContext';
import Head from 'next/head';
import { Paper, Typography, Button, Box, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Account() {
    const { user, signOut } = useAuth();

    return (
        <ProtectedRoute>
            <Head>
                <title>Account | Coloring Page Magic - Free Printable Coloring Pages</title>
            </Head>
            <Paper elevation={1} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" component="h1">
                    Account Details
                </Typography>

                <Box>
                    <Typography variant="body1" color="text.secondary">
                        Email
                    </Typography>
                    <Typography variant="body1">
                        {user?.email}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="body1" color="text.secondary">
                        Account ID
                    </Typography>
                    <Typography variant="body1">
                        {user?.id}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="body1" color="text.secondary">
                        Last Sign In
                    </Typography>
                    <Typography variant="body1">
                        {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
                    </Typography>
                </Box>

                <Divider />

                <Box>
                    <Button
                        onClick={signOut}
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                    >
                        Sign Out
                    </Button>
                </Box>
            </Paper>
        </ProtectedRoute>
    );
} 