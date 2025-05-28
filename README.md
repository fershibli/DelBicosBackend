<p align="center">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/8f678029-be34-4be1-83f3-4c7fd21eb035">
      <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/2a47dadf-6288-4ae8-a0a7-d066e3ccf52a">
      <img alt="Shows a black logo in light color mode and a white one in dark color mode." src="https://user-images.githubusercontent.com/25423296/163456779-a8556205-d0a5-45e2-ac17-42d089e3c3f8.png">
    </picture>
</p>


# DelBicos Backend

This is a TypeScript Express application adapted for deployment on Vercel. The application uses Sequelize for database interactions and follows a structured directory layout for better organization.

## Project Structure

```
my-vercel-express-app
├── src
│   ├── controllers        # Contains controllers for handling requests
│   ├── routes             # Contains route definitions
│   ├── interfaces         # Contains TypeScript interfaces
│   ├── models             # Contains Sequelize models
│   ├── config             # Contains configuration files
│   └── api                # Entry point for the API
├── package.json           # NPM package configuration
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel deployment configuration
└── README.md              # Project documentation
```

## Endpoints Usage

### User Management

#### 1. Create a new user

- **Endpoint**: `/api/users`
- **Method**: `POST`
- **Request Body**:

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123"
}
```

- **Response**:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "johndoe@example.com",
  "createdAt": "2023-10-01T00:00:00.000Z",
  "updatedAt": "2023-10-01T00:00:00.000Z"
}
```

### User Management

#### 2. Get all users

- **Endpoint**: `/api/users`
- **Method**: `GET`
- **Response**:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "createdAt": "2023-10-01T00:00:00.000Z",
    "updatedAt": "2023-10-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "johndoe@example.com",
    "createdAt": "2023-10-01T00:00:00.000Z",
    "updatedAt": "2023-10-01T00:00:00.000Z"
  }
]
```

### User Management

#### 3. Get a user by ID

- **Endpoint**: `/api/users/:id`
- **Method**: `GET`
- **Response**:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "johndoe@example.com",
  "createdAt": "2023-10-01T00:00:00.000Z",
  "updatedAt": "2023-10-01T00:00:00.000Z"
}
```

### User Management

#### 4. Update a user

- **Endpoint**: `/api/users/:id`
- **Method**: `PUT`
- **Request Body**:

```json
{
  "name": "John Smith",
  "email": "johndoe@example.com"
}
```

- **Response**:

```json
{
  "id": 1,
  "name": "John Smith",
  "email": "johndoe@example.com",
  "createdAt": "2023-10-01T00:00:00.000Z",
  "updatedAt": "2023-10-01T00:00:00.000Z"
}
```
