export const role = 2
export const PERMISSOINS = {
  MANAGE_PARAMETER: 'manage_parameter',
  MANAGE_JOB_RUN: 'manage_job_run',
  ACCESS_AUDIT_LOGS: 'access_audit_logs',
  MANGE_STAFF_USER: 'mange_staff_user',
  ACCESS_METRICS: 'access_metrics',
  MANAGE_ACCOUNT_DETAILS: 'manage_account_details',
}
export const ROLE_NAMES = {
  1: 'Customer',
  2: 'Vendor',
  3: 'Driver',
  10: 'Admin',
  11: 'City Manager',
  12: 'Support',
}
export const POST_TYPE = {
  NEWS_FEED: 'news',
  STOCK_FEED: 'stock',
}

export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  COUNTY_CODE_PHONE: /^\+?[1-9]\d{0,2} ?\d{10}$/,
}
export const IMAGE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES_PER_COLOR: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
}

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must be less than ${max} characters`,
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_NUMBER: 'Please enter a valid number',
  MIN_VALUE: (min) => `Value must be at least ${min}`,
  MAX_VALUE: (max) => `Value must be less than ${max}`,
  FILE_TOO_LARGE: 'File size is too large',
  INVALID_FILE_TYPE: 'Invalid file type',
}
export const categories = [
  {
    name: 'Paramedical',
    subcategories: [
      'First Aid',
      'Pain Relief',
      'Orthopaedic Supports',
      'Thermometers & Devices',
      'Health Supplements',
      'Diabetes Care',
      'Respiratory Devices',
      'Mobility Aids',
      'Skin Treatments',
    ],
  },
  {
    name: 'Grocery',
    subcategories: [
      'Fruits & Vegetables',
      'Dairy & Bakery',
      'Snacks & Branded Foods',
      'Beverages',
      'Staples',
      'Household Essentials',
      'Personal Care',
      'Baby Care',
      'Instant & Frozen Food',
      'Dry Fruits & Nuts',
      'Cleaning Supplies',
    ],
  },
  {
    name: 'Clothes',
    subcategories: [
      "Men's Clothing",
      "Women's Clothing",
      "Kids' Clothing",
      'T-Shirts & Polos',
      'Shirts',
      'Jeans & Trousers',
      'Shorts & Track Pants',
      'Ethnic Wear',
      'Winter Wear',
      'Innerwear & Sleepwear',
      'Sportswear',
      'Dresses & Skirts',
      'Sarees & Kurtis',
      'Jackets & Coats',
      'Sweaters & Hoodies',
      'Suits & Blazers',
      'Maternity Wear',
      'Accessories (Belts, Ties, Scarves)',
      'Rainwear',
    ],
  },
]
export const daysOfWeek = [
  { key: 'Monday', label: 'Monday' },
  { key: 'Tuesday', label: 'Tuesday' },
  { key: 'Wednesday', label: 'Wednesday' },
  { key: 'Thursday', label: 'Thursday' },
  { key: 'Friday', label: 'Friday' },
  { key: 'Saturday', label: 'Saturday' },
  { key: 'Sunday', label: 'Sunday' },
]
export const CATEGORY_OPTIONS = [
  'Food & Beverage',
  'Clothing & Accessories',
  'Electronics & Mobile Phones',
  'Home Appliances & Furniture',
  'Health & Beauty',
  'Pharmacy & Medical Supplies',
  'Books & Stationery',
  'Construction Materials & Tools',
  'Automotive & Spare Parts',
  'Supermarkets & Groceries',
  'Handicrafts & Traditional Goods',
  'Tailoring & Textiles',
  'IT & Computer Services',
  'Agricultural Products',
  'Hardware & Electrical Supplies',
  'Bakery & Sweets',
  'Restaurants & Cafes',
  'Gold & Jewelry',
  'Laundry & Cleaning Services',
  'Other',
]
export const DEFAULT_PRODUCT_VALUES = {
  productName: '',
  description: '',
  category: '',
  subCategory: '',
  price: '',
  discount: '',
  quantity: '',
  unit: '',
  sizes: [],
  stockQuantity: '',
  isAvailable: true,
  isCODAvailable: false,
  tags: [],
  colors: [],
  dimensions: {
    length: '',
    width: '',
    height: '',
    unit: '',
  },
  highlights: '',
  overview: '',
  specifications: '',
}

// Predefined color options for products
export const PREDEFINED_COLORS = [
  { name: 'Red', code: '#FF0000' },
  { name: 'Blue', code: '#0000FF' },
  { name: 'Green', code: '#008000' },
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#FFFFFF' },
  { name: 'Yellow', code: '#FFFF00' },
  { name: 'Orange', code: '#FFA500' },
  { name: 'Purple', code: '#800080' },
  { name: 'Pink', code: '#FFC0CB' },
  { name: 'Brown', code: '#A52A2A' },
  { name: 'Gray', code: '#808080' },
  { name: 'Navy', code: '#000080' },
  { name: 'Maroon', code: '#800000' },
  { name: 'Olive', code: '#808000' },
  { name: 'Lime', code: '#00FF00' },
  { name: 'Aqua', code: '#00FFFF' },
  { name: 'Teal', code: '#008080' },
  { name: 'Silver', code: '#C0C0C0' },
  { name: 'Fuchsia', code: '#FF00FF' },
  { name: 'Gold', code: '#FFD700' },
]
export const UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'piece', label: 'Piece' },
  { value: 'L', label: 'Liter (L)' },
  { value: 'ml', label: 'Milliliter (ml)' },
  { value: 'box', label: 'Box' },
  { value: 'pack', label: 'Pack' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'capsule', label: 'Capsule' },
]
export const CLOTHING_SIZES = [
  { value: 'XS', label: 'Extra Small (XS)' },
  { value: 'S', label: 'Small (S)' },
  { value: 'M', label: 'Medium (M)' },
  { value: 'L', label: 'Large (L)' },
  { value: 'XL', label: 'Extra Large (XL)' },
  { value: 'XXL', label: 'Double XL (XXL)' },
  { value: 'XXXL', label: 'Triple XL (XXXL)' },
  { value: '28', label: '28' },
  { value: '30', label: '30' },
  { value: '32', label: '32' },
  { value: '34', label: '34' },
  { value: '36', label: '36' },
  { value: '38', label: '38' },
  { value: '40', label: '40' },
  { value: '42', label: '42' },
  { value: '44', label: '44' },
  { value: '46', label: '46' },
  { value: 'Free Size', label: 'Free Size' },
]
export const requiresSize = (categoryName) => {
  return categoryName === 'Clothes'
}
export const requiresQuantityUnit = (categoryName) => {
  return categoryName !== 'Clothes'
}
