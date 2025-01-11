import { Select, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import ReactToPrint from 'react-to-print';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout'
import { baseUrl } from '../../utils/url';

const ServiceTaxCalc = () => {
    const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [fullBillsData, setFullBillsData] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Total Amount");
  const [serviceTaxAmount, setServiceTaxAmount] = useState(0);

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.get(`${baseUrl}/api/bills/getbills`);
      const filteredData = currentFilter(data)
      setBillsData(filteredData);
      serviceTaxAmountCalc(filteredData)
      setFullBillsData(filteredData);
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

  const serviceTaxAmountCalc = (invoicesArray)=>{
    // Calculate service tax
    let totalServiceTax = 0;
    for (let i = 0; i < invoicesArray.length; i++) {
        const element = invoicesArray[i];
        const percentage = (Number(element.subTotal) * (Number(element.serviceTax) / 100) + Number(element.subTotal));
        const amount = percentage - Number(element.subTotal);
        totalServiceTax += amount;
    }

    setServiceTaxAmount(totalServiceTax);
  }

  useEffect(() => {
      getAllBills();
  }, []);

  useEffect(() => {

    switch (selectedCategory) {
      case "All Invoices":
        serviceTaxAmountCalc(fullBillsData)
        return setBillsData(fullBillsData);

        case "Adnan":
            serviceTaxAmountCalc(fullBillsData.filter((obj) => (obj.handler.toLowerCase() === "adnan"))) 
        return setBillsData(fullBillsData.filter((obj) => (obj.handler.toLowerCase() === "adnan")));

      case "Sarfaraz":
        serviceTaxAmountCalc(fullBillsData.filter((obj) => (obj.handler.toLowerCase() === "sarfaraz"))) 
        return setBillsData(fullBillsData.filter((obj) => (obj.handler.toLowerCase() === "sarfaraz")));
    
      case "Mustafa":
        serviceTaxAmountCalc(fullBillsData.filter((obj) => (obj.handler.toLowerCase() === "mustafa"))) 
        return setBillsData(fullBillsData.filter((obj) => (obj.handler.toLowerCase() === "mustafa")));
      default:
        return;
    }
}, [selectedCategory]);

  const columns = [
    {
        title: "Date",
        dataIndex: "createdAt",
        render: ( date ) => new Date(date).toLocaleDateString('en-GB')
    },
    {
        title: "Customer Name",
        dataIndex: "customerName",
    }, 
    {
        title: "Contact Number",
        dataIndex: "customerPhone",
    }
    , 
    {
        title: "Customer Address",
        dataIndex: "customerAddress",
    }
  ]

  return (
    <Layout>
        <h2 style={{margin: 0}} >All Dinning Invoices  (9am to 3am) </h2>
        <div style={{display:"flex"}} >
                <Select
                className='service-calc-dropdown' 
                  placeholder="Search Via"
                  // defaultValue="Customer Name"
                  style={{ width: 200, marginLeft: 100 }}
                  onChange={(value) => setSelectedCategory(value)}
                >
                <Select.Option value="All Invoices">All Invoices</Select.Option>
                <Select.Option value="Adnan">Adnan</Select.Option>
                <Select.Option value="Sarfaraz">Sarfaraz</Select.Option>
                <Select.Option value="Mustafa">Mustafa</Select.Option>
              </Select>
              <p className='tax-calc-amnt' >{selectedCategory} &nbsp;&nbsp;&nbsp;&nbsp; Rs {serviceTaxAmount}/- </p>
      </div>
      <Table dataSource={billsData} columns={columns} bordered />
    </Layout>
  )
}

export default ServiceTaxCalc



const currentFilter = (invoiceArray)=>{

    const onlyDinningInvoices = invoiceArray.filter(
        obj => (obj.servicetType === "dinning" || obj.servicetType === "Dinning")
      );


    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const shopOpen = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9); // 9 AM today
    const shopClose = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 3); // 3 AM next day

    let filteredArray;

    if (now < shopOpen) {
        // Before 9 AM, filter from yesterday 9 AM to today 3 AM
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayShopOpen = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 9);

        filteredArray = onlyDinningInvoices.filter((obj) => {
            const createdAt = new Date(obj.createdAt);
            return createdAt >= yesterdayShopOpen && createdAt <= shopClose;
        });
    } else {
        // After 9 AM, filter from today 9 AM to now
        filteredArray = onlyDinningInvoices.filter((obj) => {
            const createdAt = new Date(obj.createdAt);
            return createdAt >= shopOpen && createdAt <= now;
        });
    }

    return filteredArray;
}