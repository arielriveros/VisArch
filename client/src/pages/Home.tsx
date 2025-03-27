import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography } from '@mui/material';
import SS1 from '@/assets/images/ss1.png';
import SS2 from '@/assets/images/ss2.png';
import SS3 from '@/assets/images/ss3.png';

export default function Home() {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'annotate', img: SS1, text: t('home.description1') },
    { id: 'collaborate', img: SS2, text: t('home.description2') },
    { id: 'manage', img: SS3, text: t('home.description3') },
  ];

  return (
    <Box
      sx={{
        height: '100vh', // Full viewport height
        overflowY: 'auto', // Enable vertical scrolling
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: { md: 10 },
        py: 5,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={5}>
        {t('home.welcome')}
      </Typography>

      {sections.map((section, index) => (
        <Box key={section.id}>
          <Button onClick={() => scrollToSection(section.id)} sx={{ cursor: 'pointer', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">{t(section.id)}</Typography>
          </Button>
          <Box
            id={section.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 5,
              flexDirection: {
                xs: 'column', // Stack vertically on small screens
                md: index % 2 === 0 ? 'row' : 'row-reverse', // Original layout for medium and larger screens
              },
            }}
          >
            <Box
              component="img"
              src={section.img}
              alt="Screenshot"
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                mr: { md: index % 2 === 0 ? 2 : 0 },
                ml: { md: index % 2 !== 0 ? 2 : 0 },
                width: { xs: '100%', md: '75%' }, // Full width on small screens
                position: 'relative',
              }}
            />
            <Typography
              sx={{
                fontSize: '1.25rem', // Larger font size
                fontWeight: '500', // Slightly bold
                padding: 2, // Add padding
                color: 'text.secondary', // Prettier color
                textAlign: { xs: 'center', md: 'inherit' }, // Center text on small screens
              }}
            >
              {section.text}
            </Typography>
          </Box>
        </Box>
      ))}

      <Typography variant="h5" fontWeight="bold" mt={5}>
        <RouterLink to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
          {t('home.get-started')}
        </RouterLink>
      </Typography>
    </Box>
  );
}
