import React, { useEffect } from "react";
import ProductItem from "../ProductItem";
import { UPDATE_PRODUCTS } from "../../utils/actions";
import { useQuery } from '@apollo/react-hooks';
import { QUERY_PRODUCTS } from "../../utils/queries";
import { idbPromise } from "../../utils/helpers";
import spinner from "../../assets/spinner.gif"
import { useSelector } from 'react-redux'

import store from '../../utils/store'

function ProductList() {
  const state = store.getState()
  const cartOpen = useSelector(state => state.cartOpen)

  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if(data) {
      store.dispatch({
           type: UPDATE_PRODUCTS,
          products: data.products
        });
        data.products.forEach((product) => {
          idbPromise('products', 'put', product);
        });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        store.dispatch({
          type: UPDATE_PRODUCTS,
         products: products
       });
      });
    }
  }, [data, loading, cartOpen]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
            {filterProducts().map(product => (
                <ProductItem
                  key= {product._id}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  quantity={product.quantity}
                />
            ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      { loading ? 
      <img src={spinner} alt="loading" />: null}
    </div>
  );
}

export default ProductList;
