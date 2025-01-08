import React, {useState, useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout'
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Invoice from '../invoices/Invoice';

const Cart = () => {

    const nameInputRef = useRef();
    const [subTotal, setSubTotal] = useState(0);
    const [billPopUp, setBillPopUp] = useState(false);
    const [billDataNumbers, setBillsDataNumbers] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState([]);
    const [enterPressCount, setEnterPressCount] = useState(0);
    const [discountValue, setDiscountValue] = useState(0);
    const [serviceTaxValue, setServiceTaxValue] = useState(10);
    const [invoicepopModal, setInvoicePopModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [confirmDeleteData, setConfirmDeleteData] = useState();
    const [invoiceNumber, setiInvoiceNumber] = useState(0);
    const [serviceType, setServiceType] = useState("dinning");

    const dispatch = useDispatch();

    const {cartItems} = useSelector(state => state.rootReducer);

    const handlerIncrement = (record) => {
        dispatch({
            type: "UPDATE_CART",
            payload: {...record, quantity: record.quantity + 1}
        });
    };

    const handlerDecrement = (record) => {
        if(record.quantity !== 1){
            dispatch({
                type: "UPDATE_CART",
                payload: {...record, quantity: record.quantity - 1}
            });
        }
    };

    const handlerDelete = () => {
        dispatch({
            type: "DELETE_FROM_CART",
            payload: confirmDeleteData
        });
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Image",
            dataIndex: "image",
            render:(image, record) => <img src={image} alt={record.name} height={50} width={90} style={{borderRadius: 10}}/>
        }, 
        {
            title: "Price",
            dataIndex: "price",
        }
        , 
        {
            title: "Quantity",
            dataIndex: "_id",
            render:(id, record) => 
                <div>
                    <MinusCircleOutlined className='cart-minus' onClick={() => handlerDecrement(record)}/>
                    <strong className='cart-quantity'>{record.quantity}</strong>
                    <PlusCircleOutlined className='cart-plus' onClick={() => handlerIncrement(record)} />
                </div>
        }
        , 
        {
            title: "Action",
            dataIndex: "_id",
            render:(id, record) => <DeleteOutlined className='cart-action' onClick={() => {setDeleteModal(true); setConfirmDeleteData(record)}} />
        }
    ]

    useEffect(() => {

        let temp = 0;
        cartItems.forEach((product) => (temp = temp + product.price * product.quantity));
        setSubTotal(temp); 

    }, [cartItems]);

    useEffect(()=>{
      const getAllBills = async () => {
        try {
          dispatch({
            type: "SHOW_LOADING",
          });
          const {data} = await axios.get('https://pos-client-backend-oy6t.vercel.app/api/bills/getbills');
          setBillsDataNumbers(data.length +1000);
          dispatch({
            type: "HIDE_LOADING",
          });    
        } catch(error) {
          dispatch({
            type: "HIDE_LOADING",
          });
          console.log(error);
        }
      };

      getAllBills();
      
},[]); 

useEffect(() => {

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (cartItems.length !== 0) {
        e.preventDefault();
        setEnterPressCount((prevCount) => prevCount + 1);
  
        if (enterPressCount === 0) {
          setBillPopUp(true);

          setTimeout(() => {
            nameInputRef.current && nameInputRef.current.focus();
          }, 100);
          
        } else if (enterPressCount === 1) {
          document.getElementById('submitButton').click();
          setBillPopUp(false)
          setInvoicePopModal(true);
        }
      }else{
        message.error("Your Cart is empty")
      }
 
    } 
  };

  document.addEventListener('keypress', handleKeyPress);

  // Clean up the event listener when the component is unmounted
  return () => {
    document.removeEventListener('keypress', handleKeyPress);
  };
}, [enterPressCount, setBillPopUp]);
// const resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9).getTime(); // 9 AM today

