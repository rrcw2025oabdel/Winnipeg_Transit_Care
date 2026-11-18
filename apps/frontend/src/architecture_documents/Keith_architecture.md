# Sprint 3 Architecture — Keith Robles

**Project:** Winnipeg Transit Care  
**Individual resource:** CreateComplaint

My work involves the setup for complaint creation, providing sample complaints, and complaintService. The complaintService  
was setup first to make integration easier for the other team members and avoid merge conflicts.  

## Types: complaint

**What does it do?** Provides the type/interface variables that is used in Complaint Services.

**Why does the logic belong here?** Centralized standard of variables to improve scalability and easier changing of variables  
related to complaint creation.  

**Where is it used?** complaintRepository, CreateComplaint, Data/Complaints, and complaintService use it for their type variables to maintain  
consistency and scalability.

## Data: complaints

**What does it do?** Provides ten sample complaint data.  

**Why does the logic belong here?** To provide a sample dataset before database implementation.

**Where is it used?** complaintRepository, CreateComplaint, Data/Complaint, and complaintService use it for their type variables to maintain consistency and scalability.

## Repository: complaintRepository

**What does it do?** Imports ten sample complaints from data/complaints and provides getAll, getByComplaintId, create, update and delete methods, and notifications for changes. It also setups the id for the complaints as it is made.

**Why does the logic belong here?** Reading and interacting with Data are made through this file's methods.

**Where is it used?** complaintService uses the methods to allow creation, reading, updating, and deleting of complaints. These  methods are also made to follow the CRUD requirements.  

## Service: complaintService

**What does it do?** Initial setup for how a complaint created and interacted with. Includes the basic CRUD interaction with the  
Complaint Repository , of Creating a  
complaint, showing a complaint by either User ID or Complaint ID or all, Updating a complaint, and deleting/cancelling of  a
complaint.  

**Why does the logic belong here?** It is a service that allows interaction with complaints and the creation of it. In the backend  
side, it serves as the primary method of interacting with the database without directly opening the database itself.

**Where is it used?** It is used in the component feature CreateComplaint and by the complaint hook.  

## Component integration

The components included required refactoring of CreateComplaint and also the main setup for future integrations related to the  
project. Complaints were once isolated and is now being actively changed and updated to allow the entire system to interact with  
each other with little to no discrepancy.  
