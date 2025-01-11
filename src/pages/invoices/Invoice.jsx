import React, {useEffect, useRef, useState} from 'react'
import { useReactToPrint } from 'react-to-print';
import { Button, Modal, Table } from 'antd';

function Invoice( {selectedBill, popModal, setPopModal } ) {
    const componentRef = useRef();
    const userCardRef = useRef();
    const [isEditFlag, setIsEditFlag] = useState(false);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });
    const handleUserCardPrint = useReactToPrint({
        content: () => userCardRef.current,
      });
useEffect(()=>{
    const editItem = selectedBill.cartItems?.find((item) => item.status === "edit");
    if (editItem) {
        setIsEditFlag(true);
    }else{
        setIsEditFlag(false)
    }
},[selectedBill])
    const generateInvoiceClickHandle = ()=>{
        setPopModal(false);
        if (isEditFlag) {
            handleUserCardPrint();
        }else{
            handlePrint();
        }
    }
      const columns = [
        {
            title: "Product",
            dataIndex: "name"
        },
        {
            title: "Price",
            dataIndex: "price",
        }, 
        {
            title: "Qty",
            dataIndex: "quantity",
        }, 
        {
            title: "Sub Total",
            dataIndex: "quantity",
            render: (data, allData) => data * allData.price
        }
      ]

