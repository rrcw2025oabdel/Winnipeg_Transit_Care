# Winnipeg Transit Care

## Project Team

### Team Name

Team2Win

### Team Members

- Abdelhamid Oughanem
- Aubrey Fernandez
- Keith Robles

## Project General Description

Winnipeg Transit Care is a bus route complaint management application designed to help transit users report and track issues they experience while using public transportation.

The application allows users to view bus routes, report an issue related to a specific bus route, and view the status of complaints they have submitted.

Submitted complaints can be reviewed by the complaint department, assigned to a staff member, and updated as they progress toward resolution.

The application focuses on three main areas:

1. Viewing bus routes.
2. Reporting an issue related to a bus route by filling a form.
3. Viewing and tracking complaints submitted by the user and their status.

## High-Level User Stories

- As a transit user, I want to view available bus routes so that I can select the route related to my trip or complaint.

- As a transit user, I want to submit a complaint about a bus route so that I can report an issue I experienced to the complaint department.

- As a transit user, I want to view a list of my submitted complaints so that I can track their status and progress.


## Application Areas

### Bus Routes

Users can view a list of available bus routes. This allows users to identify and select the route associated with their trip or an issue they want to report.

### Bus Route Complaint

Users can report an issue related to a bus route. A complaint may contain information such as the selected route, issue category, date, time, and a description of the problem.

### My Complaints

Logged-in users can view a list of complaints they have submitted and track the current status of each complaint.

## Sprint 1 (Work Done)

### Abdelhamid Oughanem

- Created the initial My Complaints component to display complaint information and statuses.
- Rendered complaint entries from an initial list using React components.

### Aubrey Fernandez

- Created the initial Bus Routes component to display available route information.
- Rendered route entries from an initial list using React components.

### Keith Robles

- Created the initial Bus Route Complaint component and its interface for reporting an issue.

### Team Contributions

- Set up the GitHub repository and initialized the project using Vite, React, and TypeScript.
- Integrated the three feature components into the application.
- Added the application header and footer with the project title and team members’ names.
- Established consistent colours and shared styling.
- Documented the project description, team members, and user stories in the README.
- Used feature branches, pull requests, and peer reviews to integrate contributions.

## Sprint 2 (Work Done)

### Abdelhamid Oughanem

- Developed My Complaints with status filtering and archive/restore actions using `useState` and CSS modules.
- Implemented shared `transitMessage` state, passing its value and setter to each feature page through props.

### Aubrey Fernandez

- Developed Bus Routes with a filtered route list and a favourites button using `useState`.

### Keith Robles

- Developed Create Complaint with a live preview that updates as users type, plus Submit and Cancel actions using `useState`.

### Team Contributions

- Added navigation between feature pages using React Router.
- Practised managing interactive interfaces with `useState`.
- Discussed implementation decisions and completed peer reviews before integrating changes.


