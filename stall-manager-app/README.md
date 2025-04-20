# Stall Manager App

This is a simple Stall Manager application designed for a church fundraising event. The app allows an admin to create stalls, add products to those stalls, and assign sellers. Sellers, who are children, can log in using a unique pin and record the products they sell.

## Features

- **Admin Dashboard**: Admins can create stalls, add products, and assign sellers.
- **Seller Login**: Sellers can log in using a unique pin.
- **Product Recording**: Sellers can record the products sold during the event.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Firebase**: A platform for building web and mobile applications, used for authentication and database services.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.

## Project Structure

```
stall-manager-app
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── AdminDashboard.jsx
│   │   ├── SellerLogin.jsx
│   │   ├── StallCard.jsx
│   │   └── ProductList.jsx
│   ├── pages
│   │   ├── AdminPage.jsx
│   │   └── SellerPage.jsx
│   ├── services
│   │   └── firebase.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .firebaserc
├── firebase.json
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd stall-manager-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Configure Firebase:
   - Create a Firebase project and add your configuration to `src/services/firebase.js`.

5. Start the development server:
   ```
   npm start
   ```

6. Open your browser and go to `http://localhost:3000` to view the application.

## Usage Guidelines

- Admins can access the Admin Dashboard to manage stalls and products.
- Sellers can log in using their unique pin to access their respective pages and record sales.

## License

This project is open-source and available under the MIT License.