import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, TextField, Button } from '@material-ui/core';
import Axios from 'axios';

function AddProductForm({ open, handleClose }) {
    const [product, setProduct] = useState({
        name: '',
        price: '',
        calorie: '',
        category: '',
        stock: '',
        image: ''
    });

    const handleChange = (event) => {
        setProduct({ ...product, [event.target.name]: event.target.value });
    };

    const handleSubmit = async () => {
        try {
            await Axios.post('/api/products', product);
            alert('Product added successfully');
            handleClose(true);  // refresh the list if needed
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    };

    return (
        <Dialog open={open} onClose={() => handleClose(false)}>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Price"
                    type="number"
                    fullWidth
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Calorie"
                    type="number"
                    fullWidth
                    name="calorie"
                    value={product.calorie}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Category"
                    type="text"
                    fullWidth
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Stock"
                    type="number"
                    fullWidth
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Image URL"
                    type="text"
                    fullWidth
                    name="image"
                    value={product.image}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Add Product
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddProductForm;
