# ChayPani - Food Delivery App - Complete Technical Guide

## Project Overview
ChayPani is a modern food delivery application built with a **full-stack architecture**. It allows users to browse restaurants, view menus, add items to cart, and place orders. It includes an admin dashboard to manage restaurants, menu items, and orders.

**Project Type**: Full-Stack Web Application (MERN-like stack)
**Purpose**: Food delivery platform similar to Zomato/Swiggy

---

## Tech Stack

### Frontend (Client)
- **Framework**: Next.js 14.2.35 (React 18)
- **Styling**: Tailwind CSS 3.4.1
- **HTTP Client**: Axios 1.15.1
- **Package Manager**: npm
- **Server-Side Rendering**: Next.js App Router with "use client" components

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB 8.0.0 (via Mongoose)
- **CORS**: Enabled
- **Environment**: Configured via .env file (dotenv 16.3.1)

### Database
- **Type**: MongoDB (NoSQL)
- **ODM**: Mongoose
- **Connection**: MongoDB Atlas (cloud-based)

---

## Directory Structure

```
ChayPani/
├── client/                          # Next.js Frontend Application
│   ├── app/                         # Next.js App Router directory
│   │   ├── page.js                 # Home page (Restaurant listing)
│   │   ├── layout.js               # Root layout component
│   │   ├── globals.css             # Global styles
│   │   ├── admin/
│   │   │   └── page.js             # Admin dashboard (CRUD operations)
│   │   ├── cart/
│   │   │   └── page.js             # Shopping cart page
│   │   ├── orders/
│   │   │   └── page.js             # Order history/tracking page
│   │   ├── restaurant/
│   │   │   └── [id]/
│   │   │       └── page.js         # Dynamic restaurant detail page
│   │   └── fonts/                  # Custom fonts
│   ├── lib/
│   │   └── api.js                  # Axios API client configuration
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── jsconfig.json
│   ├── next.config.mjs
│   ├── tailwind.config.js
│   └── postcss.config.mjs
│
└── server/                          # Express.js Backend Application
    ├── models/                      # Mongoose schemas
    │   ├── Restaurant.js            # Restaurant data model
    │   ├── MenuItem.js              # Menu item data model
    │   └── Order.js                 # Order data model
    ├── routes/                      # API route handlers
    │   ├── restaurants.js           # Restaurant CRUD endpoints
    │   ├── menuItems.js             # Menu items CRUD endpoints
    │   └── orders.js                # Orders endpoints
    ├── server.js                    # Express app setup & entry point
    └── package.json
```

---

## Database Models & Schema

### 1. Restaurant Model (`server/models/Restaurant.js`)
```
{
  _id: ObjectId (auto-generated)
  name: String (required) - Restaurant name
  cuisine: String - Type of cuisine (e.g., Italian, Indian)
  address: String - Restaurant location
  phone: String - Contact number
  isOpen: Boolean (default: true) - Operating status
  createdAt: Date (auto)
}
```
**Purpose**: Stores restaurant information. Referenced by MenuItem and Order models.

### 2. MenuItem Model (`server/models/MenuItem.js`)
```
{
  _id: ObjectId (auto-generated)
  restaurantId: ObjectId (required) - Foreign key to Restaurant
  name: String (required) - Dish name
  price: Number (required) - Price in currency
  category: String - Food category (e.g., Appetizer, Main Course)
  isVeg: Boolean (default: false) - Vegetarian flag
  createdAt: Date (auto)
}
```
**Purpose**: Stores menu items for each restaurant. Each item belongs to one restaurant.

### 3. Order Model (`server/models/Order.js`)
```
{
  _id: ObjectId (auto-generated)
  customerName: String (required) - Customer name
  customerPhone: String - Contact number
  customerAddress: String - Delivery address
  restaurantId: ObjectId - Reference to Restaurant
  restaurantName: String - Denormalized restaurant name
  items: [{
    name: String - Item name
    price: Number - Item price
    quantity: Number - Quantity ordered
  }]
  totalAmount: Number - Total order amount (includes fees)
  status: String (enum: 'pending', 'confirmed', 'delivered', default: 'pending')
  createdAt: Date (auto, default: now)
}
```
**Purpose**: Stores customer orders with order items, delivery info, and status tracking.

