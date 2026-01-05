import React from 'react'
import { CSpinner } from '@coreui/react'
import Lottie from 'lottie-react'
import animationData from '../../assets/shopping_cart.json'
const Loader = () => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // semi-transparent
        backdropFilter: 'blur(4px)', // blur effect
        WebkitBackdropFilter: 'blur(4px)', // Safari support
        zIndex: 9999,
      }}
    >
      <div style={{ width: 100, height: 100 }}>
        <Lottie animationData={animationData} loop={true} autoplay={true} />
      </div>
    </div>
  )
}

export default Loader
