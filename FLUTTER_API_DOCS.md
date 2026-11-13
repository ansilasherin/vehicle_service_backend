# 🚗 Vehicle Service Backend - Flutter API Documentation

**Live Base URL:**  
`https://vehicle-service-backend-uoro.onrender.com`

---

## 📌 1. Flutter Setup & Dependencies

Add the `http` package to your Flutter project's `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  shared_preferences: ^2.2.2 # To store JWT Token locally
```

Create an API constants file in Flutter (`lib/constants/api_constants.dart`):

```dart
class ApiConstants {
  static const String baseUrl = "https://vehicle-service-backend-uoro.onrender.com";
  static const String auth = "$baseUrl/api/auth";
  static const String categories = "$baseUrl/api/categories";
  static const String services = "$baseUrl/api/services";
  static const String products = "$baseUrl/api/products";
  static const String bookings = "$baseUrl/api/bookings";
  static const String users = "$baseUrl/api/users";
  static const String payment = "$baseUrl/api/payment";
  static const String upload = "$baseUrl/api/upload";
}
```

---

## 🔑 2. Authentication Module (`/api/auth`)

### A. User Registration
* **Endpoint:** `POST /api/auth/register`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "username": "Rahul",
  "phone": "9876543210",
  "password": "password123",
  "role": "user"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Registered successfully",
  "token": "eyJhbGciOi...",
  "data": {
    "id": "673...",
    "username": "Rahul",
    "phone": "9876543210",
    "role": "user"
  }
}
```

---

### B. User / Admin Login
* **Endpoint:** `POST /api/auth/login`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "username": "9876543210",
  "password": "password123"
}
```
*(Default Admin: username: `admin`, password: `admin123`)*

* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login success",
  "token": "eyJhbGciOi...",
  "data": {
    "id": "673...",
    "username": "Rahul",
    "phone": "9876543210",
    "role": "user" 
  }
}
```

> **Flutter Tip:** Save `token` and `role` in `SharedPreferences`. If `role == "admin"`, navigate to Admin Dashboard, else navigate to Customer Home Screen.

---

## 🏍️ 3. Vehicle Categories (`/api/categories`)

### A. Get All Categories (Home Screen Grid/List)
* **Endpoint:** `GET /api/categories`
* **Headers:** None required
* **Response:**
```json
[
  {
    "_id": "673...",
    "catname": "Two Wheeler",
    "images": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc..."
  },
  {
    "_id": "673...",
    "catname": "Three Wheeler",
    "images": "https://images.unsplash.com/photo-1596707328904-4c8d76a260f8..."
  },
  {
    "_id": "673...",
    "catname": "Four Wheeler",
    "images": "https://images.unsplash.com/photo-1503376780353-7e6692767b70..."
  }
]
```

### B. Add Category (Admin Only)
* **Endpoint:** `POST /api/categories`
* **Headers:** `Authorization: Bearer <ADMIN_TOKEN>`
* **Body:**
```json
{
  "catname": "Heavy Vehicles",
  "images": "https://images.unsplash.com/..."
}
```

---

## 🛠️ 4. Services Module (`/api/services`)

### A. Get All Services
* **Endpoint:** `GET /api/services`
* **Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "673...",
      "categoryId": "1",
      "name": "Bike Foam Washing",
      "price": 200,
      "description": "High pressure foam wash, degreasing & polish"
    }
  ]
}
```

### B. Filter Services by Category
* **Endpoint:** `GET /api/services/category/{categoryId}`
* **Example:** `GET /api/services/category/1`
* **Response:** Returns only services belonging to category "1" (Two Wheeler).

---

## 📅 5. Service Booking Module (`/api/bookings`)

### A. Book a Service (Protected)
* **Endpoint:** `POST /api/bookings`
* **Headers:** 
  * `Content-Type: application/json`
  * `Authorization: Bearer <USER_TOKEN>`
* **Body:**
```json
{
  "service": "Bike Foam Washing",
  "date": "2026-11-20",
  "time": "10:30 AM"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Booking created",
  "data": {
    "_id": "673...",
    "userId": "673...",
    "service": "Bike Foam Washing",
    "date": "2026-11-20",
    "time": "10:30 AM",
    "paymentStatus": "pending"
  }
}
```

### B. Get My Bookings (Logged-in Customer)
* **Endpoint:** `GET /api/bookings/my-bookings`
* **Headers:** `Authorization: Bearer <USER_TOKEN>`
* **Response:** Returns only bookings created by the logged-in user.

### C. Get All Bookings (Admin Only)
* **Endpoint:** `GET /api/bookings`
* **Headers:** `Authorization: Bearer <ADMIN_TOKEN>`

### D. Update Booking Status (Admin Only)
* **Endpoint:** `PUT /api/bookings/{bookingId}/status`
* **Headers:** `Authorization: Bearer <ADMIN_TOKEN>`
* **Body:**
```json
{
  "paymentStatus": "paid" 
}
```
*(Options: `pending`, `paid`, `completed`, `cancelled`)*

---

## 🛍️ 6. Accessories & Products Store (`/api/products`)

### A. Get All Products
* **Endpoint:** `GET /api/products`
* **Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "673...",
      "name": "Vega Crux Full Face Helmet",
      "price": 1450,
      "category": "Riding Gear",
      "description": "ISI certified aerodynamic full face motorcycle helmet with anti-scratch visor.",
      "images": "https://images.unsplash.com/photo-1558981806-ec527fa84c39...",
      "inStock": true
    }
  ]
}
```

