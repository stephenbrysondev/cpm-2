import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loader({ message = 'Loading...' }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                py: 8
            }}
        >
            <CircularProgress
                size={40}
                thickness={4}
                disableShrink
            />
            <Typography
                variant="body1"
                color="text.secondary"
            >
                {message}
            </Typography>
        </Box>
    );
} 