---

## API Endpoints

### Restaurant Endpoints (`/api/restaurants`)

| Method | Endpoint | Purpose | Request Body |
|--------|----------|---------|--------------|
| GET | `/api/restaurants` | Fetch all restaurants | - |
| GET | `/api/restaurants/:id` | Fetch specific restaurant | - |
| POST | `/api/restaurants` | Create new restaurant | `{name, cuisine, address, phone, isOpen}` |
| PUT | `/api/restaurants/:id` | Update restaurant | `{name, cuisine, address, phone, isOpen}` |
| DELETE | `/api/restaurants/:id` | Delete restaurant | - |

**Response Format**:
```json
{
  "success": true,
  "data": { restaurant object or array }
}
```

### Menu Items Endpoints (`/api/menuitems`)

| Method | Endpoint | Purpose | Query Params | Request Body |
|--------|----------|---------|--------------|--------------|
| GET | `/api/menuitems` | Fetch menu items | `restaurantId=xxx` (optional) | - |
| POST | `/api/menuitems` | Create menu item | - | `{restaurantId, name, price, category, isVeg}` |
| PUT | `/api/menuitems/:id` | Update menu item | - | `{name, price, category, isVeg}` |
| DELETE | `/api/menuitems/:id` | Delete menu item | - | - |

**Note**: GET with `restaurantId` query filters items by restaurant.

### Orders Endpoints (`/api/orders`)

| Method | Endpoint | Purpose | Request Body |
|--------|----------|---------|--------------|
| GET | `/api/orders` | Fetch all orders (sorted newest first) | - |
| POST | `/api/orders` | Create new order | `{restaurantId, customerName, customerPhone, customerAddress, items, totalAmount}` |
| PUT | `/api/orders/:id/status` | Update order status | `{status: 'pending'|'confirmed'|'delivered'}` |

---

## Frontend Pages & Features

### 1. Home Page (`client/app/page.js`)
- **Route**: `/`
- **Features**:
  - Hero section with search
  - Restaurant search/filter functionality
  - Grid display of all restaurants
  - Loading skeletons for better UX
  - Responsive design
- **Data Flow**:
  1. On mount: Calls `api.get('/api/restaurants')`
  2. Stores response in state using `setRestaurants()`
  3. Filters restaurants based on search term
  4. Maps through restaurants and renders cards with navigation to detail page

### 2. Restaurant Detail Page (`client/app/restaurant/[id]/page.js`)
- **Route**: `/restaurant/[id]` (Dynamic route based on restaurant ID)
- **Features**:
  - Restaurant header with status (Open/Closed)
  - Menu items grid
  - Add to cart functionality
  - Cart count indicator
  - Real-time cart sync via localStorage
  - Prevents adding items from different restaurants
- **Data Flow**:
  1. Extracts `id` from URL params: `params.id`
  2. Fetches restaurant data: `api.get('/api/restaurants/:id')`
  3. Fetches menu items: `api.get('/api/menuitems?restaurantId=:id')`
  4. On "Add to Cart": Saves to localStorage with key `chaypani_cart`
  5. Listens to storage changes to update cart count

### 3. Cart Page (`client/app/cart/page.js`)
- **Route**: `/cart`
- **Features**:
  - Display all cart items with quantities
  - Adjust quantity (increase/decrease)
  - Remove items from cart
  - Calculate subtotal, delivery fee (₹40), platform fee (₹5)
  - Customer information form (name, phone, address)
  - Checkout functionality
- **Data Flow**:
  1. On mount: Retrieves cart from localStorage (`chaypani_cart`)
  2. Updates cart locally in state
  3. Saves changes back to localStorage
  4. On checkout: Creates order via `api.post('/api/orders', orderData)`
  5. Clears cart and redirects to orders page

### 4. Orders Page (`client/app/orders/page.js`)
- **Route**: `/orders`
- **Features**:
  - Display all orders (newest first)
  - Shows order ID, date/time, status
  - Lists ordered items with quantities
  - Shows delivery address
  - Displays total amount paid
  - Status badges (pending, confirmed, delivered)
