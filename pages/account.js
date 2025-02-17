import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../lib/context/AuthContext';
import Head from 'next/head';
import { Paper, Typography, Button, Box, Divider, Grid, Alert } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { supabase } from '../lib/supabase';
import React from 'react';
import Link from 'next/link';
import Image from '../components/Image';

export default function Account() {
    const { user, signOut } = useAuth();
    const [savedPages, setSavedPages] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (user) {
            fetchSavedPages();
        }
    }, [user]);

    const fetchSavedPages = async () => {
        try {
            const { data, error } = await supabase
                .from('saved_pages')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;
            setSavedPages(data || []);
        } catch (error) {
            console.error('Error fetching saved pages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <Head>
                <title>Account | Coloring Page Magic - Free Printable Coloring Pages</title>
            </Head>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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

                <Paper elevation={1} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
                        Saved Coloring Pages
                    </Typography>

                    {isLoading ? (
                        <Typography>Loading saved pages...</Typography>
                    ) : savedPages.length === 0 ? (
                        <Alert severity="info">You haven't saved any coloring pages yet.</Alert>
                    ) : (
                        <Grid container spacing={2}>
                            {savedPages.map((saved) => (
                                <Grid item xs={12} sm={6} md={4} key={saved.id}>
                                    <Link href={`/${saved.page_data.slug}`}>
                                        <Paper sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            cursor: 'pointer',
                                            transition: 'box-shadow 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                                            }
                                        }}>
                                            {saved.page_data.image && (
                                                <Image
                                                    src={saved.page_data.image}
                                                    alt={saved.page_data.title}
                                                    width={300}
                                                />
                                            )}
                                            <Typography variant="h6" sx={{ mt: 2 }}>
                                                {saved.page_data.title}
                                            </Typography>
                                        </Paper>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            </Box>
        </ProtectedRoute>
    );
} 