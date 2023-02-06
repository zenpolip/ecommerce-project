import React, { createContext, useContext, useState, useEffect } from 'react';

import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('cartItems') !== null ? JSON.parse(localStorage.getItem('cartItems')) : [];
    });
    const [totalPrice, setTotalPrice] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('totalPrice') !== null ? JSON.parse(localStorage.getItem('totalPrice')) : 0;
    });
    const [totalQuantities, setTotalQuantities] = useState(() => {
        if (typeof window !== 'undefined')
            return localStorage.getItem('totalQuantities') !== null ? JSON.parse(localStorage.getItem('totalQuantities')) : 0;
    });
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
            localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities));
        }
    }, [cartItems, totalPrice, totalQuantities]);

    const onAdd = (product, quantity) => {
        const checkProdutInCart = cartItems.find((item) => item._id === product._id);
        setTotalPrice((prevTotalPrie) => prevTotalPrie + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if (checkProdutInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity,
                    };
                } else {
                    return { ...cartProduct };
                }
            });
            setCartItems(updatedCartItems);
        } else {
            product.quantity = quantity;

            setCartItems([...cartItems, { ...product }]);
        }
        setQty(1);
        toast.success(`${qty} ${product.name} added to the cart.`);
    };

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrie) => prevTotalPrie - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
    };

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);
        // const newCartItems = cartItems.filter((item) => item._id !== id);

        if (value === 'inc') {
            foundProduct.quantity += 1;
            // setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
            setTotalPrice((prevTotalPrie) => prevTotalPrie + foundProduct.price);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                foundProduct.quantity -= 1;
                // setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
                setTotalPrice((prevTotalPrie) => prevTotalPrie - foundProduct.price);
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
            } else return;
        }

        // newCartItems.splice(index, 0, foundProduct);

        const newCartItems = cartItems.map((item, i) => {
            return i === index ? foundProduct : item;
        });

        setCartItems(newCartItems);
    };

    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    };

    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1;
            return prevQty - 1;
        });
    };

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                setCartItems,
                totalPrice,
                setTotalPrice,
                totalQuantities,
                setTotalQuantities,
                qty,
                setQty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantity,
                onRemove,
            }}>
            {children}
        </Context.Provider>
    );
};

export const useStateContext = () => useContext(Context);
