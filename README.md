# Anti-Counterfeit Product Identification System Using Blockchain

The Anti-Counterfeit Product Identification System Using Blockchain is an innovative solution that uses blockchain technology to combat counterfeit products in various industries. It uses QR codes, smart contracts, and the Ethereum network to provide a secure and transparent platform for tracking and verifying product authenticity. The system is significant in addressing global supply chain issues by reducing the prevalence of counterfeit goods and enhancing transparency and trust. 

## Live Demo
Here is a live demo of the full functionality of the project 



## Table of Contents
- [Overview](#overview)
- [Basic Walkthrough](#basic-walkthrough)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Project Setup](#project-setup)

## Overview
The Anti-Counterfeit Product Identification System Using Blockchain is a groundbreaking solution designed to combat global supply chain issues related to counterfeit products. It leverages the unique capabilities of blockchain technology to provide a secure and transparent platform for tracking and verifying the authenticity of products across various industries.

The system uses QR codes, an overt technology that can be scanned by a smartphone app, to verify product information and origin. It employs smart contracts to store and execute product verification logic on the blockchain, ensuring tamper-proof data and trustless transactions. The Ethereum network serves as its decentralized database to store product information and status, accessible by authorized parties. A web interface, powered by React, allows users to interact with the system and view product information and history.

The technologies used in this system include Solidity for smart contract development, Hardhat for Ethereum development environment, React for building the user interface, Node.js and Express for backend development, MongoDB/Mongoose for the database, and ethers.js for interacting with the Ethereum blockchain.

This system is significant in solving global supply chain issues as it provides a reliable method to verify the authenticity of products, thereby reducing the prevalence of counterfeit goods. It enhances transparency and trust among stakeholders in the supply chain, from manufacturers to consumers. 

## Basic Walkthrough
- The `identeefi-backend-node` directory contains the codebase for the backend of the system (Node.js + MongoDB).
- The `identeefi-frontend-react` directory contains the codebase for the frontend of the system.
- The `identeefi-smartcontract-solidity` directory contains the smart contract deployed to the Ethereum network.

## Technologies Used
- Solidity
- Hardhat
- React
- Node.js
- MongoDB / Mongoose
- ethers.js

## Features
- **QR Codes**: The system uses QR codes as an overt technology that can be scanned by a smartphone app to verify the product information and origin.
- **Smart Contracts**: The system uses smart contracts to store and execute the product verification logic on the blockchain, ensuring tamper-proof data and trustless transactions.
- **Ethereum Network**: The system uses the Ethereum network as its decentralized database to store the product information and status, which can be accessed by authorized parties.
- **Web Interface**: The system uses a web interface powered by React to allow users to interact with the system and view the product information and history.

## Project Setup
To get started with this project, 
1. Clone the repository.
2. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) and ensure it is running.
3. In `identeefi-backend-node`, run `npm i` to install dependencies, then run `node seed.js` to populate the database with test data, and run `npm start` to start the backend server.
4. In `identeefi-frontend-react`, run `npm i --legacy-peer-deps` to install the dependencies and run `npm start` to start localhost.
5. You can inspect `identeefi-smartcontract-solidity` directory to view the smart contract details that is deployed to the Sepolia Testnet.
6. To perform transactions, setup your Metamask wallet and connect your wallet to the **Sepolia Testnet Network** and transact using Sepolia ETH, which can be obtained for free on the [Google Cloud Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) or [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia).
7. The deployed smart contract address on Sepolia is: `0x0C778A1762BEb8878947E56966E56EC8F476ebAc`

For more information, you can view our user manual:
[View User Manual](/user-manual.pdf)