useEffect(() => {
        const handleKeyPress = (e) => {
          if (e.key === 'Enter' && popModal === true) {
              handlePrint();
              setPopModal(false);
          }
    };
      
    document.addEventListener('keypress', handleKeyPress);
      
        // Clean up the event listener when the component is unmounted
    return () => {
        document.removeEventListener('keypress', handleKeyPress);
    };
}, []);


  return (
    <div>
        <Modal title="Invoice Details" width={400} pagination={false} visible={popModal} onCancel={() => setPopModal(false)} footer={false}>
{isEditFlag && 
<div className="card" ref={userCardRef}>
        <div className="cardHeader">
                <h2 className="logo">Karachi Fresh Juice</h2>
                <span><b>0300-079-0979</b></span>
                <span><b>Baldia road, Baldia Plaza Bahawalnagar</b></span>
            </div>
            <div className="cardBody">
                <div className="group">
                    <span>Invoice Number:</span>
                    <span><b>{selectedBill.billNumber}</b></span>
                </div>
                { selectedBill.customerName !== "-----" && <div className="group">
                    <span>Customer Name:</span>
                    <span><b>{selectedBill.customerName}</b></span>
                </div>}
                { selectedBill.customerPhone !== "-----" &&<div className="group">
                    <span>Customer Phone:</span>
                    <span><b>{selectedBill.customerPhone}</b></span>
                </div>}
                { selectedBill.customerAddress !== "-----" &&<div className="group">
                    <span>Customer Address:</span>
                    <span><b>{selectedBill.customerAddress}</b></span>
                </div>}
                { selectedBill?.servicetType !== "-----" &&<div className="group">
                    <span>Service Type:</span>
                    <span><b>{selectedBill?.servicetType}</b></span>
                </div>}
                { selectedBill?.handler !== "-----" &&<div className="group">
                    <span>Handler:</span>
                    <span><b>{selectedBill?.handler}</b></span>
                </div>}
                <div className="group">
                    <span>Payment Method:</span>
                    <span><b>{selectedBill.paymentMethod}</b></span>
                </div>
                <div className="group">
                    <span>Date Order:</span>
                    <span><b>{selectedBill.createdAt? new Date(selectedBill.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</b></span>
                </div>
            </div>
            
                <h4 className="YourOrderText">Your Order</h4>
            <Table columns={columns} dataSource={selectedBill.cartItems} pagination={false} size="small" />

                <div className="footerCardTotal">
                    {selectedBill.deliveryFee ?
                    <div className="group">
                        <p >Delivery Fee:</p>
                        <p><b className="total">+ Rs {selectedBill?.deliveryFee}</b></p>
                    </div>
                    :
                    <div className="group">
                        <p >Service Tax:</p>
                        <p><b className="total">+ {selectedBill?.serviceTax}%</b></p>
                    </div>
                    }
                    {selectedBill.perHead !==0 &&
                    <div className="group">
                        <p >Per Head ({selectedBill.perHead}):</p>
                        <p><b className="total">+ {selectedBill.perHead * 100}</b></p>
                    </div>}
                    <div className="group">
                        <h3 >Discount:</h3>
                        <h3><b className="total">- Rs {selectedBill.discount}</b></h3>
                    </div>
                    <div className="group">
                        <h3 >Total:</h3>
                        <h3><b className="total">Rs {selectedBill.totalAmount}</b></h3>
                    </div>
                </div>
                <div className="footerThanks">
                    <span>Thank You for buying from us</span>
                </div>
</div>}


{!isEditFlag && 
<div className="card" ref={componentRef}>
                {/* For shop */}
            <div className="cardHeader">
                <h2 className="logo">For Shop &nbsp;&nbsp;&nbsp;&nbsp; {selectedBill.orderNumber && <b className='order-number'> #{selectedBill.orderNumber}</b> }</h2>
            </div>
            <div className="cardBody">
            <div className="group">
                    <span>Invoice Number:</span>
                    <span><b>{selectedBill.billNumber}</b></span>
                </div>
            { selectedBill.customerName !== "-----" && <div className="group">
                    <span>Customer Name:</span>
                    <span><b>{selectedBill.customerName}</b></span>
                </div>}
                { selectedBill.customerPhone !== "-----" &&<div className="group">
                    <span>Customer Phone:</span>
                    <span><b>{selectedBill.customerPhone}</b></span>
                </div>}
                { selectedBill.customerAddress !== "-----" &&<div className="group">
                    <span>Customer Address:</span>
                    <span><b>{selectedBill.customerAddress}</b></span>
                </div>}
                { selectedBill.servicetType !== "-----" &&<div className="group">
                    <span>Order Type:</span>
                    <span><b>{selectedBill.servicetType}</b></span>
                </div>}
                { selectedBill.handler !== "-----" &&<div className="group">
                    <span>Order Handler:</span>
                    <span><b>{selectedBill.handler}</b></span>
                </div>}
                <div className="group">
                    <span>Payment Method:</span>
                    <span><b>{selectedBill.paymentMethod}</b></span>
                </div>
                <div className="group">
                    <span>Date Order:</span>
                    <span><b>{selectedBill.createdAt? new Date(selectedBill.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</b></span>
                </div>
            </div>
            
            <Table columns={columns} dataSource={selectedBill.cartItems} pagination={false} size="small" />

                <div className="footerCardTotal">
                {selectedBill.deliveryFee ?
                    <div className="group">
                        <p >Delivery Fee:</p>
                        <p><b className="total">+ Rs {selectedBill?.deliveryFee}</b></p>
                    </div>
                    :
                    <div className="group">
                        <p >Service Tax:</p>
                        <p><b className="total">+ {selectedBill?.serviceTax}%</b></p>
                    </div>
                }
                {selectedBill.perHead !==0 &&
                    <div className="group">
                        <p >Per Head ({selectedBill.perHead}):</p>
                        <p><b className="total">+ {selectedBill.perHead * 100}</b></p>
                    </div>
                }
                    <div className="group">
                        <p >Discount:</p>
                        <p><b className="total">- Rs {selectedBill.discount}</b></p>
                    </div>
                    <div className="group">
                        <p >Total:</p>
                        <p><b className="total">Rs {selectedBill.totalAmount}</b></p>
                    </div>
                </div>
                <div className="page-break"></div>
                {/* For Chef */}
            <div className="cardHeader">
                <h2 className="logo">For Chef &nbsp;&nbsp;&nbsp;&nbsp;  {selectedBill.orderNumber && <b className='order-number'>#{selectedBill.orderNumber}</b> } </h2>
            </div>  
            <Table columns={columns} dataSource={selectedBill.cartItems} pagination={false} size="small" />          
                
            </div>}

          <div className="bills-btn-add">
            <Button onClick={generateInvoiceClickHandle} htmlType='submit' className='add-new'>Generate Invoice</Button>
        </div>  
        </Modal>
    </div>
  )
}

export default Invoice