useEffect(() => {
  const initializeOrderNumber = () => {
    const now = new Date();
    const currentTime = now.getTime();
    const resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9).getTime(); 
    console.log("resetTime: "+ resetTime);
    // const resetTime = new Date(currentTime + 2 * 60 * 1000).getTime();
    const lastResetTime = localStorage.getItem('lastResetTime');
    let orderNumber = localStorage.getItem('orderNumber');

    // Parse lastResetTime to a Date object if it exists
    const lastResetDate = lastResetTime ? new Date(Number(lastResetTime)).toDateString() : null;

    if (!lastResetTime || (now.toDateString() !== lastResetDate && currentTime >= resetTime)) {
      orderNumber = 1; // Reset order number
      localStorage.setItem('orderNumber', orderNumber);
      localStorage.setItem('lastResetTime', currentTime.toString()); // Save current time as the last reset time
    } else if (!orderNumber) {
      // If `orderNumber` is not set, initialize it to 1
      orderNumber = 1;
      localStorage.setItem('orderNumber', orderNumber);
    }
  };

initializeOrderNumber();

function isWithinAllowedTime() {
  const now = new Date();
  const currentHour = now.getHours();

  return currentHour >= 9 || currentHour < 3;
}

// function resetCounterIfNeeded() {
//   const now = new Date();
//   const currentHour = now.getHours();
//   const currentDate = now.toDateString();

//   const lastResetDate = localStorage.getItem('lastResetDate');

//   if (currentHour < 9 && lastResetDate !== currentDate) {
//       localStorage.setItem('counter', '1'); 
//       localStorage.setItem('lastResetDate', currentDate); 
//       console.log("Counter reset at 3 AM:", 1);
//   }
// }
// function updateCounter() {

//   resetCounterIfNeeded();

//   let counter = parseInt(localStorage.getItem('counter') || '0', 10);

//   if (isWithinAllowedTime()) {
//       // Increment counter if within allowed time
//       counter++;
//       localStorage.setItem('counter', counter.toString());
//   } else {
//       // If outside allowed time and counter is 0, start from 1
//       if (counter === 0) {
//           counter = 1;
//           localStorage.setItem('counter', counter.toString());
//       }
//   }
// }
}, []);


    const handlerSubmit = async (value) => {
      // console.log(value);
      let orderNumber = parseInt(localStorage.getItem('orderNumber'), 10);
        try {
            const newObject = {
              orderNumber: orderNumber.toString(),
              billNumber: billDataNumbers,
              customerAddress: value.customerAddress !== undefined && value.customerAddress !== null && value.customerAddress !== "" && value.customerAddress !== " " ? value.customerAddress : "-----",
              customerName: value.customerName !== undefined && value.customerName !== null && value.customerName !== "" && value.customerName !== " " ? value.customerName.toString() : "-----",
              customerPhone: value.customerPhone !== undefined && value.customerPhone !== null && value.customerPhone !== "" && value.customerPhone !== " " ? value.customerPhone.toString() : "-----",
              paymentMethod: value.paymentMethod !== undefined && value.paymentMethod !== null && value.paymentMethod !== "" && value.paymentMethod !== " " ? value.paymentMethod : "Cash",
              servicetType: value.servicetType !== undefined && value.servicetType !== null && value.servicetType !== "" && value.servicetType !== " " ? value.servicetType : "Dinning",
              handler: value.handler !== undefined && value.handler !== null && value.handler !== "" && value.handler !== " " ? value.handler : "Waiter",
              serviceTax: value.serviceTax !== undefined && value.serviceTax !== null && value.serviceTax !== "" && value.serviceTax !== " " ? value.serviceTax : 0,
              cartItems,
              subTotal,
              discount: Number(discountValue),
              totalAmount: totalAmountCalc(),
              // userId: JSON.parse(localStorage.getItem("auth"))._id
            }
            setSelectedInvoice(newObject)
            // console.log(newObject);

            await axios.post("https://pos-client-backend-oy6t.vercel.app/api/bills/addbills", newObject);
            message.success("Bill Generated!");
            localStorage.setItem('orderNumber', (orderNumber + 1).toString());  

            dispatch({
              type: "EMPTY_CART", 
            });

            setBillPopUp(false)
            setInvoicePopModal(true);

        } catch(error) {
            message.error("Error!")
            console.log(error);
        }
        setEnterPressCount(0);
    };

    const createInvoiceClickHandle = ()=>{
      setBillPopUp(true)
      setTimeout(() => {
        nameInputRef.current && nameInputRef.current.focus();
      }, 100);
    }

    const totalAmountCalc = ()=>{
      const total = (subTotal * (serviceTaxValue / 100)) + subTotal;
      const finalTotal = (Number(total) - discountValue); 
      return (finalTotal).toFixed(2);
    }

  return (
    <Layout>
      <h2>Cart</h2>
      <Table dataSource={cartItems} columns={columns} bordered />
      <div className="subTotal">
        <h2>Sub Total: <span>Rs {(subTotal).toFixed(2)}</span></h2>
        <Button onClick={() => cartItems.length !==0 ? createInvoiceClickHandle() : message.error("Your Cart is empty")} className='add-new'>Create Invoice</Button>
      </div>
      <Modal title="Create Invoice" visible={billPopUp} onCancel={() => setBillPopUp(false) } footer={false}>
        <Form id='generateInvoiveform' layout='vertical' onFinish={handlerSubmit}   initialValues={{serviceTax: serviceTaxValue,}}>
            <FormItem name="customerName" label="Customer Name">
              <Input placeholder='(Optional)' ref={nameInputRef}/>
            </FormItem>
            <FormItem name="customerPhone" label="Customer Phone">
              <Input placeholder='(Optional)' />
            </FormItem>
            <FormItem name="customerAddress" label="Customer Address">
              <Input placeholder='(Optional)' />
            </FormItem>
            <FormItem name="discount" label="Discount">
              <Input 
                type='number' 
                placeholder='(Optional) Discount' 
                onWheel={(e) => e.target.blur()}
                onChange={ (e)=>{setDiscountValue(e.target.value <= 0 ? 0 : e.target.value ); e.target.value.toString().includes("-") && message.error("you cannot set negative value") ;  } } 
                value={discountValue} />
            </FormItem>
            <FormItem name="serviceTax" label="Service Tax (%age)">
              <Input 
                type='number' 
                onWheel={(e) => e.target.blur()}
                onChange={ (e)=>{setServiceTaxValue(e.target.value <= 0 ? 0 : e.target.value ); e.target.value.toString().includes("-") && message.error("you cannot set negative value") ;  } } 
                value={serviceTaxValue} />
            </FormItem>
            {/* no this dropdown show if servicetType is take away */}
            <FormItem name="servicetType" label="Service Type">
              <Select
                defaultValue="Dinning"
                style={{ width: "100%" }}
                onChange={(value) => setServiceType(value)} // Track the selected service type
              >
                <Select.Option value="dinning">Dinning</Select.Option>
                <Select.Option value="takeaway">Takeaway</Select.Option>
                <Select.Option value="delivery">Delivery</Select.Option>
              </Select>
            </FormItem>
            <FormItem name="handler" label="Handler">
              <Select defaultValue={'Handler'} style={{ width: "100%" }}>
                {serviceType === "dinning" && (
                  <>
                    <Select.Option value="Adan">Adan </Select.Option>
                    <Select.Option value="Sarfaraz">Sarfaraz</Select.Option>
                    <Select.Option value="Mustafa">Mustafa</Select.Option>
                  </>
                )}
                {serviceType === "delivery" && (
                  <>
                    <Select.Option value="Delivery Boy">Delivery Boy</Select.Option>
                  </>
                )}
                {serviceType === "takeaway" && (
                  <>
                    <Select.Option value="Self Service">Self Service</Select.Option>
                  </>
                )}
              </Select>
            </FormItem>
            <FormItem name="paymentMethod" label="Payment Method">
              <Select defaultValue="Cash" style={{ width: "100%"}}>
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="Jazzcash">Jazzcash</Select.Option>
              </Select>
            </FormItem>
            <div className="total">
                <span>SubTotal: Rs {(subTotal.toFixed(2) )}</span><br />
                <span>Discount: Rs {discountValue} </span><br />
                <span>Service Tax: {serviceTaxValue}% </span>
                <h3>Total: Rs {totalAmountCalc()}</h3>
            </div>
            <div className="form-btn-add">
              <Button id='submitButton' htmlType='submit' className='add-new' >Generate Invoice</Button>
            </div>  
        </Form>
      </Modal>

      { 
        invoicepopModal 
          && <Invoice 
          selectedBill={selectedInvoice}
          popModal={invoicepopModal}
          setPopModal={setInvoicePopModal}
            /> 
          }

      <Modal title="Delete Product From Cart" visible={deleteModal} onCancel={() => setDeleteModal(false) } footer={false}>
          <h3 style={{marginBottom: 50}}>Are you sure to delete this product from cart</h3>
            <div style={{display: "flex"}}>
                <Button className='cancel-category' onClick={()=>{ setDeleteModal(false)}}>Cancel</Button>
                <Button className='delete-category' onClick={()=>{  setDeleteModal(false); handlerDelete()  }}>Cofirm</Button>
            </div>
      </Modal>

    </Layout>
  )
}

export default Cart
