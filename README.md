# Fetch In Parallel

This is a code lab to test the most optimal solution to fetch a given number of urls limited by a given number of how many urls should be fetched concurrently.

## Built With

- NodeJs,
- Typescript,
- Node Fetch,

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- Node v16

### Install

```
npm install
```

### Usage

Without the max number of concurrently requests (defaults to 5)
```
npm run start
```

Informing the max number of concurrently requests: 

```
npm run start 10
``` 

### Run tests

Unit tests:
```
npm run test
``` 
integrations tests (triggers several external requests):
```
npm run test:integration
```

## Authors

👤 **Sergio Torres**

- Github: [@Torres-ssf](https://github.com/Torres-ssf)
- Linkedin: [torres-ssf](https://www.linkedin.com/in/torres-ssf/)

## 📝 License

This project is [MIT](lic.url) licensed.
