import { Box, Container, IconButton, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';

function ReferenceButtons() {
  return (
    <Stack justifyContent={`center`} direction="row">
      <IconButton size="small" target={`_blank`} href="https://t.me/algorealm">
        <TelegramIcon />
      </IconButton>
      <IconButton
        size="small"
        target={`_blank`}
        href="https://twitter.com/algorealm"
      >
        <TwitterIcon />
      </IconButton>
      <IconButton
        size="small"
        target={`_blank`}
        href="https://github.com/AlgoRealm"
      >
        <GitHubIcon />
      </IconButton>
    </Stack>
  );
}

const Footer = () => {
  return (
    <>
      <Box
        sx={{
          py: 2,
          px: 2,
          mt: `auto`,
          display: { xs: `flex`, md: `flex` },
        }}
        alignItems="center"
        justifyContent="center"
        component="footer"
      >
        <Container>
          <ReferenceButtons />
        </Container>
      </Box>
    </>
  );
};

export default Footer;
