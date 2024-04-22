import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button } from '@material-ui/core';
import { useStyles } from '../styles';
import { Alert } from '@material-ui/lab';
import Axios from 'axios';
import AddProductForm from './AddProductForm';

export default function ContentManageScreen() {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
      setOpen(false);
  };
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await Axios.get('/api/products');
        setProducts(data.map(product => ({ ...product, tempStock: product.stock })));
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateStock = async (product, newStock) => {
    if (newStock < 0 || newStock > 999) {
      alert('Stock must be between 0 and 999.');
      return;
    }
  
    try {
      const response = await Axios.put(`/api/products/${product._id}`, { stock: newStock });
      console.log('Update successful', response.data);
      setProducts(products.map(p => p._id === product._id ? { ...p, stock: newStock } : p));
    } catch (error) {
      console.error('Failed to update product', error);
      alert('Failed to update product: ' + (error.response ? error.response.data.message : error.message));
    }
  };
   


  return (
    <TableContainer component={Paper} className={styles.root}>
        <>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Add New Product
            </Button>
            <AddProductForm open={open} handleClose={handleClose} />
        </>
      <Table aria-label="Products">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Current Stock</TableCell>
            <TableCell align="right">Update Stock</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
            products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">${product.price}</TableCell>
                <TableCell align="right">
                <TextField type="number" value={product.tempStock}
                    onChange={(e) => {
                        const newStock = parseInt(e.target.value, 10);
                        if (newStock >= 0 && newStock <= 999) {
                        setProducts(products.map(p => p._id === product._id ? { ...p, tempStock: newStock } : p));
                        }
                    }}
                    inputProps={{
                        min: "0",
                        max: "999"
                    }}
                />

                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateStock(product, product.tempStock)}
                  >
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
