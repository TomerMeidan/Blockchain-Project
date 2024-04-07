# HD Wallet - Blockchain Project

This guide will help you set up and run the HD Wallet - Blockchain Project on your local machine. It's divided into two main sections: Frontend and Backend, each with its own set of instructions.

## Frontend Setup

### Step 1: Navigate to the Frontend Directory

Open your terminal and navigate to the frontend directory of the project.

```shell
cd frontend
```

### Step 2: Install Dependencies

Within the frontend directory, install the necessary packages using npm.

```shell
npm i
```

### Step 3: Configure Environment Variables

Create a `.env` file in the frontend directory and set the `VITE_BACKEND_URL` variable to point to your backend server.

```
VITE_BACKEND_URL=http://localhost:3000
```

### Step 4: Start the Frontend Application

Run the following command to start the React application.

```shell
npm run dev
```

## Backend Setup

### Step 1: Navigate to the Backend Directory

Open your terminal and navigate to the backend directory of the project.

```shell
cd backend
```

### Step 2: Install Dependencies

Within the backend directory, install the necessary packages using npm.

```shell
npm i
```

### Step 3: Configure Environment Variables

Create a `.env` file in the backend directory and set the `alchemy_api_key` and `block_cypher_api` variables with your respective API keys.

```
alchemy_api_key=your_alchemy_api_key_here
block_cypher_api=your_block_cypher_api_key_here
```

### Step 4: Start the Backend Application

Run the following command to start the backend server.

```shell
npm run dev
```

## Note:

For mainnet transaction changes, you need to modify the `backend/ethWallet.js` file. Specifically, change `ethTestNet` to `ethMainNet` on lines 57 and 72.

---
