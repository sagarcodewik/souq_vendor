import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 justify-content-center text-center">
      <div>
        <b>© {new Date().getFullYear()} Dual_App Marketplace. All rights reserved.</b>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
