import prisma from './prisma'

export async function getLatestExchangeRate(
  tenantId: string,
  fromCurrency: string = 'USD',
  toCurrency: string = 'PYG'
): Promise<number> {
  const rate = await prisma.exchangeRate.findFirst({
    where: {
      tenantId,
      fromCurrency,
      toCurrency,
    },
    orderBy: {
      date: 'desc',
    },
  })

  return rate?.rate || 1
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  tenantId: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const rate = await getLatestExchangeRate(tenantId, fromCurrency, toCurrency)
  return amount * rate
}

export function formatCurrency(amount: number, currency: string): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  } else if (currency === 'PYG') {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return amount.toString()
}
