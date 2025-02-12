import { useState } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { TextField, Button, Box, Paper, Typography, Container, Alert } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ErrorIcon from '@mui/icons-material/Error';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { signIn } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await signIn(email, password);
            router.push('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>


            <Head>
                <title>Login | Coloring Page Magic - Free Printable Coloring Pages</title>
            </Head>
            <Container
                maxWidth="xs"
                disableGutters
            >
                <Paper
                    elevation={1}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Typography variant="h4" component="h1" align="center">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        {error && (
                            <Alert icon={<ErrorIcon />} severity="error" sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                {error}
                            </Alert>
                        )}
                        <TextField
                            id="email-address"
                            label="Email"
                            variant="outlined"
                            type="email"
                            required
                            disabled={isLoading}
                            placeholder="Email address"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            required
                            disabled={isLoading}
                            placeholder="Password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            component="button"
                            variant="contained"
                            disabled={isLoading}
                            type="submit"
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
                            <ArrowForwardIcon fontSize="small" />
                        </Button>
                    </Box>
                    <Link href="/register">
                        <Typography variant="body1" align="center" sx={{
                            cursor: 'pointer'
                        }}>
                            Don't have an account? Sign up
                        </Typography>
                    </Link>
                </Paper>
            </Container>
        </>
    );
} 