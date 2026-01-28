import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CCloseButton, CSidebar, CSidebarBrand, CSidebarFooter, CSidebarHeader, CSidebarToggler,} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'
import { set } from '../redux/slice/uiSlice'
import { useTranslation } from 'react-i18next'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state: any) => state.ui.sidebarUnfoldable)
  const sidebarShow = useSelector((state: any) => state.ui.sidebarShow)
  const { t } = useTranslation('dashboard')

  return (
    <CSidebar className="app-sidebar border-end" colorScheme="dark" position="fixed" unfoldable={unfoldable} visible={sidebarShow} onVisibleChange={(visible) => dispatch(set({ sidebarShow: visible }))}>
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand className="w-100 sidebar-brand" to="/dashboard">
          <img src="/logo.svg" alt="Logo" className="sidebar-brand-full"/>
          <img src="/x.png" alt="Logo" className="sidebar-brand-narrow"/>
        </CSidebarBrand>
        <CCloseButton className="d-lg-none" dark onClick={() => dispatch(set({ sidebarShow: false }))}/>
      </CSidebarHeader>
      <AppSidebarNav items={navigation(t)} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={() => dispatch(set({ sidebarUnfoldable: !unfoldable }))}/>
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