- **Data Flow**:
  1. On mount: Fetches orders via `api.get('/api/orders')`
  2. Reverses array to show newest orders first
  3. Renders order cards with details

### 5. Admin Dashboard (`client/app/admin/page.js`)
- **Route**: `/admin`
- **Features**: Three tabs for management
  - **Restaurants Tab**: Create, Edit, Delete restaurants
  - **Menu Items Tab**: Create, Edit, Delete menu items
  - **Orders Tab**: View orders and update status
- **Data Flow**:
  1. Uses tabs to switch between different management sections
  2. Restaurants Tab:
     - Fetch all restaurants via `api.get('/api/restaurants')`
     - Form to add/edit restaurant
     - On submit: POST for create or PUT for update
     - Delete via `api.delete('/api/restaurants/:id')`
  3. Menu Items Tab:
     - Fetch items, create with restaurant selection
     - Update and delete functionality
  4. Orders Tab:
     - Fetch all orders
     - Update order status via `api.put('/api/orders/:id/status', {status})`

---

## Data Flow Diagram

### User Journey: Browsing → Ordering

```
1. USER LANDS ON HOME PAGE
   ↓
   Client: Calls api.get('/api/restaurants')
   ↓
   Server: Queries Restaurant collection
   ↓
   Returns all restaurants → Display in grid

2. USER CLICKS ON RESTAURANT
   ↓
   Client: Navigates to /restaurant/[id]
   ↓
   Client: Calls api.get('/api/restaurants/:id')
              + api.get('/api/menuitems?restaurantId=:id')
   ↓
   Server: Queries Restaurant by ID + MenuItems filtered by restaurantId
   ↓
   Returns restaurant details + menu items → Display

3. USER ADDS ITEMS TO CART
   ↓
   Client: Saves to localStorage key 'chaypani_cart'
           Cart structure: [
             {restaurantId, restaurantName, name, price, quantity}
           ]

4. USER GOES TO CART PAGE
   ↓
   Client: Retrieves from localStorage
   ↓
   Client: Displays items, calculates total (subtotal + ₹40 delivery + ₹5 platform fee)

5. USER PLACES ORDER (CHECKOUT)
   ↓
   Client: Calls api.post('/api/orders', {
     restaurantId,
     customerName,
     customerPhone,
     customerAddress,
     items: [
       {name, quantity, price}
     ],
     totalAmount
   })
   ↓
   Server: Creates Order document in MongoDB
   ↓
   Server: Returns success → Client clears localStorage cart
   ↓
   Client: Redirects to /orders page

6. USER VIEWS ORDER HISTORY
   ↓
   Client: Calls api.get('/api/orders')
   ↓
   Server: Queries Order collection, sorts by createdAt descending
   ↓
   Returns orders → Display with status tracking
```

### Admin Workflow: Managing Content

```
ADMIN CREATES RESTAURANT
Client Form → api.post('/api/restaurants', restaurantData)
            → Server: Saves to Restaurant collection
            → Returns created restaurant → Refresh list

ADMIN ADDS MENU ITEMS
Client Form (select restaurant) → api.post('/api/menuitems', {
                                    restaurantId,
                                    name,
                                    price,
                                    category,
                                    isVeg
                                  })
                                → Server: Saves to MenuItem collection
                                → Returns created item → Refresh list

ADMIN UPDATES ORDER STATUS
Client Status Dropdown → api.put('/api/orders/:id/status', {status})
                       → Server: Updates Order.status
                       → Returns updated order → Refresh view
```

---

## Key Implementation Details

### 1. Frontend State Management
- **Restaurant Listing**: Uses React `useState` for restaurants array
- **Search Filtering**: Real-time filtering on client-side
- **Cart Management**: Uses browser `localStorage` (no backend session)
- **Cart Key**: `chaypani_cart` - contains array of items

### 2. API Client Configuration
**File**: `client/lib/api.js`
```javascript
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});
```
- All API calls use this configured axios instance
- Base URL set via environment variable or defaults to localhost:5000

### 3. Cart Logic
- **Adding**: Checks if cart has items from another restaurant, warns user
- **Quantity**: Increments for duplicate items, stores quantity per item
- **Storage**: Persists in localStorage for cart persistence across sessions
- **Clearing**: Removes on order completion

