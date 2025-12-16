# Frontend – Interview Task

## Purpose

This frontend was built as part of a technical interview task. Its purpose is to demonstrate core frontend skills

## What This Frontend Does

* Consumes the backend GraphQL API
* Displays and manages data through basic CRUD flows
* Demonstrates controlled inputs and validation before submission
* Keeps logic simple and easy to review

## Tech Stack

* JavaScript
* React
* Apollo Client (GraphQL)
* HTML / CSS

## Application Behavior

* Fetches data from the GraphQL API
* Updates UI state based on user actions
* Prevents submitting incomplete or invalid forms
* No hidden logic or side effects

## Running Locally

```
npm install
npm start
```

The frontend runs on:

```
http://localhost:3000/
```

## Backend Dependency

The frontend expects the backend GraphQL endpoint to be available at:

```
/graphql/
```

## Notes for Reviewers

* UI is intentionally minimal
* Focus is on correctness and data flow
* Component are kept small and readable
* No UI libraries or complex styling frameworks

## Scope Limitations

* No global state management
* No advanced error handling
* No performance optimizations

This frontend fulfills the interview requirements and is not intended as a production-ready application.
