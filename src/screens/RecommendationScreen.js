import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Dialog, DialogTitle, DialogContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, DialogActions } from '@material-ui/core';
import { Store } from '../Store';

export default function RecommendationScreen({ onClose, open }) {
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [calorieRange, setCalorieRange] = useState('');
  const [matchingProducts, setMatchingProducts] = useState([]);

  const handleFindMyDrink = () => {
    const minCalories = parseInt(calorieRange.split('-')[0], 10);
    const maxCalories = parseInt(calorieRange.split('-')[1]) || 9999; // handle open-ended ranges like "200+"
    // Filter products based on category and calorie range
    const foundProducts = state.productList.products.filter(product =>
        product.category === category &&
        product.calorie >= minCalories &&
        product.calorie <= maxCalories
    );

    setMatchingProducts(foundProducts);
  };

  const handleProductSelect = (product) => {
    // Assuming a dispatch method to set the selected product
    dispatch({
        type: 'ORDER_SET_ITEM', // Example action type
        payload: { product, quantity: 1 } // Example payload
    });
    navigate('/order', { state: { selectedCategory: product.category } }); // Navigate to the order screen
    onClose(); // Close the dialog
  };

  // Reset state when dialog closes
  const handleClose = () => {
    setCategory('');
    setCalorieRange('');
    setMatchingProducts(null);
    onClose();
  };

  useEffect(() => {
    // Reset state when dialog is initially opened
    if (open) {
      setCategory('');
      setCalorieRange('');
      setMatchingProducts(null);
    }
  }, [open]);

  return (
    <Dialog onClose={handleClose} aria-labelledby="recommendation-dialog-title" open={open}>
            <DialogTitle id="recommendation-dialog-title">Find Your Drink</DialogTitle>
            <DialogContent>
                <FormControl component="fieldset" style={{ marginRight: '20px' }}>
                    <FormLabel component="legend">Category</FormLabel>
                    <RadioGroup aria-label="category" name="category1" value={category} onChange={(e) => setCategory(e.target.value)}>
                        {state.categoryList.categories.map((cat) => (
                            <FormControlLabel value={cat.name} control={<Radio />} label={cat.name} key={cat.name} />
                        ))}
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" style={{ marginRight: '20px' }}>
                    <FormLabel component="legend">Calorie Range</FormLabel>
                    <RadioGroup aria-label="calorie" name="calorie1" value={calorieRange} onChange={(e) => setCalorieRange(e.target.value)}>
                        <FormControlLabel value="0-100" control={<Radio />} label="0-100" />
                        <FormControlLabel value="100-200" control={<Radio />} label="100-200" />
                        <FormControlLabel value="200+" control={<Radio />} label="200+" />
                    </RadioGroup>
                </FormControl>

                {matchingProducts ? (
                    matchingProducts.length > 0 ? (
                        <div style={{ marginTop: '20px' }}>
                            <Typography variant="h6">Your recommended drinks:</Typography>
                                {matchingProducts.map((product, index) => (
                            <Typography key={index} style={{ cursor: 'pointer' }} onClick={() => handleProductSelect(product)}>
                                {product.name} - {product.calories} Calories
                            </Typography>
                            ))}
                        </div>
                    ) : (
                        <Typography style={{ marginTop: '20px' }}>No products match your preference.</Typography>
                    )) : null}


            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary"> Back </Button>
                <Button onClick={handleFindMyDrink} color="primary">
                    Find My Drink
                </Button>
            </DialogActions>
        </Dialog>
    );
}
