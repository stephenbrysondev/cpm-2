import { Paper, Typography, Box, Chip, Skeleton } from '@mui/material';
import Link from 'next/link';
import Image from './Image';

export default function Thumbnail({ image, title, href, tags, loading = false }) {
    if (loading) {
        return (
            <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                gap: 2
            }}>
                <Image width={300} loading={true} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Skeleton variant="text" width="100%" height={28} animation="wave" sx={{ transform: 'scale(1)' }} />
                    <Skeleton variant="text" width="40%" height={28} animation="wave" sx={{ transform: 'scale(1)' }} />
                </Box>
            </Paper>
        );
    }

    return (
        <Link href={href}>
            <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
                gap: 2,
                '&:hover': {
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                }
            }}>
                {image && (
                    <Image
                        src={image}
                        alt={title ? title : ''}
                        width={300}
                    />
                )}
                <Typography variant="h6">
                    {title}
                </Typography>
                {tags && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {tags.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" variant="outlined" />
                        ))}
                    </Box>
                )}
            </Paper>
        </Link>
    )
}
