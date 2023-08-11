# Backend Assessment

Build an uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## Overview

- Signup with email verification.
- CRUD operations for URL checks (`GET`, `PUT` and `DELETE` can be called only by the user user who created the check).
- Authenticated users can receive a notification whenever one of their URLs goes down or up again:
  - Email.
  - Webhook *(optional)*.
- Authenticated users can get detailed uptime reports about their URLs availability, average response time, and total uptime/downtime.
- Authenticated users can group their checks by tags and get reports by tag.

## Acceptance Criteria

- APIs should be consuming and producing `application/json`.
- Authenication should be stateless.
- Each URL check may have the following options:
  - `name`: The name of the check.
  - `url`: The URL to be monitored.
  - `protocol`: The resource protocol name `HTTP`, `HTTPS`, or `TCP`.
  - `path`: A specific path to be monitored *(optional)*.
  - `port`: The server port number *(optional)*.
  - `webhook`: A webhook URL to receive a notification on *(optional)*.
  - `timeout` *(defaults to 5 seconds)*: The timeout of the polling request *(optional)*.
  - `interval` *(defaults to 10 minutes)*: The time interval for polling requests *(optional)*.
  - `threshold` *(defaults to 1 failure)*: The threshold of failed requests that will create an alert *(optional)*.
  - `authentication`: An HTTP authentication header, with the Basic scheme, to be sent with the polling request *(optional)*.
    - `authentication.username`
    - `authentication.password`
  - `httpHeaders`: A list of key/value pairs custom HTTP headers to be sent with the polling request (optional).
  - `assert`: The response assertion to be used on the polling response (optional).
    - `assert.statusCode`: An HTTP status code to be asserted.
  - `tags`: A list of the check tags (optional).
  - `ignoreSSL`: A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.
- Each report may have the following information:
  - `status`: The current status of the URL.
  - `availability`: A percentage of the URL availability.
  - `outages`: The total number of URL downtimes.
  - `downtime`: The total time, in seconds, of the URL downtime.
  - `uptime`: The total time, in seconds, of the URL uptime.
  - `responseTime`: The average response time for the URL.
  - `history`: Timestamped logs of the polling requests.

## Evaluation Criteria

- Code quality.
- Code scalability as we should be able to add a new alerting notification channel like Slack, Firebase, SMS, etc.. with the minimum possible changes.
- Unit tests.

## Bonus

- API documentation.
- Docker and Docker Compose.
- [Pushover](https://pushover.net/) integration to receive alerts on mobile devices.

Try your best to implement as much as you can from the given requirements and feel free to add more if you want to.


# Solution Guide

This guide will walk the user of this application through how to run the project, access the api docs, and finally run the tests

## Setup
- Clone this repo, make sure you have docker installed and running on your machine 
- In the cloned folder where the `docker-compose.yml` is found run ```docker-compose build ``` and ``` docker-compose up  ```
- These commands will build out the container and image used to run the project
- After startring the container the application will be served on `localhost:8080`

## Accessing the image
- If you want to access a terminal session inside the container run this command  ```docker exec -it {folder the project resides in}-app-1 bash```
- This will start a terminal session inside the container

## Running Tests 
- I have written unit tests for the user model, this is due time and deadline constraint imposed by another project that I was handed however it demonstrates how I run tests that include the DB using an in memory db
- To run the tests start a bash session as seen in the [Accessing the image](#accessing-the-image) section
- Run ```npm test```
  
## API docs 
- Start the container 
- Go to `localhost:8080/api-docs` 
- You will see the docs implemented in Swagger with all the APIs and their relevant information

