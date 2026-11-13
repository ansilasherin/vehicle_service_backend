# 🚗 Master Prompt for Flutter Vehicle Service & Accessories App

Copy and paste the prompt below into an AI assistant (or use it as a complete project specification/PRD) to build the entire Flutter mobile application:

---

```markdown
Create a complete, modern, and production-ready Flutter mobile application for a "Vehicle Service & Accessories Booking App" named **AutoCare**.

### 🌐 Backend API Information
- **Live Base URL:** `https://vehicle-service-backend-uoro.onrender.com`
- **Authentication:** JWT Bearer Token in `Authorization: Bearer <TOKEN>`
- **Architecture:** Clean Architecture / Feature-first with Provider or Riverpod for State Management. Use `http` for networking and `shared_preferences` for persistent token storage.

---

### 🎨 Design & UI/UX Guidelines
- **Theme:** Modern Automotive Tech Theme (Primary: Deep Indigo/Navy `#1E293B` or Electric Blue `#2563EB`, Accent: Emerald Green `#10B981` or Amber `#F59E0B`, Background: Clean Light `#F8FAFC`).
- Smooth page transitions, pull-to-refresh on lists, modern card layouts with rounded corners (`16px`), hero animations for vehicle images, and clear loading/shimmer states.

---

### 📱 1. Core User Flow & Screens

#### 1. Splash & Auth Flow
1. **Splash Screen:** Check local storage for JWT token. If token exists and valid:
   - If `role == "admin"`, navigate to **Admin Dashboard**.
   - If `role == "user"`, navigate to **Customer Home Screen**.
   - If no token, navigate to **Login Screen**.
2. **Login Screen:** Phone/Username and Password fields.
   - Calls `POST /api/auth/login`.
   - On success: Saves `token` and `role`. Directs based on role.
3. **Register Screen:** Username, Phone, Password.
   - Calls `POST /api/auth/register`.

#### 2. Customer Flow (Bottom Navigation Bar)
- **Tab 1: Home Screen**
  - Carousel banner of current offers & vehicle care tips.
  - **Vehicle Categories Grid:** Fetches `GET /api/categories` (Two Wheeler, Three Wheeler, Four Wheeler) with real HD images.
  - Tapping a category navigates to **Category Services Screen** passing the `categoryId`.
  - **Quick Services Preview & Best-selling Accessories Preview**.

- **Tab 2: Services Screen**
  - Displays services fetched from `GET /api/services` with category filter tabs.
  - Service Card: Name, Price badge, Description, and **"Book Now"** button.
  - Tapping "Book Now" opens **Booking Modal/Screen**:
    - Select Date (DatePicker).
    - Select Time Slot (Morning / Afternoon).
    - Enter Vehicle Number.
    - Submit calls `POST /api/bookings` with Bearer token.
    - Shows confirmation dialog with booking ID.

- **Tab 3: Accessories Store Screen**
  - Fetches `GET /api/products` (Helmet, Seat Cover, Gloves, Wash Kit, LED Fog Lights, etc.).
  - Grid view with product image, price, title, and "Buy / Order" button.
  - Tapping opens **Product Details Screen**:
    - Image zoom, full description, stock status.
    - "Order Now" button calls `POST /api/products/order`.

- **Tab 4: My Bookings Screen**
  - Fetches `GET /api/bookings/my-bookings` with Bearer token.
  - List of past and active bookings with color-coded status badges:
    - `pending` (Yellow)
    - `paid` (Blue)
    - `completed` (Green)
    - `cancelled` (Red).

- **Tab 5: Profile Screen**
  - User details (Username, Phone).
  - Vehicle details form: Vehicle Number, Model, Pincode, Address (calls `POST /api/users`).
  - Logout button (clears token from storage and returns to Login).

---

### 👑 2. Admin Flow (Admin Dashboard)
Shown only when `role == "admin"` (Default login: `admin` / `admin123`):
1. **Admin Home / Stats:**
   - Summary cards: Total Bookings, Total Orders, Active Services.
2. **Manage Bookings Screen:**
   - Calls `GET /api/bookings` (all customer bookings).
   - Allows changing status (`PUT /api/bookings/{id}/status`) to `confirmed`, `completed`, or `cancelled`.
3. **Manage Products & Services:**
   - Add new Service (`POST /api/services`).
   - Add new Product (`POST /api/products`) with Image Upload (`POST /api/upload` via `image_picker`).
   - Edit / Delete existing items.

---

### 🛠️ Technical Implementation Checklist
1. **Models:** `UserModel`, `CategoryModel`, `ServiceModel`, `ProductModel`, `BookingModel`.
2. **Services:** `ApiService` with organized methods for Auth, Categories, Services, Bookings, Products, and Upload.
3. **State Management:** Clean providers/controllers separating business logic from UI widgets.
4. **Error Handling:** Try-catch blocks with User-friendly Snackbars / Alert Dialogs on network failures.

Please generate the complete Flutter project structure, models, API service, state management, and all main screen widgets.
```
