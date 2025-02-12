import { useState } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import Link from 'next/link';
import Head from 'next/head';
import { TextField, Button, Box, Paper, Typography, Container, Alert } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await signUp(email, password);
            setIsRegistered(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isRegistered) {
        return (
            <>
                <Head>
                    <title>Verify Email | Coloring Page Magic - Free Printable Coloring Pages</title>
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
                            Verify Email
                        </Typography>
                        <Alert severity="info">
                            We've sent you an email to verify your account.
                        </Alert>
                        <Button
                            component="a"
                            href='/login'
                            variant="contained"
                            type="submit"
                            disableElevation
                            disabled={isLoading}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <Box component="span">
                                Go to Login
                            </Box>
                        </Button>
                    </Paper>
                </Container>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Register | Coloring Page Magic - Free Printable Coloring Pages</title>
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
                        Create your account
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
                            type="submit"
                            disableElevation
                            disabled={isLoading}
                            sx={{

                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <Box component="span">
                                Register
                            </Box>
                            <ArrowForwardIcon fontSize="small" />
                        </Button>
                    </Box>
                    <Link href="/login">
                        <Typography variant="body1" align="center" sx={{
                            cursor: 'pointer'
                        }}>
                            Already have an account? Login
                        </Typography>
                    </Link>
                </Paper>
            </Container>
        </>
    );
} 