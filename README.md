# Facebook Architecture Diagram Generator

This project provides a visual representation of Facebook's high-level system architecture using Mermaid.js. It uses the Model-View-Controller (MVC) pattern and represents various backend, frontend, and storage components.

## Overview

The diagram generated represents the interaction between different layers of Facebook's architecture, including the **Frontend**, **Backend**, and **Storage**. The components such as React, GraphQL, PHP, API Server, Redis, MySQL, Cassandra, and File Storage (e.g., HDFS) are included to provide a clear overview of how Facebook handles user interactions, data processing, and storage.

## Architecture Overview

The diagram represents the following layers:

- **Frontend**: The user interface is primarily built with React, and GraphQL is used to handle efficient data fetching.
- **Backend**: PHP handles server-side logic, while the API server manages interactions between the frontend and the business logic. Redis serves as a cache layer to speed up data retrieval, reducing the load on databases.
- **Storage**: MySQL is used for relational data, Cassandra for NoSQL data, and HDFS for large-scale file storage like images and videos.

## Features

- **Mermaid.js**: Used to render the system architecture as an interactive diagram.
- **Frontend Components**: React and GraphQL for managing user interactions and data fetching.
- **Backend Components**: PHP, API Server, and Cache Layer (Redis).
- **Storage Components**: MySQL, Cassandra (NoSQL), and HDFS for file storage.

## Requirements

To run this project locally, you need the following:

- A modern web browser (Chrome, Firefox, etc.)
- **Mermaid.js** for rendering the architecture diagram.

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/mvc_acrchi.git
   cd mvc_acrchi