### 4. Order Creation
- Orders include all necessary customer info
- Items are denormalized (name, price copied to order)
- Total amount calculated on frontend (includes delivery + platform fee)
- Status starts as 'pending'

### 5. Error Handling
- API calls wrapped in try-catch blocks
- User alerts for errors
- Console logging for debugging
- Loading states during async operations

---

## How to Learn This Repository

### Phase 1: Understand the Architecture (1-2 hours)
1. Read this guide completely
2. Study the folder structure
3. Identify the 3 models: Restaurant, MenuItem, Order
4. Understand the CRUD operations

### Phase 2: Backend Deep Dive (2-3 hours)
1. **Start with Models**: Read `server/models/` to understand data structure
2. **Examine Routes**: 
   - Start with `routes/restaurants.js` (simplest CRUD)
   - Then `routes/menuItems.js` (has filtering)
   - Finally `routes/orders.js` (has status updates)
3. **Study Server Setup**: Read `server.js` to understand:
   - Express middleware (CORS, JSON)
   - MongoDB connection
   - Route mounting
4. **Test Endpoints**: Use Postman/Insomnia to test each endpoint manually

### Phase 3: Frontend Deep Dive (3-4 hours)
1. **API Integration**: Read `lib/api.js` to understand axios setup
2. **Pages in Order**:
   - Start with `page.js` (home, simplest)
   - Then `restaurant/[id]/page.js` (dynamic routes, data fetching)
   - Then `cart/page.js` (localStorage, form handling)
   - Then `orders/page.js` (data display)
   - Finally `admin/page.js` (complex CRUD UI)
3. **Key Patterns**:
   - How `useEffect` fetches data on page load
   - How forms handle state and submissions
   - How localStorage persists cart data
   - How dynamic routes work with params

### Phase 4: Full Data Flow (2-3 hours)
1. Trace a user action through entire app:
   - User search → Restaurant list fetch → Menu fetch → Add to cart → Checkout → Order creation → View orders
2. Trace an admin action:
   - Add restaurant → Create menu items → View orders → Update status
3. Draw out the flow yourself to reinforce understanding

### Phase 5: Practice & Modifications (Ongoing)
1. Add a new field to Restaurant model
2. Update forms to include new field
3. Test the entire CRUD flow
4. Add a new feature (e.g., restaurant ratings)

---

## Environment Variables Required

### Client (`.env.local` in client folder)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Server (`.env` in server folder)
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chaypani
```

---

## Common Questions & Answers

**Q: How does the cart persist across page refreshes?**
A: Uses browser localStorage with key `chaypani_cart`. Data survives refresh but not browser clearing.

**Q: Can users order from multiple restaurants?**
A: No, if cart has items from Restaurant A and user tries to add from Restaurant B, the app asks to clear cart first.

**Q: How are menu items linked to restaurants?**
A: Via `restaurantId` foreign key in MenuItem model. MenuItems.restaurantId = Restaurants._id

**Q: What happens to orders when a restaurant is deleted?**
A: Orders remain in database (restaurantId still exists), but the reference breaks (no cascading delete).

**Q: Is there user authentication?**
A: No, this is a public app without login. Orders are tied to customer info (name, phone, address) only.

**Q: How are fees calculated?**
A: Fixed amounts: ₹40 delivery fee + ₹5 platform fee, only charged if cart not empty.

---

## Next Steps to Extend the App

1. **Authentication**: Add user login/signup with JWT
2. **Payment Integration**: Add Stripe/Razorpay payment gateway
3. **Real-time Updates**: Implement WebSockets for order status updates
4. **Ratings & Reviews**: Add review system for restaurants/items
5. **User Profile**: Save user addresses, payment methods
6. **Advanced Search**: Filter by cuisine, rating, price range
7. **Promotions**: Add coupons and discount codes
8. **Admin Analytics**: Dashboard with sales, popular items, order trends
9. **Mobile App**: React Native version using same backend

---

## Important Notes

- This is a micro-project suitable for learning full-stack development
- No complex authentication or authorization currently implemented
- Perfect for understanding CRUD operations, API design, and React patterns
- Consider adding input validation and error handling improvements
- Database queries could be optimized with indexing for production
