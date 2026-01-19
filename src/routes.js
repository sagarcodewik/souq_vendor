import React from 'react'
import ResetPasswordProtectedRoute from './layout/ResetPasswordProtectedRoute'
import BoostDetails from './views/pages/Boost/BoostDetails'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Theme
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))
const New_boost = React.lazy(() => import('./views/pages/boosts/New_boost'))
const Update_boost = React.lazy(() => import('./views/pages/boosts/Update_boost'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

// Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

// Charts
const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

// Widgets
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

// Optional error/fallback pages
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
//pages
const Products = React.lazy(() => import('./views/pages/products/Products'))
const new_product = React.lazy(() => import('./views/pages/new-product/new-product'))
const Profile = React.lazy(() => import('./views/pages/profile/Profile'))
const Coming_soon = React.lazy(() => import('./views/pages/coming_soon/Coming_soon'))
const EditProduct = React.lazy(() => import('./views/pages/EditProduct/EditProduct'))
const ProfileUpdate = React.lazy(() => import('./views/pages/updateProfile/UpdateProfile'))
const OrderRequest = React.lazy(() => import('./views/pages/orderRequest/OrderRequest'))
const Order = React.lazy(() => import('./views/pages/order/Order'))
const Review = React.lazy(() => import('./views/pages/review/Review'))
const Promotion = React.lazy(() => import('./views/pages/promotion/Promotion'))
const New_promotion = React.lazy(() => import('./views/pages/new_promotion/New_promotion'))
const Update_promotion = React.lazy(() => import('./views/pages/update_promotion/Update_promotion'))
const Return_order = React.lazy(() => import('./views/pages/return_order/Return_order'))
const ChatPage = React.lazy(() => import('./views/pages/chat/Chat'))
const Report = React.lazy(() => import('./views/pages/report/Report'))
const UpgradeToPremium = React.lazy(() => import('./views/pages/premiumSection/UpgradeToPremium'))
const CustomerChats = React.lazy(() => import('./views/pages/CustomerChats/Chats'))
const DriverChats = React.lazy(() => import('./views/pages/DriverChats/Chats'))
const OrderChats = React.lazy(() => import('./views/pages/OrderChats/Chats'))
const OrderChat = React.lazy(() => import('./views/pages/OrderChat/Chat'))
const Finance = React.lazy(() => import('./views/pages/finances/finance'))
// Route definitions
const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/products', name: 'Products', element: Products },
  { path: '/products/new-product', name: 'New Product', element: new_product },
  { path: '/dashboard/profile', name: 'Profile', element: Profile },
  { path: '/orders', name: 'Orders', element: Order },
  { path: '/reviews', name: 'Reviews', element: Coming_soon },
  { path: '/products/edit', name: 'Edit Product', element: EditProduct },
  { path: '/products/review', name: 'Review', element: Review },
  {
    path: '/dashboard/profile/profile-update',
    name: 'Profile Update',
    element: ProfileUpdate,
  },
  { path: '/dashboard/profile/upgrade', name: 'Upgrade To Premium', element: UpgradeToPremium },
  { path: '/order-request', name: 'Order Request', element: OrderRequest },
  { path: '/boosts', name: 'Boosts', element: BoostDetails },
  { path: '/boosts/create', name: 'Create Boost', element: New_boost },
  { path: '/boosts/update', name: 'Create Boost', element: Update_boost },
  { path: '/promotions', name: 'Promotions', element: Promotion },
  { path: '/promotions/create', name: 'Create Promotion', element: New_promotion },
  { path: '/promotions/update', name: 'Update Promotion', element: Update_promotion },
  { path: '/dashboard/return-order', name: 'Return Order', element: Return_order },
  { path: '/dashboard/chat', name: 'Chat', element: ChatPage },
  { path: '/sale-report', name: 'Sale Report', element: Report },
  { path: '/orders/order-chat', name: 'Order Chat', element: OrderChat },
  {
    path: '/customer-chats',
    name: 'Customer Chats',
    element: CustomerChats,
  },
  {
    path: '/driver-chats',
    name: 'Driver Chats',
    element: DriverChats,
  },
  {
    path: '/order-chats',
    name: 'Order Chats',
    element: OrderChats,
  },
  {
    path: '/finances',
    name: 'Finance',
    element: Finance,
  },
  // Theme
  { path: '/theme', name: 'Theme', exact: true, element: Colors },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },

  // Base
  { path: '/base', name: 'Base', exact: true, element: Cards },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },

  // Buttons
  { path: '/buttons', name: 'Buttons', exact: true, element: Buttons },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },

  // Forms
  { path: '/forms', name: 'Forms', exact: true, element: FormControl },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },

  // Charts
  { path: '/charts', name: 'Charts', element: Charts },

  // Icons
  { path: '/icons', name: 'Icons', exact: true, element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },

  // Notifications
  { path: '/notifications', name: 'Notifications', exact: true, element: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },

  // Widgets
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes

