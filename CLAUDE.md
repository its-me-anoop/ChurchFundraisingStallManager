# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm start` - Start development server on port 3000
- `npm run build` - Build for production
- `npm test` - Run all tests
- `npm test -- --testNamePattern=<pattern>` - Run specific tests
- `npm test -- --testPathPattern=<path>` - Run tests in specific file

## Code Style
- 2-space indentation
- Single quotes for strings
- Components use PascalCase (.jsx)
- Services/utils use camelCase (.js)
- React functional components with arrow function syntax
- Props destructuring in function parameters
- Tailwind CSS for styling (see tailwind.config.js)

## Architecture

### Authentication Flow
- Firebase Authentication wrapped in `AuthContext`
- `PrivateRoute` component protects admin/seller dashboards
- Auth state persisted across sessions via Firebase listener
- Separate login flows for admin and sellers (PIN-based for sellers)

### Database Structure
- **stalls collection**: Contains stall information
  - `sellerPin`: Unique identifier for seller access
  - `products`: Array of product objects with stock tracking
- **sales collection**: Transaction records
  - Links to `stallId` and `productId`
  - Tracks `quantity`, `paymentMethod`, and `timestamp`

### Routing Pattern
- Public routes: Home, login pages, legal pages
- Protected routes: `/admin` and `/seller` dashboards
- Layout component provides consistent header/footer structure
- React Router v5 with Switch and Route components

### Theme Implementation
- Dark mode via Tailwind's `class` strategy
- Custom color system with `light-*` and `dark-*` variants
- Theme persistence through `ThemeContext`
- System preference detection with manual override

## Firebase Service Layer
Key functions in `/src/services/firebase.js`:
- `getStallDetails(sellerPin)` - Retrieves stall data by PIN
- `recordSale()` - Single item sale with atomic stock update
- `recordTransaction()` - Multi-item sale with transaction batching
- `getSalesForStall()` - Fetches sales history for reporting

## Best Practices
- Use Firebase transactions for stock updates to prevent race conditions
- Environment variables for Firebase config (never commit credentials)
- Error boundaries for graceful failure handling
- Loading states during async operations
- Responsive design with mobile-first approach