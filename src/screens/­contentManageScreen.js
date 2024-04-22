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
  const [successMessage, setSuccessMessage] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const updateProductDetails = async (product) => {
    const { tempStock, tempPrice } = product;
    let messageParts = [];

    if (tempStock !== product.stock) {
        if (tempStock < 0 || tempStock > 999) {
            alert('Stock must be between 0 and 999.');
            return;
        }
        messageParts.push(`stock to ${tempStock}`);
    }

    if (tempPrice !== product.price && tempPrice !== undefined) {
        if (tempPrice < 0) {
            alert('Price must be greater than 0.');
            return;
        }
        messageParts.push(`price to $${tempPrice.toFixed(2)}`);
    }

    if (messageParts.length === 0) {
        alert('No changes were made.');
        return;
    }

    try {
        const response = await Axios.put(`/api/products/${product._id}`, {
            stock: tempStock !== product.stock ? tempStock : undefined,
            price: tempPrice !== product.price ? tempPrice : undefined
        });
        console.log('Update successful', response.data);
        setProducts(products.map(p => {
            if (p._id === product._id) {
                return {
                    ...p,
                    stock: tempStock !== product.stock ? tempStock : p.stock,
                    price: tempPrice !== product.price ? tempPrice : p.price
                };
            }
            return p;
        }));
        setSuccessMessage(`Updated ${product.name} ${messageParts.join(' and ')}.`);
        setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
        console.error('Failed to update product', error);
        alert('Failed to update product: ' + (error.response ? error.response.data.message : error.message));
        setSuccessMessage('');
    }
};
   


  return (
    <TableContainer component={Paper} className={styles.root}>
        <>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Add New Product
            </Button>
            <AddProductForm open={open} handleClose={handleClose} />
            {successMessage && <Alert severity="success" style={{ margin: '10px 0' }}>{successMessage}</Alert>}
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
                <TableCell align="right">
                <TextField
                  type="number"
                  value={product.tempPrice || product.price}  
                  onChange={(e) => setProducts(products.map(p => p._id === product._id ? { ...p, tempPrice: parseFloat(e.target.value) } : p))}
                />
               </TableCell>

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
                    onClick={() => updateProductDetails(product)}
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
