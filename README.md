# **Products Recommendation**

## **Overview**

Scalable E-commerce backend application built with NestJS, RabbitMQ, MySql and Prisma.

## **Features**

- **Authentication:** Users can register and login to our system
- **Orders:** User can create orders.
- **Pagination:** Provides pagination support for products listings.
- **Top 10 ordered products for a given area:** System provider an API which is allow users to get the top 10 ordered products for a specific area.
- **Notification System:** Users and admins notified once order successfully.
- **API Documentation:** Automatically generated API documentation using Swagger.

## **Tech Stack**

- **Backend Framework:** NestJS
- **Message Broker:** RabbitMQ
- **Database ORM:** Prisma
- **Database:** MySql
- **Authentication:** JWT (optional for securing APIs)
- **Notification:** Firebase Messaging
- **Testing:** Jest
- **Containerization:** Docker

## **Setup**

### **Prerequisites**

Before starting, ensure you have the following installed:

- **Node.js** (>= 18.x)
- **Docker** and **Docker Compose** (for containerization)
- **MySql**

### **Step 1: Clone the Repository**

Clone this repository to your local machine:

```bash
git clone https://github.com/adhamaly/products-recommendation.git
cd products-recommendation
```

### **Step 2: Install Dependencies**

To install the necessary dependencies for the project, run the following command:

```bash
yarn install
```

### **Step 3: Configure Environment Variables**

Create a .env file in the root directory of the project by copying the example file:

```bash
cp .env.example .env
```

```bash
NODE_ENV="dev"
# DATABASE SECRETS
MYSQL_ROOT_USER=root
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=rabbitmart

# nest run in docker container
DATABASE_URL="mysql://root:${MYSQL_ROOT_PASSWORD}@mysql:3306/rabbitmart"

# nest run locally
#DATABASE_URL="mysql://${MYSQL_ROOT_USER}:${MYSQL_ROOT_PASSWORD}@localhost:3306/${MYSQL_DATABASE}"

# USER SECRETS
USER_JWT_SECRET=""
USER_JWT_EXPIRY=

# ADMIN SECRETS
ADMIN_JWT_SECRET=""
ADMIN_JWT_EXPIRY=7200

# ADMIN ACCOUNT
ADMIN_EMAIL="admin@admin.com"
ADMIN_PASSWORD=""


SALT=

RABBITMQ_URI="amqp://rabbitmq:5672"

FIREBASE_PROJECT_ID=""
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_EMAIL=""
```

### **Step 3: Step 4: Prisma Migrations**

Generate the database schema with Prisma:

```bash
yarn run migrate:deploy
```

### **Step 5: Step 4: Running the Application**

Local Development
To run the app in development mode, use the following command

```bash
yarn run start:dev
```

Docker Setup
Alternatively, you can use Docker to run the application. Build and run the containers using

```bash
docker-compose up --build
```

The app will be available at http://localhost:3000/rabbit-mart/docs.
