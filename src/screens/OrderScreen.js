import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Box, Card, CardActionArea, CardContent, CardMedia, Grid, List, ListItem, CircularProgress, Typography, Dialog, DialogTitle, TextField, Button} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useStyles } from '../styles';
import { Store } from '../Store';
import {listCategories, listProducts, addToOrder, removeFromOrder, clearOrder} from '../actions';
import Logo from '../components/Logo';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import RecommendationScreen from './RecommendationScreen'

export default function OrderScreen() {
    const styles = useStyles();
    const { state, dispatch } = useContext(Store);
    const { categories, loading, error } = state.categoryList;
    const {
      products,
      loading: loadingProducts,
      error: errorProducts,
    } = state.productList;

    const {
      orderItems,
      itemsCount,
      totalPrice,
      taxPrice,
      orderType,
    } = state.order;

    const [categoryName, setCategoryName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [product, setProduct] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const [showRecommendations, setShowRecommendations] = useState(false);

    const categoryClickHandler = (name) => {
      setCategoryName(name);
      listProducts(dispatch, categoryName);
    };
    const closeHandler = () => {
      setIsOpen(false);
    };
    const productClickHandler = (p) => {
      setProduct(p);
      setIsOpen(true);
    };
    const addToOrderHandler = () => {
      addToOrder(dispatch, { ...product, quantity });
      setIsOpen(false);
    };
    const cancelOrRemoveFromOrder = () => {
      removeFromOrder(dispatch, product);
      setIsOpen(false);
    };
    const previewOrderHandler = () => {
      navigate('/review');
    };

    useEffect(() => {
      // Check if navigation state has a selected category
      if (location.state && location.state.selectedCategory) {
          setCategoryName(location.state.selectedCategory); // Set the selected category
          listProducts(dispatch, location.state.selectedCategory); // List products for the selected category
      } else {
          setCategoryName(''); // Reset or clear the category name
          listCategories(dispatch); // Fetch categories to display main menu
          listProducts(dispatch, ''); // Optionally list all products or a default set
      }
  }, [dispatch, location.state]);


    return (
    <Box className={styles.root}>
      <Box className={styles.main}>
        <Dialog maxWidth="sm" fullWidth={true} open={isOpen} onClose={closeHandler}> 
          <DialogTitle className={styles.center}>
            Add {product.name}
          </DialogTitle>
          <Box className={[styles.row, styles.center]}>
            <Button variant="contained" color="primary" disabled={quantity === 1}
                onClick={(e) => quantity > 1 && setQuantity(quantity - 1)}>
                  <RemoveIcon />
            </Button>
            <TextField
                inputProps={{ className: styles.largeInput }}
                InputProps={{ bar: true, inputProps: { className: styles.largeInput},
                }}
                className={styles.largeNumber}
                type="number"
                variant="filled"
                min={1}
                value={quantity}
              />
            <Button variant="contained" color="primary" onClick={(e) => setQuantity(quantity + 1)}>
              <AddIcon />
            </Button>
          </Box>
          <Box className={[styles.row, styles.around]}>
            <Button
              onClick={cancelOrRemoveFromOrder}
              variant="contained"
              color="primary"
              size="large"
              className={styles.largeButton}
            >
              {orderItems.find((x) => x.name === product.name)
                ? 'Remove From Order'
                : 'Cancel'}
            </Button>

            <Button
              onClick={addToOrderHandler}
              variant="contained"
              color="primary"
              size="large"
              className={styles.largeButton}
            >
              ADD To Order
            </Button>
          </Box>
        </Dialog>

        <Grid container>
            <Grid item md={2}>
              <List>
                {loading ? (
                  <CircularProgress />
                  ) : error ? (
                    <Alert severity="error">{error}</Alert>
                  ) : (
                    <>
                    <ListItem button onClick={() => categoryClickHandler('')}>
                      <Logo ></Logo>
                    </ListItem>
                    {categories.map((category) => (
                      <ListItem button key={category.name} onClick={() => categoryClickHandler(category.name)}>
                         <Avatar alt={category.name} src={category.image} />
                       </ListItem>
                    ))}
                    <ListItem button onClick={() => setShowRecommendations(true)}>
                      <Avatar src="/images/recommendation.png" />
                    </ListItem>
                    {showRecommendations && <RecommendationScreen open={showRecommendations} onClose={() => setShowRecommendations(false)} />}
                     </>
                  )}
                </List>
            </Grid>

            <Grid item md={10}> 
                <Typography gutterBottom className={styles.title} variant="h2" component="h2">
                  {categoryName|| 'Main Menu'}
                </Typography>

                <Grid container spacing={1}>
                  {loadingProducts ? (
                  <CircularProgress />
                ) : errorProducts ? (
                  <Alert severity="error">{errorProducts}</Alert>
                ) : (
                  products.map((product) => (
                    <Grid item md={6}>
                      <Card className={styles.card} onClick= {()=>productClickHandler(product)}>
                      <CardActionArea>
                        <CardMedia component="img" alt={product.name} image={product.image} className={styles.media}>
                        </CardMedia>
                        <CardContent>
                        <Typography gutterBottom variant="body2" color="textPrimary" component="p">
                          {product.name}
                        </Typography>
                        <Box className={styles.cardFooter}>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {product.calorie} Cal
                          </Typography>
                          <Typography variant="body2" color="textPrimary" component="p">
                            ${product.price}
                          </Typography>
                        </Box>
                       </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  ))
                )}
                </Grid>
            </Grid>
        </Grid>
      </Box>
      <Box>
          <Box>
            <Box className={[styles.bordered, styles.space]}>
            My Order - {orderType} | Tax: ${taxPrice} | Total: ${totalPrice} |
            Items: {itemsCount}

            </Box>
            <Box className={[styles.row, styles.around]}>
              <Button onClick={() => { clearOrder(dispatch); 
                navigate(`/`);}}
                variant="contained"
                color="primary"
                className={styles.largeButton}
              >
                Cancel Order
              </Button>

              <Button variant="contained" color="primary" className={styles.largeButton}
              onClick={previewOrderHandler} disabled={orderItems.length === 0}>
                Done
              </Button>
            </Box>
          </Box>
        </Box>
    </Box>
  );
}
