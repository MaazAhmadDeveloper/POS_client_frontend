import React, { useEffect, useState } from 'react'
import { Button, Card, } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

const Product = ({product}) => {
  const [productQuantity, setProductQuantity] = useState(1);
  const {cartItems} = useSelector(state => state.rootReducer);
  const [isClicked, setIsClicked] = useState(false);
  const [customePrice, setCustomePrice] = useState(0);
  const [customeTitle, setCustomeTitle] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    setCustomePrice(product.price);
    setCustomeTitle(product.name);
  }, [product.price, product.name]);

  const handlerToCart = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
    
    const isProductExistInCart = cartItems.filter((obj) => obj._id.toString().includes(product?._id));
    setProductQuantity(1)
    console.log(product);
    setCustomePrice(product.price)
    setCustomeTitle(product.name);
    if (isProductExistInCart.length === 0) {  
      dispatch({
        type: "ADD_TO_CART",
        payload: { ...product, quantity: productQuantity, price: customePrice, name:customeTitle  }
      })
    }
}

    const quantityAddClickHandle = ()=>{
      setProductQuantity(prev => prev +1)
    }
    const quantityMinusClickHandle = ()=>{
      setProductQuantity(productQuantity !== 1 ? productQuantity - 1 : 1);
    }

  return (
    <Card
        hoverable
        style={{ width: 240, marginBottom: 30, borderRadius: "10px"}}
        cover={<img alt={product.name} src={product.image} style={{height: 150, width: 230, margin: "auto", marginTop: "10px", borderRadius: "10px"}} />}
    >
      <div className="product-data">
        {/* <p style={{margin: 0}} >{product.name}</p> */}
        <input 
              className='product-title-input'
              type="text"
              value={customeTitle}
              onWheel={(e) => e.target.blur()}
              onChange={ (e)=>{setCustomeTitle(e.target.value)}}
            />
      </div>

            {/* <h4 style={{fontSize:"18px"}} >Rs {product.price} </h4> */}
            Rs <input 
              className='product-price-input'
              type="number"
              value={customePrice}
              // value={product.price}
              onWheel={(e) => e.target.blur()}
              onChange={ (e)=>{setCustomePrice(e.target.value)}}
            />

        <div className="product-btn">
          

              <div className="quantity-container">
                  <strong onClick={quantityMinusClickHandle} style={{fontSize: "20px", margin: "0px 7px"}} >-</strong>
                  <strong> {productQuantity}</strong>
                  <strong onClick={quantityAddClickHandle} style={{fontSize: "20px", margin: "0px 7px"}} >+</strong>
              </div>

          <Button style={{margin: 0, backgroundColor: isClicked ? '#ffffff' : '#001e28', color: isClicked ? 'black' : 'white'}} onClick={() => handlerToCart()}>Add To Cart</Button>

        </div>
    </Card>
  )
}

export default Product



















// import React, { useState } from 'react'
// import { Button, Card, } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';

// const Product = ({product}) => {
//   const [productQuantity, setProductQuantity] = useState(1);
//   const {cartItems} = useSelector(state => state.rootReducer);
//   const [isClicked, setIsClicked] = useState(false);
//   const dispatch = useDispatch();

//   const handlerToCart = () => {
//     setIsClicked(true);
//     setTimeout(() => {
//       setIsClicked(false);
//     }, 300);
    
//     const isProductExistInCart = cartItems.filter((obj) => obj._id.toString().includes(product?._id));
//     setProductQuantity(1)
//     if (isProductExistInCart.length === 0) {  
//       dispatch({
//         type: "ADD_TO_CART",
//         payload: { ...product, quantity: productQuantity }
//       })
//     }
// }

//     const quantityAddClickHandle = ()=>{
//       setProductQuantity(prev => prev +1)
//     }
//     const quantityMinusClickHandle = ()=>{
//       setProductQuantity(productQuantity !== 1 ? productQuantity - 1 : 1);
//     }

//   return (
//     <Card
//         hoverable
//         style={{ width: 240, marginBottom: 30, borderRadius: "10px"}}
//         cover={<img alt={product.name} src={product.image} style={{height: 150, width: 230, margin: "auto", marginTop: "10px", borderRadius: "10px"}} />}
//     >
//       <div className="product-data">
//         <p style={{margin: 0}} >{product.name}</p>
//       </div>

//             <h4 style={{fontSize:"18px"}} >Rs {product.price} </h4>

//         <div className="product-btn">

//               <div className="quantity-container">
//                   <strong onClick={quantityMinusClickHandle} style={{fontSize: "20px", margin: "0px 7px"}} >-</strong>
//                   <strong> {productQuantity}</strong>
//                   <strong onClick={quantityAddClickHandle} style={{fontSize: "20px", margin: "0px 7px"}} >+</strong>
//               </div>

//           <Button style={{margin: 0, backgroundColor: isClicked ? '#ffffff' : '#001e28', color: isClicked ? 'black' : 'white'}} onClick={() => handlerToCart()}>Add To Cart</Button>

//         </div>
//     </Card>
//   )
// }

// export default Product
