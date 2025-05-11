export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  gender: 'men' | 'women' | 'unisex';
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  featured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
}

const products: Product[] = [
  {
    id: "1",
    name: "Classic Cotton T-Shirt",
    description: "A comfortable and versatile t-shirt made from premium cotton. Perfect for everyday wear.",
    price: 29.99,
    category: "t-shirts",
    gender: "unisex",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Navy", hex: "#0a142e" }
    ],
    images: [
      "https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/4066288/pexels-photo-4066288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    featured: true,
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans with a comfortable stretch. Versatile and stylish for any occasion.",
    price: 79.99,
    discountPrice: 59.99,
    category: "jeans",
    gender: "men",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Indigo", hex: "#3f4e9c" },
      { name: "Black", hex: "#000000" }
    ],
    images: [
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    featured: true,
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: "3",
    name: "Casual Linen Shirt",
    description: "A breathable linen shirt perfect for warm weather and casual outings.",
    price: 59.99,
    category: "shirts",
    gender: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Light Blue", hex: "#add8e6" },
      { name: "Beige", hex: "#f5f5dc" }
    ],
    images: [
      "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    featured: false,
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: "4",
    name: "Floral Summer Dress",
    description: "A lightweight floral dress, perfect for summer days and special occasions.",
    price: 89.99,
    category: "dresses",
    gender: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Floral Blue", hex: "#7b9ebd" },
      { name: "Floral Pink", hex: "#f7cac9" }
    ],
    images: [
      "https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/973401/pexels-photo-973401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    featured: true,
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: "5",
    name: "Wool Blend Sweater",
    description: "A cozy and stylish wool blend sweater, ideal for colder days.",
    price: 99.99,
    category: "sweaters",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Gray", hex: "#808080" },
      { name: "Navy", hex: "#0a142e" },
      { name: "Burgundy", hex: "#800020" }
    ],
    images: [
      "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    featured: false,
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: "6",
    name: "Leather Jacket",
    description: "A classic leather jacket with modern styling. Durable and fashionable.",
    price: 199.99,
    category: "jackets",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Brown", hex: "#964B00" }
    ],
    images: [
      "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    featured: true,
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: "7",
    name: "High-Waisted Trousers",
    description: "Elegant high-waisted trousers for a sophisticated look.",
    price: 89.99,
    category: "trousers",
    gender: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Beige", hex: "#f5f5dc" },
      { name: "Navy", hex: "#0a142e" }
    ],
    images: [
      "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    featured: false,
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: "8",
    name: "Patterned Silk Scarf",
    description: "A luxurious silk scarf with a unique pattern. Adds elegance to any outfit.",
    price: 49.99,
    category: "accessories",
    gender: "unisex",
    sizes: ["One Size"],
    colors: [
      { name: "Multicolor", hex: "#ffffff" }
    ],
    images: [
      "https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    featured: true,
    isBestSeller: false,
    isNewArrival: true
  }
];

export function getAllProducts() {
  return products;
}

export function getFeaturedProducts() {
  return products.filter(product => product.featured);
}

export function getProductById(id: string) {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: string) {
  return products.filter(product => product.category === category);
}

export function getProductsByGender(gender: 'men' | 'women' | 'unisex') {
  return products.filter(product => product.gender === gender || product.gender === 'unisex');
}

export function getNewArrivals() {
  return products.filter(product => product.isNewArrival);
}

export function getBestSellers() {
  return products.filter(product => product.isBestSeller);
}

export function searchProducts(query: string) {
  const lowercasedQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercasedQuery) || 
    product.description.toLowerCase().includes(lowercasedQuery) ||
    product.category.toLowerCase().includes(lowercasedQuery)
  );
}