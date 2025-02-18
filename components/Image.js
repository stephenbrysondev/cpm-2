import { Box, Skeleton } from '@mui/material';
import NextImage from 'next/image';

export default function Image({ loading, src, alt, width = 528, fetchPriority, ...props }) {
    // Calculate height based on 13:19 aspect ratio
    const aspectRatio = 19 / 13;
    const height = Math.round(width * aspectRatio);

    // Construct the full source URL
    const fullSrc = `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_URL}${src}`;

    return (
        <Box
            sx={{
                width: '100%',
                height: 'auto',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'rgba(0, 0, 0, .12)',
            }}
        >
            {loading ? (
                <Skeleton variant="rectangular" width="100%" height="auto" animation="wave" sx={{ aspectRatio: '13/19' }} />
            ) : (
                <NextImage
                    src={fullSrc}
                    alt={alt || ''}
                    width={width}
                    height={height}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                    {...props}
                />
            )}
        </Box>
    );
} 