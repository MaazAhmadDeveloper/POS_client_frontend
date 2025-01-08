import { Select, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { EyeOutlined, PrinterOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout'
import Invoice from './Invoice';

const InvoicesRoute = () => {
    const dispatch = useDispatch();
    const componentRef = useRef();
  const [billsData, setBillsData] = useState([]);
  const [fullBillsData, setFullBillsData] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Bill NO");
  const [shouldPrint, setShouldPrint] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.get('https://pos-client-backend-oy6t.vercel.app/api/bills/getbills');
      setBillsData(data);
      setFullBillsData(data);
      console.log(data);
      dispatch({
        type: "HIDE_LOADING",
      });
      // console.log(data);

    } catch(error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      console.log(error);
    }
  };

  useEffect(() => {
      getAllBills();
  }, []);

  useEffect(() => {
    if (shouldPrint && selectedBill) {
        handlePrint();
        setShouldPrint(false); // Reset flag after printing
    }
}, [selectedBill, shouldPrint]);

    const handlePrintClick = (record) => {
        setSelectedBill(record); // Update selectedBill
        setShouldPrint(true);   // Set flag to trigger print
    };
  useEffect(() => {

    switch (selectedCategory) {
      case "Bill NO":
        return setBillsData(fullBillsData.filter((obj) => (obj.billNumber.toString().includes(searchInputValue))));
        // return setBillsData(fullBillsData.filter((obj) => (obj.totalAmount.toString().toLowerCase().includes(searchInputValue.toLowerCase()))));
    
      case "Customer Name":
        return setBillsData(fullBillsData.filter((obj) => (obj.customerName.toString().toLowerCase().includes(searchInputValue.toLowerCase()))));
    
      case "Date":
        return setBillsData(fullBillsData.filter((obj) => (new Date(obj.createdAt).toLocaleDateString('en-GB').includes(searchInputValue.toLowerCase()))));
    
      case "Contact Number":
        return setBillsData(fullBillsData.filter((obj) => (obj.customerPhone.toString().includes(searchInputValue))));
    
      case "Customer Address":
        return setBillsData(fullBillsData.filter((obj) => (obj.customerAddress.toString().toLowerCase().includes(searchInputValue.toLowerCase()))));
    
      case "Total Amount":
        return setBillsData(fullBillsData.filter((obj) => (obj.totalAmount.toString().includes(searchInputValue))));
    
      default:
        return;
    }
}, [searchInputValue]);

  const columns = [
    {
      title: "Bill N0.",
      dataIndex: "billNumber"
    },
    {
        title: "Date",
        dataIndex: "createdAt",
        render: ( date ) => new Date(date).toLocaleDateString('en-GB')
    },
    {
        title: "Customer Name",
        dataIndex: "customerName",
    }, 
    // {
    //     title: "Contact Number",
    //     dataIndex: "customerPhone",
    // }
    // , 
    // {
    //     title: "Customer Address",
    //     dataIndex: "customerAddress",
    // },
    {
        title: "Sub Total",
        dataIndex: "subTotal",
    },
    {
        title: "Discount",
        dataIndex: "discount",
    },
    {
        title: "Total Amount",
        dataIndex: "totalAmount",
    },
    {
        title: "Action",
        dataIndex: "_id",
        render:(id, record) => 
        <div style={{display:"flex", justifyContent: " space-around"}}>
          <EyeOutlined className='cart-edit eye' onClick={() => {setSelectedBill(record); setPopModal(true);}} />
          <PrinterOutlined className='cart-edit eye' onClick={() => {handlePrintClick(record);}} />
        </div>
        
    }
  ]
  const printColumns = [
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
  return (
    <Layout>
        <h2 style={{margin: 0}} >All Invoice </h2>
        <div className="searchInput">
            <input 
              className='searchInputProduct' 
              type="text" 
              onChange={ e => setSearchInputValue(e.target.value) }
              value={searchInputValue}
              placeholder= {selectedCategory === "Date" ? "DD/MM/YYYY" :  'Search Product' }
              />
                <Select
                  placeholder="Search Via"
                  // defaultValue="Bill No."
                  style={{ width: 200, marginLeft: 100 }}
                  onChange={(value) => setSelectedCategory(value)}
                >
                <Select.Option value="Bill NO">Bill N0.</Select.Option>
                <Select.Option value="Customer Name">Customer Name</Select.Option>
                <Select.Option value="Date">Date</Select.Option>
                <Select.Option value="Contact Number">Contact Number</Select.Option>
                <Select.Option value="Customer Address">Customer Address</Select.Option>
                <Select.Option value="Total Amount">Total Amount</Select.Option>
              </Select>
      </div>
      <Table dataSource={billsData} columns={columns} bordered />
      
      { 
        popModal 
          && <Invoice 
          selectedBill={selectedBill}
          popModal={popModal}
          setPopModal={setPopModal}
            /> 
          }
          <div style={{position:"absolute", left:-999912}}>
        <div className="card" ref={componentRef}>
            <div className="cardHeader">
                <h2 className="logo">Karachi Fresh Juice</h2>
                <span><b>0300-079-0979</b></span>
                <span><b>Baldia road, Baldia Plaza Bahawalnagar</b></span>
            </div>
            <div className="cardBody">
                {/* <div className="group">
                    <span>Bill Number:</span>
                    <span><b>{selectedBill?.billNumber}</b></span>
                </div> */}
                { selectedBill?.customerName !== "-----" && <div className="group">
                    <span>Customer Name:</span>
                    <span><b>{selectedBill?.customerName}</b></span>
                </div>}
                { selectedBill?.customerPhone !== "-----" &&<div className="group">
                    <span>Customer Phone:</span>
                    <span><b>{selectedBill?.customerPhone}</b></span>
                </div>}
                { selectedBill?.customerAddress !== "-----" &&<div className="group">
                    <span>Customer Address:</span>
                    <span><b>{selectedBill?.customerAddress}</b></span>
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
                    <span><b>{selectedBill?.paymentMethod}</b></span>
                </div>
                <div className="group">
                    <span>Date Order:</span>
                    <span><b>{selectedBill?.createdAt? new Date(selectedBill?.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</b></span>
                </div>
            </div>
            
                <h4 className="YourOrderText">Your Order</h4>
            <Table columns={printColumns} dataSource={selectedBill?.cartItems} pagination={false} size="small" />

                <div className="footerCardTotal">
                    <div className="group">
                        <p >Service Tax:</p>
                        <p><b className="total">+ {selectedBill?.serviceTax}%</b></p>
                    </div>
                    <div className="group">
                        <h3 >Discount:</h3>
                        <h3><b className="total">- Rs {selectedBill?.discount}</b></h3>
                    </div>
                    <div className="group">
                        <h3 >Total:</h3>
                        <h3><b className="total">Rs {selectedBill?.totalAmount}</b></h3>
                    </div>
                </div>
                <div className="footerThanks">
                    <span>Thank You for buying from us</span>
                </div>
                
                {/* For shop */}
            {/* <div className="cardHeader">
                <h2 className="logo">For Shop</h2>

            </div>
            <div className="cardBody">
            <div className="group">
                    <span>Bill Number:</span>
                    <span><b>{selectedBill?.billNumber}</b></span>
                </div>
            { selectedBill?.customerName !== "-----" && <div className="group">
                    <span>Customer Name:</span>
                    <span><b>{selectedBill?.customerName}</b></span>
                </div>}
                { selectedBill?.customerPhone !== "-----" &&<div className="group">
                    <span>Customer Phone:</span>
                    <span><b>{selectedBill?.customerPhone}</b></span>
                </div>}
                { selectedBill?.customerAddress !== "-----" &&<div className="group">
                    <span>Customer Address:</span>
                    <span><b>{selectedBill?.customerAddress}</b></span>
                </div>}
                { selectedBill?.servicetType !== "-----" &&<div className="group">
                    <span>Customer Address:</span>
                    <span><b>{selectedBill?.servicetType}</b></span>
                </div>}
                { selectedBill?.handler !== "-----" &&<div className="group">
                    <span>Customer Address:</span>
                    <span><b>{selectedBill?.handler}</b></span>
                </div>}
                <div className="group">
                    <span>Payment Method:</span>
                    <span><b>{selectedBill?.paymentMethod}</b></span>
                </div>
                <div className="group">
                    <span>Date Order:</span>
                    <span><b>{selectedBill?.createdAt? new Date(selectedBill?.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</b></span>
                </div>
            </div>
            
                <h4 className="YourOrderText">Order Number: {selectedBill?.orderNumber}</h4>
            <Table columns={printColumns} dataSource={selectedBill?.cartItems} pagination={false} size="small" />

                <div className="footerCardTotal">
                    <div className="group">
                        <h3 >Discount:</h3>
                        <h3><b className="total">- Rs {selectedBill?.discount}</b></h3>
                    </div>
                    <div className="group">
                        <h3 >Total:</h3>
                        <h3><b className="total">Rs {selectedBill?.totalAmount}</b></h3>
                    </div>
                </div> */}
            
                {/* For Chef */}
            {/* <div className="cardHeader">
                <h2 className="logo">For Chef</h2>
            </div>  
            <h4 className="YourOrderText">Order Number: {selectedBill?.orderNumber}</h4>
            <Table columns={printColumns} dataSource={selectedBill?.cartItems} pagination={false} size="small" />          
                 */}
            </div>
            </div>
    </Layout>
  )
}

export default InvoicesRoute