### B. Get Single Product Details
* **Endpoint:** `GET /api/products/{productId}`

### C. Order an Accessory
* **Endpoint:** `POST /api/products/order`
* **Headers:** `Authorization: Bearer <USER_TOKEN>`
* **Body:**
```json
{
  "product": "Vega Crux Full Face Helmet",
  "amount": 1450
}
```

### D. Confirm Order (After Payment)
* **Endpoint:** `PUT /api/products/confirm/{orderId}`

---

## 👤 7. User & Vehicle Profile (`/api/users`)

### A. Save User & Vehicle Details
* **Endpoint:** `POST /api/users`
* **Body:**
```json
{
  "name": "Rahul",
  "phonenmbr": "9876543210",
  "vehicleNumber": "KL 10 AV 1234",
  "vehicleModel": "Yamaha MT 15",
  "pincode": "676505",
  "state": "Kerala",
  "streetaddress": "Kozhikode Road"
}
```

---

## 📸 8. Image Upload (`/api/upload`)

Use `MultipartRequest` in Flutter to upload photos directly:
* **Endpoint:** `POST /api/upload`
* **Method:** `POST (multipart/form-data)`
* **Field name:** `image`
* **Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "fileName": "img-1741710000-123456.jpg",
  "imageUrl": "https://vehicle-service-backend-uoro.onrender.com/uploads/img-1741710000-123456.jpg"
}
```

---

## 💳 9. Razorpay Payment (`/api/payment`)

### A. Create Order
* **Endpoint:** `POST /api/payment/create-order`
* **Body:**
```json
{
  "amount": 1450
}
```
* **Response:** Returns Razorpay Order object with `id` to pass to Flutter Razorpay SDK.

---

## 📱 10. Sample Flutter Service Code

Here is a ready-to-use API service class for Flutter (`lib/services/api_service.dart`):

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';

class ApiService {
  // 1. Fetch Categories
  static Future<List<dynamic>> fetchCategories() async {
    final response = await http.get(Uri.parse(ApiConstants.categories));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed to load categories");
    }
  }

  // 2. Fetch Products
  static Future<List<dynamic>> fetchProducts() async {
    final response = await http.get(Uri.parse(ApiConstants.products));
    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      return json['data'];
    } else {
      throw Exception("Failed to load products");
    }
  }

  // 3. Login
  static Future<Map<String, dynamic>> login(String username, String password) async {
    final response = await http.post(
      Uri.parse("${ApiConstants.auth}/login"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"username": username, "password": password}),
    );
    return jsonDecode(response.body);
  }

  // 4. Create Booking
  static Future<Map<String, dynamic>> createBooking({
    required String token,
    required String service,
    required String date,
    required String time,
  }) async {
    final response = await http.post(
      Uri.parse(ApiConstants.bookings),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "service": service,
        "date": date,
        "time": time,
      }),
    );
    return jsonDecode(response.body);
  }

  // 5. Fetch User's Own Bookings
  static Future<List<dynamic>> fetchMyBookings(String token) async {
    final response = await http.get(
      Uri.parse("${ApiConstants.bookings}/my-bookings"),
      headers: {"Authorization": "Bearer $token"},
    );
    final json = jsonDecode(response.body);
    return json['data'];
  }
}
```
