import * as Yup from 'yup'
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_FILE_SIZE_MB = 5
export const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one number, and one special character',
    ),
})

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
})
export const OtpvalidationSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be a 6-digit number'),
})

export const ProductRegistervalidationSchema = Yup.object().shape({
  productName: Yup.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters')
    .required('Product name is required'),

  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),

  category: Yup.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be less than 50 characters')
    .required('Category is required'),

  subCategory: Yup.string()
    .max(50, 'Subcategory must be less than 50 characters')
    .required('Category is required'),

  price: Yup.number()
    .positive('Price must be positive')
    .min(0.01, 'Price must be at least 0.01')
    .max(1000000, 'Price must be less than 1,000,000')
    .required('Price is required'),

  discount: Yup.number()
    .min(0, 'Discount cannot be negative')
    .max(99, 'Discount cannot be more than 99%'),

  quantity: Yup.number()
    .positive('Quantity must be positive')
    .min(0.1, 'Quantity must be at least 0.1')
    .required('Quantity is required'),

  unit: Yup.string()
    .oneOf(
      ['kg', 'g', 'piece', 'L', 'ml', 'box', 'pack', 'bottle', 'tablet', 'capsule'],
      'Please select a valid unit',
    )
    .required('Unit is required'),
  sizes: Yup.array()
    .of(Yup.string())
    .test('required-for-clothes', 'At least one size is required for Clothes', function (value) {
      const { category } = this.parent
      if (category === 'Clothes') {
        return Array.isArray(value) && value.length > 0
      }
      return true // Valid if not clothes
    }),

  stockQuantity: Yup.number()
    .integer('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative')
    .required('Stock quantity is required'),
  dimensions: Yup.object().shape({
    length: Yup.number()
      .positive('Length must be positive')
      .min(0.1, 'Length must be at least 0.1')
      .required('Length is required'),
    width: Yup.number()
      .positive('Width must be positive')
      .min(0.1, 'Width must be at least 0.1')
      .required('Width is required'),
    height: Yup.number()
      .positive('Height must be positive')
      .min(0.1, 'Height must be at least 0.1')
      .required('Height is required'),
    unit: Yup.string()
      .oneOf(['cm', 'm', 'inch', 'ft'], 'Please select a valid dimension unit')
      .required('Dimension unit is required'),
  }),
  productType: Yup.string()
    .required('Product type is required')
    .oneOf(['1', '2'], 'Product type must be either normal or digital'),
  isAvailable: Yup.boolean(),

  isCODAvailable: Yup.boolean(),

  tags: Yup.array().of(Yup.string().trim()).max(10, 'Maximum 10 tags allowed'),

  // TipTap HTML content validation
  highlights: Yup.string()
    .test('not-empty-html', 'Product highlights are required', function (value) {
      if (!value) return false
      // Remove HTML tags and check if there's actual content
      const textContent = value.replace(/<[^>]*>/g, '').trim()
      return textContent.length > 0
    })
    .test('max-length', 'Highlights content is too long', function (value) {
      if (!value) return true
      const textContent = value.replace(/<[^>]*>/g, '').trim()
      return textContent.length <= 2000
    }),

  overview: Yup.string()
    .test('not-empty-html', 'Product overview is required', function (value) {
      if (!value) return false
      const textContent = value.replace(/<[^>]*>/g, '').trim()
      return textContent.length > 0
    })
    .test('max-length', 'Overview content is too long', function (value) {
      if (!value) return true
      const textContent = value.replace(/<[^>]*>/g, '').trim()
      return textContent.length <= 5000
    }),

  specifications: Yup.string()
    .test('not-empty-html', 'Product specifications are required', function (value) {
      if (!value) return false
      const textContent = value.replace(/<[^>]*>/g, '').trim()
      return textContent.length > 0
    })
    .test('max-length', 'Specifications content is too long', function (value) {
      if (!value) return true
      const textContent = value.replace(/<[^>]*>/g, '').trim()
      return textContent.length <= 3000
    }),

  colors: Yup.array(),
})

export const ResetPasswordvalidationSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
})

export const ProfileUpdatevalidationSchema = Yup.object({
  businessName: Yup.string().required('Business name is required'),
  ownerName: Yup.string().required('Owner name is required'),
  commercialRegNo: Yup.string().required('Commercial Reg No. is required'),
  vatOrTaxId: Yup.string(),
  nationalIdNumber: Yup.string().required('National ID Number is required'),
  businessPhone: Yup.string().required('Business phone is required'),
  whatsappNumber: Yup.string(),
  category: Yup.array()
    .min(1, 'Select at least one category')
    .of(Yup.string().required('Category is required')),

  licenseDocument: Yup.mixed()
    .required('License document is required')
    .test('fileTypeOrURL', 'Only JPG, PNG, or PDF files are allowed', (value) => {
      if (typeof value === 'string') {
        // It's a URL — allow it
        return value.startsWith('http')
      }

      if (value instanceof File) {
        return SUPPORTED_FORMATS.includes(value.type)
      }

      return false
    })
    .test('fileSize', `File must be less than ${MAX_FILE_SIZE_MB}MB`, (value) => {
      if (typeof value === 'string') {
        // It's a URL — skip size check
        return true
      }

      if (value instanceof File) {
        return value.size <= MAX_FILE_SIZE_MB * 1024 * 1024
      }

      return false
    }),
  profilePicture: Yup.mixed()
    .test('fileTypeOrURL', 'Only image files are allowed (JPG, PNG, JPEG, etc.)', (value) => {
      if (!value) return true // Not required
      if (typeof value === 'string') return value.startsWith('http')
      if (value instanceof File) return value.type.startsWith('image/')
      return false
    })
    .test('fileSize', `Image must be less than ${MAX_FILE_SIZE_MB}MB`, (value) => {
      if (!value || typeof value === 'string') return true
      return value.size <= MAX_FILE_SIZE_MB * 1024 * 1024
    }),
  bankOrMobilePayInfo: Yup.string(),
})

export const AdsValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  category: Yup.string()
    .oneOf(['real-estate', 'car', 'used items'])
    .required('Category is required'),
  details: Yup.string()
    .max(1000, 'Details cannot exceed 1000 characters')
    .required('Details are required'),
  price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
  discountedPrice: Yup.number().min(0, 'Price must be positive').required('Price is required'),
  priceType: Yup.string()
    .oneOf(['fixed', 'monthly', 'yearly', 'daily'], 'Please select a valid price type')
    .required('Price type is required'),

  type: Yup.string().oneOf(['rent', 'sale']).required('Type is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'End must be after start')
    .required('End date is required'),
})
