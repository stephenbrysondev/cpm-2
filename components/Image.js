import { Box } from '@mui/material';

export default function Image({ src, alt, width = 528, ...props }) {
    // Calculate height based on 13:19 aspect ratio
    const aspectRatio = 19 / 13;
    const height = Math.round(width * aspectRatio);

    // Construct the full source URL
    const fullSrc = `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_URL}${src}`;

    // Use different image URL based on environment
    const imageUrl = process.env.NODE_ENV === 'development'
        ? fullSrc  // Use direct URL in development
        : `/_ipx/w_${width},q_75/${encodeURIComponent(fullSrc)}`; // Use Netlify transform in production

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
            <img
                src={imageUrl}
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
        </Box>
    );
} 