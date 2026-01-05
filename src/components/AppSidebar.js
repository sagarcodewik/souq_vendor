import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { logo } from '../assets/brand/logo'
import { sygnet } from '../assets/brand/sygnet'
import navigation from '../_nav'
import { set } from '../redux/slice/uiSlice' // 👈 import the `set` action from uiSlice
import { Link } from 'react-router-dom'
const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable) // 👈 use `state.ui`
  const sidebarShow = useSelector((state) => state.ui.sidebarShow) // 👈 use `state.ui`

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(set({ sidebarShow: visible })) // 👈 use `set` action
      }}
      // style={{ backgroundColor: '#103033' }}
    >
      <CSidebarHeader className="border-bottom">
        <Link to="/dashboard" className="text-decoration-none">
          <CSidebarBrand>
            <img src="/logo.png" alt="Logo" className="sidebar-brand-full" height={32} width={90} />
            <img src="/x.png" alt="Logo" className="sidebar-brand-narrow" height={32} width={40} />
            {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
          </CSidebarBrand>
        </Link>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(set({ sidebarShow: false }))} // 👈 use `set` action
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch(set({ sidebarUnfoldable: !unfoldable }))} // 👈 use `set` action
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
