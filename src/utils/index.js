import moment from 'moment' // core
import 'moment-timezone'

export function localDateFormat(datetime, format = 'YYYY-MM-DD HH:mm') {
  const localTime = moment.utc(datetime).local() // Convert from UTC to local
  return localTime.format(format) // Format the local time using the specified format
}

export function localTimeFormat(datetime) {
  return moment.utc(datetime).local().format('HH:mm') // Convert from UTC → local, then format
}

export function convertLocalTimeToIOS(timeStr) {
  if (!timeStr) return null

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone // e.g., 'Asia/Kolkata'

  const localMoment = moment.tz(`1970-01-01T${timeStr}`, timezone)

  return localMoment.format() // Return ISO string that keeps 09:00 but appends "+05:30", etc.
}

export const toTitleCase = (str) => {
  return str
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
export async function getCurrencySymbolByLocation() {
  try {
    // Step 1: Get user location data
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()

    const currencyCode = data.currency // e.g., "INR", "XOF"
    const countryCode = data.country_code // e.g., "IN", "FR"

    // Step 2: Try to format a currency to extract symbol
    const formatted = new Intl.NumberFormat(countryCode, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(1)

    const symbol = formatted.replace(/\d+/g, '').trim()

    // Step 3: Fallback logic
    if (!symbol || symbol.toUpperCase() === currencyCode.toUpperCase()) {
      return currencyCode // fallback to code
    }

    return symbol
  } catch (error) {
    console.error('Error getting currency symbol:', error)
    return 'USD' // Fallback default
  }
}
