<p align="center">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./src/assets/DelBicos_git.png">
      <source media="(prefers-color-scheme: light)" srcset="./src/assets/DelBicos_LogoH.png">
      <img alt="Shows a black logo in light color mode and a white one in dark color mode." src="assets/DelBicos_git.png">
    </picture>
</p>

<p align="center">

[Backend](#delbicos-backend) | [Tecnologies](#️-tecnologies) | [Team](#-team) | [Project Structure](#-project-structure) | [Frontend Project](https://github.com/fershibli/DelBicosV2)

</p>

# 💻 DelBicos Backend

This is a TypeScript Express application adapted for deployment on Vercel. The application uses Sequelize for database interactions and follows a structured directory layout for better organization.

<br>

## 🛠️ Tecnologies

![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![Javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white) ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Swift](https://img.shields.io/badge/swift-F54A2A?style=for-the-badge&logo=swift&logoColor=white) ![Objective-C](https://img.shields.io/badge/OBJECTIVE--C-%233A95E3.svg?style=for-the-badge&logo=apple&logoColor=white) ![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white) ![Kotlin](https://img.shields.io/badge/Kotlin-0095D5?&style=for-the-badge&logo=kotlin&logoColor=white) ![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white) ![MaterialUI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white) ![Node](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Zustand](https://img.shields.io/badge/Zustand-007ACC?style=for-the-badge&logo=React&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white) ![Penpot](https://img.shields.io/badge/Penpot-000000?style=for-the-badge&logo=penpot&logoColor=white) ![Gimp](https://img.shields.io/badge/gimp-5C5543?style=for-the-badge&logo=gimp&logoColor=white) ![Inkscape](https://img.shields.io/badge/Inkscape-000000?style=for-the-badge&logo=Inkscape&logoColor=white) ![Vscode](https://img.shields.io/badge/Vscode-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white) ![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white) ![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white)

<br>

## 👥 Team

|                        Nome                        | Função                      |
| :------------------------------------------------: | --------------------------- |
|  [Fernando Chibli](https://github.com/fershibli)   | _Product Owner & FullStack_ |
| [Douglas Wenzel](https://github.com/douglaswenzel) | _Scrum Master & FullStack_  |
|    [Eduardo Kamo](https://github.com/edukamoz)     | _Desenvolvedor FullStack_   |
|  [Gustavo Ferreira](https://github.com/Gspedine)   | _Desenvolvedor FullStack_   |
|  [Iago Rossan](https://github.com/IagoYuriRossan)  | _Desenvolvedor FullStack_   |
|   [Isabel Maito](https://github.com/isabelmaito)   | _Desenvolvedora FullStack_  |
|    [Lucas Consani](https://github.com/konsanii)    | _Desenvolvedor FullStack_   |

<br>

## 📝 Project Structure

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
