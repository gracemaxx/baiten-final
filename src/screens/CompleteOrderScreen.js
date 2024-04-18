import React, { useContext, useEffect } from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import { Store } from '../Store';
import { Alert } from '@material-ui/lab';
import { createOrder } from '../actions';
import { useNavigate } from 'react-router-dom';
export default function CompleteOrderScreen(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const { order } = state;
  const { loading, error, newOrder } = state.orderCreate;
  const navigate = useNavigate();

  useEffect(() => {
    if (order.orderItems.length > 0) {
      createOrder(dispatch, order);
    }
  }, [order, dispatch]);

  return (
    <Box className={[styles.root, styles.navy]}>
      <Box className={[styles.main, styles.center]}>
        <Box>
          <Logo large></Logo>
          {loading ? (
            <CircularProgress></CircularProgress>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              <Typography variant="h3" component="h3" gutterBottom className={styles.title}>
                Your order has been placed
              </Typography>
              <Typography variant="h1" component="h1" gutterBottom className={styles.title}>
                Thank you!
              </Typography>
              <Typography variant="h3" component="h3" gutterBottom className={styles.title}>
                Your order number is {newOrder.number}
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <Box className={[styles.center, styles.space]}>
        <Button variant="contained" color="primary" className={styles.largeButton}
          onClick={() => navigate('/')}>
          Order Again
        </Button>
      </Box>
    </Box>
  );
}
