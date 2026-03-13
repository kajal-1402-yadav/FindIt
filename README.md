# FindIt - Lost and Found Application

A modern web application for reporting and finding lost items. Users can report lost items, browse found items, and claim items that belong to them.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login system with password validation
- **Item Reporting**: Report lost or found items with detailed descriptions
- **Item Browsing**: Browse through reported items with filtering options
- **Claim System**: Claim items that belong to you with verification messages
- **Dashboard**: Personal dashboard showing your reported and claimed items
- **Real-time Updates**: Live status updates for items and claims

### Technical Features
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Form Validation**: Comprehensive client-side validation with real-time feedback
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **RESTful API**: Clean and well-documented API endpoints
- **Database Support**: Dual database support (SQL Server & SQLite)

## 🛠 Tech Stack

### Backend
- **.NET 8.0**: Modern, high-performance web framework
- **ASP.NET Core Web API**: RESTful API development
- **Entity Framework Core 8.0**: ORM for database operations
- **SQL Server**: Primary database (with SQLite fallback for development)
- **BCrypt.Net-Next**: Secure password hashing

### Frontend
- **Angular 21**: Modern, component-based frontend framework
- **TypeScript**: Type-safe JavaScript development
- **Angular Forms**: Reactive forms with custom validators
- **Angular Router**: Client-side routing
- **CSS3**: Modern styling with responsive design

### Database
- **SQL Server**: Production database (LocalDB for development)
- **SQLite**: Development database fallback
- **Entity Framework Migrations**: Database schema management

## 📋 Prerequisites

### For Backend
- **.NET 8.0 SDK** or later
- **SQL Server** (LocalDB comes with Visual Studio)
- **Visual Studio 2022** or **VS Code** with C# extension

### For Frontend
- **Node.js** (version 18 or later)
- **npm** (version 9 or later)
- **Angular CLI** (version 21 or later)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FindIt
```

### 2. Backend Setup

#### Using .NET CLI
1. Navigate to the server directory:
   ```bash
   cd FindIt.Server
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Apply database migrations:
   ```bash
   dotnet ef database update
   ```

4. Run the application:
   ```bash
   dotnet run
   ```

#### Database Configuration
The application supports both SQL Server and SQLite:

- **SQL Server (Default)**: Uses LocalDB for development
- **SQLite**: Set `"UseSqlite": true` in `appsettings.Development.json`

To create new migrations:
```bash
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

### 3. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd findit.client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The Angular application will start on `https://localhost:65194` (configured for SSL).

### 4. Running the Full Application

#### Separate Development
- Terminal 1: `cd FindIt.Server && dotnet run` (Backend on `https://localhost:5167`)
- Terminal 2: `cd findit.client && npm start` (Frontend on `https://localhost:65194`)

## 🌐 Application URLs

- **Frontend**: `https://localhost:65194` (Angular)
- **Backend API**: `https://localhost:5167` (ASP.NET Core)
- 
## 📁 Project Structure

```
FindIt/
├── FindIt.Server/                 # .NET Web API
│   ├── Controllers/              # API Controllers
│   ├── Data/                     # Database Context
│   ├── Models/                   # Entity Models
│   ├── DTOs/                     # Data Transfer Objects
│   ├── Migrations/               # EF Core Migrations
│   └── Program.cs               # Application Entry Point
├── findit.client/                # Angular Frontend
│   ├── src/
│   │   ├── app/                 # Angular App
│   │   │   ├── features/        # Feature Modules
│   │   │   │   ├── auth/        # Authentication
│   │   │   │   ├── items/       # Item Management
│   │   │   │   └── claims/      # Claim System
│   │   │   ├── core/            # Core Services
│   │   │   └── shared/          # Shared Components
│   │   └── assets/              # Static Assets
│   ├── package.json            # Node Dependencies
│   └── angular.json            # Angular Configuration
└── README.md                   # This file
```

## 🔧 Configuration

### Backend Configuration
- **appsettings.json**: Production settings
- **appsettings.Development.json**: Development settings
- **Database**: Configured via connection strings
- **CORS**: Configured for Angular development servers

### Frontend Configuration
- **proxy.conf.js**: Development proxy configuration
- **angular.json**: Angular build and serve configuration
- **package.json**: Node.js dependencies and scripts

## 🧪 Testing

### Backend Testing
```bash
cd FindIt.Server
dotnet test
```

### Frontend Testing
```bash
cd findit.client
npm test
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/{id}` - Get item by ID
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item
- `GET /api/items/my` - Get user's items

### Claims
- `POST /api/claims` - Create claim
- `GET /api/claims` - Get claims for user's items
- `PUT /api/claims/{id}/approve` - Approve claim
- `PUT /api/claims/{id}/deny` - Deny claim

## 🔒 Security Features

- **Password Hashing**: BCrypt for secure password storage
- **Input Validation**: Comprehensive validation on both frontend and backend
- **CORS Configuration**: Secure cross-origin resource sharing
- **HTTPS/SSL**: Development environment configured for SSL
- **SQL Injection Protection**: Entity Framework parameterized queries


---


