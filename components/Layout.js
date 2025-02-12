import Navigation from './Navigation';
import { Container } from '@mui/material';

export default function Layout({ children }) {
    return (
        <>
            <Navigation />
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    py: 4
                }}
            >
                {children}
            </Container>
        </>
    );
} 