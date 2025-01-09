import React, { useState } from 'react';
import axios from 'axios';
import { LogoutOutlined } from '@ant-design/icons';
import { Modal, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../utils/url';
import Cookies from 'js-cookie';

function Logout({ collapsed }) {
    const [logoutModal, setLogoutModal] = useState(false)
    const navigate = useNavigate();

  const handlerLogout = async () => {
    // const userEmail = localStorage.getItem('user');
    Cookies.remove('session');
    navigate("/login");

    // try {
    //   const {data} = await axios.post(`https://pos-admin-backend.vercel.app/api/users/userlogout/${userEmail}`);
    //   await axios.delete(`${baseUrl}/api/userAuth/deleteUser/${userEmail}`)
    //   if (data === "User is not valid by admin") {
    //     localStorage.removeItem("user");
    //     message.error("This account is not valid by Admin");
    //     navigate("/login");
    //   }else if(data === "User Logout"){
    //     localStorage.removeItem("user");
    //     message.success("Logout successFully");
    //     navigate("/login");
    //   };
    // } catch (error) {
    //   message.error("Check your Internet Connection!");
    // }
  };

  return (
    <div>
        <LogoutOutlined style={{ color: '#001e28', margin: "15px 60px 0px 0px"}} onClick={()=> setLogoutModal(true) } />

      <Modal title="Logout" visible={logoutModal} onCancel={() => setLogoutModal(false) } footer={false}>
          <h3 style={{marginBottom: 50}}>Are you sure to logout</h3>
            <div style={{display: "flex"}}>
                <Button className='cancel-category' onClick={()=>{ setLogoutModal(false)}}>Cancel</Button>
                <Button className='logout-confirm' onClick={()=>{  setLogoutModal(false); handlerLogout()  }}>Logout</Button>
            </div>
      </Modal>
    </div>
  );
}

export default Logout;
