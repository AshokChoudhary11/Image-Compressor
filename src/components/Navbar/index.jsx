import React from 'react'
import "./index.css"

const index = () => {
  return (
    <div className='navbar_wrapper'>
        <div className='logo'>ImageResizer</div>
        <div className='button_wrapper'>
            <button className="loginButton">Login</button>
            <button className="loginButton">SignUp</button>
        </div>
    </div>
  )
}

export default index