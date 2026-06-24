export const products = [
  { id: 1,  name: 'Minimal Desk Lamp',     price: 49,  category: 'Home',       rating: 4.5, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80', badge: 'New' },
  { id: 2,  name: 'Leather Notebook',      price: 29,  category: 'Stationery', rating: 4.8, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80', badge: 'New'},
  { id: 3,  name: 'Ceramic Mug Set',       price: 35,  category: 'Home',       rating: 4.6, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80' },
  { id: 4,  name: 'Canvas Tote Bag',       price: 22,  category: 'Bags',       rating: 4.3, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80', badge: 'Sale' },
  { id: 5,  name: 'Wooden Coasters',       price: 18,  category: 'Home',       rating: 4.4, image: 'https://images.unsplash.com/photo-1650476524564-f94dc9669067?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
  { id: 6,  name: 'Wireless Earbuds',      price: 89,  category: 'Tech',       rating: 4.7, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80', badge: 'New' },
  { id: 7,  name: 'Plant Pot Trio',        price: 42,  category: 'Home',       rating: 4.5, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80' },
  { id: 8,  name: 'Bamboo Pen Holder',     price: 15,  category: 'Stationery', rating: 4.2, image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80' , badge:'New' },
  { id: 9,  name: 'Linen Cushion Cover',   price: 28,  category: 'Home',       rating: 4.6, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80'  , badge:'New' },
  { id: 10, name: 'Portable Charger',      price: 55,  category: 'Tech',       rating: 4.8, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hhcmdlcnxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 11, name: 'Glass Water Bottle',    price: 24,  category: 'Home',       rating: 4.5, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80', badge: 'Sale' },
  { id: 12, name: 'Scented Candle',        price: 20,  category: 'Home',       rating: 4.7, image: 'https://images.unsplash.com/photo-1612293905607-b003de9e54fb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
]

export const categories = ['All', ...new Set(products.map(p => p.category))]