# Tuition Management System

## Project Description

Here goes your awesome project description!

## Technologies Used

* TypeScript
* React
* DynamoDB
* AWS S3
* ExpressJS
* Jest
* Log4js

## Features

* The employee is able to request a reimbursement
* The employee may upload files to the system.
* The elevated user may review the requested reimbursement
* The elevated user may deny, approve, request more information, etc. from the employee.
* The elevated user may append comments to the request.

## Getting Started
Clone the repository
   
```
git clone https://github.com/210524training/ddl-trms.git
```
In the backend and frontend:

- Use the `.env.example` to create a `.env` file, and fill out the information.

For the backend:

- Create a DynamoDB table (called `TRMS`), and an S3 Bucket (called `trms-backend-filestorage`)

Once all of that is set-up `cd` into `trms-back-end`, and do an `npm install`. Do the same for the frontend `cd` onto `trms-front-end`, and do an `npm install`

```
cd trms-back-end && npm install && cd .. && cd trms-front-end && npm install && cd ..
```

Run the frontend:
```
npm run start
```

Run the backend:
```
npm run build:start:prod
```

## Screenshots

> Images of what it should look like

## Usage

> Here, you instruct other people on how to use your project after they’ve installed it. This would also be a good place to include screenshots of your project in action.

## License

This project uses the following license: [MIT](./LICENSE).

