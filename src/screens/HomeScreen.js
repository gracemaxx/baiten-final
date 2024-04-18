import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardActionArea, Typography } from '@material-ui/core';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
export default function HomeScreen(props) {
  const styles = useStyles();
  const navigate = useNavigate();
  return (
    <Card>
      <CardActionArea onClick={() => navigate('/order')}>
        <Box className={[styles.root, styles.red]}>
          <Box className={[styles.main, styles.center]}>
            <Typography variant="h1" component="h1" className={styles.bold}>
              Order <br />
              here <br />
              now
            </Typography>
            <TouchAppIcon fontSize="large"></TouchAppIcon>
          </Box>
          <Box className={[styles.center, styles.green]}>
            <Logo large />
            <Typography variant="h5" component="h5" className={styles.footer}>
              Touch to start
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
