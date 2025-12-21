// Mock data for dashboard

export const salesMetrics = [
  {
    id: '1',
    title: 'Total Sales',
    value: '$1k',
    change: 8,
    changeLabel: 'from yesterday',
    icon: 'ShoppingBag',
    color: 'pink'
  },
  {
    id: '2',
    title: 'Total Order',
    value: '300',
    change: 5,
    changeLabel: 'from yesterday',
    icon: 'Receipt',
    color: 'orange'
  },
  {
    id: '3',
    title: 'Product Sold',
    value: '5',
    change: 12,
    changeLabel: 'from yesterday',
    icon: 'CheckCircle',
    color: 'green'
  },
  {
    id: '4',
    title: 'New Customers',
    value: '8',
    change: 0.5,
    changeLabel: 'from yesterday',
    icon: 'UserPlus',
    color: 'purple'
  }
]

export const visitorInsightsData = [
  { month: 'Jan', loyal: 200, new: 150, unique: 180 },
  { month: 'Feb', loyal: 250, new: 180, unique: 200 },
  { month: 'Mar', loyal: 300, new: 220, unique: 250 },
  { month: 'Apr', loyal: 280, new: 200, unique: 230 },
  { month: 'May', loyal: 350, new: 280, unique: 300 },
  { month: 'Jun', loyal: 400, new: 320, unique: 350 },
  { month: 'Jul', loyal: 380, new: 300, unique: 330 },
  { month: 'Aug', loyal: 420, new: 350, unique: 380 },
  { month: 'Sept', loyal: 450, new: 380, unique: 400 },
  { month: 'Oct', loyal: 480, new: 400, unique: 430 },
  { month: 'Nov', loyal: 500, new: 420, unique: 450 },
  { month: 'Dec', loyal: 520, new: 450, unique: 480 }
]

export const revenueData = [
  { day: 'Monday', online: 15000, offline: 12000 },
  { day: 'Tuesday', online: 18000, offline: 14000 },
  { day: 'Wednesday', online: 22000, offline: 16000 },
  { day: 'Thursday', online: 19000, offline: 15000 },
  { day: 'Friday', online: 21000, offline: 17000 },
  { day: 'Saturday', online: 24000, offline: 20000 },
  { day: 'Sunday', online: 25000, offline: 22000 }
]

export const satisfactionData = [
  { month: 'Jan', lastMonth: 3004, thisMonth: 3500 },
  { month: 'Feb', lastMonth: 3200, thisMonth: 3800 },
  { month: 'Mar', lastMonth: 3100, thisMonth: 3600 },
  { month: 'Apr', lastMonth: 3300, thisMonth: 4000 },
  { month: 'May', lastMonth: 3400, thisMonth: 4200 },
  { month: 'Jun', lastMonth: 3600, thisMonth: 4504 }
]

export const targetVsRealityData = [
  { month: 'Jan', reality: 8000, target: 10000 },
  { month: 'Feb', reality: 9000, target: 11000 },
  { month: 'Mar', reality: 8500, target: 10500 },
  { month: 'Apr', reality: 9500, target: 11500 },
  { month: 'May', reality: 10000, target: 12000 },
  { month: 'June', reality: 11000, target: 12122 }
]

export const topProducts = [
  { rank: 1, name: 'Home Decor Range', popularity: 45, sales: 45 },
  { rank: 2, name: 'Disney Princess Pink Bag 18\'', popularity: 29, sales: 29 },
  { rank: 3, name: 'Bathroom Essentials', popularity: 18, sales: 18 },
  { rank: 4, name: 'Apple Smartwatches', popularity: 25, sales: 25 }
]

export const volumeServiceData = [
  { month: 'Jan', volume: 800, services: 400 },
  { month: 'Feb', volume: 900, services: 450 },
  { month: 'Mar', volume: 850, services: 420 },
  { month: 'Apr', volume: 950, services: 480 },
  { month: 'May', volume: 1000, services: 550 },
  { month: 'June', volume: 1125, services: 635 }
]