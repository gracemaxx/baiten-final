import React from 'react'
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';

export default function PaymentScreen() {
  const styles = useStyles();
  const navigate = useNavigate();
  return (
    <Box className={[styles.root, styles.navy]}>
      <Box className={[styles.main, styles.center]}>
        <Box>
          <Logo large></Logo>
          <Typography
            gutterBottom
            className={styles.title}
            variant="h3"
            component="h3"
          >
            Please follow the instruction on the PIN pad
          </Typography>
          <CircularProgress />
        </Box>
      </Box>
      <Box className={[styles.center, styles.space]}>
        <Button variant="contained" color="primary" className={styles.largeButton}
          onClick={() => navigate('/complete')}>
          Complete Order
        </Button>
      </Box>
    </Box>
  )
}
