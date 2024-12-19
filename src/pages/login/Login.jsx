import { Button, Form, Input, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlerSubmit = async (value) => {
    //console.log(value);

    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.post('https://pos-admin-backend.vercel.app/api/users/checkusers', value);
      // console.log(data);
      dispatch({
        type: "HIDE_LOADING", 
      });
      
      if (data.verification_code === 0) {
        return message.error(data.message);
      } else if (data.verification_code === 2) {
        return message.warning(data.message);
      }else if (data.verification_code === 1){
        localStorage.setItem('user', data.userData.email);
        message.success(data.message);
        const response = await axios.post('https://pos-client-backend-oy6t.vercel.app/api/userAuth/addUser', {userData: data.userData})
        if (response.status === 200) {
          return navigate("/");
        }
      }

    } catch(error) {
      if(error.response.status === 404){
        message.error("User Not Found, Please Contact with Admin");
        return;
      }
      dispatch({
        type: "HIDE_LOADING",
      });
      message.error("Try Again Some thing went wrong!");
      console.log(error);
    }
  }

  useEffect(() => {
    const storage = localStorage.getItem('user');
    if(storage) {
      navigate("/");
    }
    
  }, [navigate]);

  return (
    <div className='form'>
        <h2>POS SYSTEM</h2>
        <p>Login</p>
        <div className="form-group">
          <Form layout='vertical' onFinish={handlerSubmit}>
            {/* <FormItem name="userName" label="User Name" >
              <Input placeholder='User Name' required/>
            </FormItem> */}
            <FormItem name="email" label="Email Address" >
              <Input placeholder='Enter Email Address' type="email" required/>
            </FormItem>
            <FormItem name="password" label="Password" >
              <Input type="password" placeholder='Enter Password' required/>
            </FormItem>
            <div className="form-btn-add">
              <Button htmlType='submit' className='add-new'>Login</Button>
            </div>
          </Form>
        </div>
    </div>
  )
}

export default Login
