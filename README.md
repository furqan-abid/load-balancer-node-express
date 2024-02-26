# Node.js Load Balancer

This project is a lightweight and customizable Node.js load balancer built with Express. It efficiently distributes incoming web traffic across multiple backend servers to optimize performance, reliability, and scalability of your web applications.

## Features

- **Efficient Load Distribution**: Distributes incoming HTTP and HTTPS requests across multiple backend servers.
- **SSL Termination**: Accepts HTTPS requests and handles SSL termination for enhanced security.
- **Health Checks**: Monitors the health of backend servers with configurable health check endpoints.
- **Session Affinity**: Implements session affinity/stickiness to route requests from the same client to the same backend server.
- **Customizable Balancing Strategies**: Supports various load balancing algorithms, including weighted round-robin.
- **Dynamic Scaling**: Gracefully handles server additions or removals for seamless scalability.
- **Logging and Monitoring**: Provides detailed logging and metrics for monitoring and analysis.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/furqan-abid/load-balancers.git

   mkdir ssl
openssl req -nodes -new -x509 -keyout ssl/key.pem -out ssl/cert.pem

npm install

npm run dev:all
