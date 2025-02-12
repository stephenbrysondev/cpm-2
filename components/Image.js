import { Box } from '@mui/material';
import NextImage from 'next/image';

export default function Image({ src, alt, width = 528, ...props }) {
    // Calculate height based on 13:19 aspect ratio
    const aspectRatio = 19 / 13;
    const height = Math.round(width * aspectRatio);

    // If src starts with http, it's an external URL
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
            <NextImage
                src={fullSrc}
                alt={alt || ''}
                width={width}
                height={height}
                {...props}
            />
        </Box>
    );
} 