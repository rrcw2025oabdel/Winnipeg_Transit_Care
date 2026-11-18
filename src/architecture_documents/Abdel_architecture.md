# Sprint 3 Architecture — Abdelhamid Oughanem

**Project:** Winnipeg Transit Care  
**Individual resource:** ComplaintUpdate

My work records admin status changes and feedback linked to existing complaints. The admin form stays for the actual sprint 3 on the same page, and each complaint displays its update history, newest first.

## Hook: useComplaintUpdates

**What does it do?** Returns the customer's updates, loading state and loading errors.

**Why does the logic belong here?** It manages React presentation behaviour using the shared useAsyncList hook. Validation and data access remain in the service and repositories.

**Where is it used?** MyComplaints calls it to display feedback under each active or archived complaint.

## Service: complaintUpdateService

**What does it do?** Validates the complaint, status and minimum five-character note. It updates the shared complaint status, creates a feedback record and selects updates belonging to a customer.

**Why does the logic belong here?** Validation, ownership-based selection and coordination between resources are business rules. The service delegates storage to repositories.

**Where is it used?** AdminStatusForm calls create on submission. useComplaintUpdates calls getForUser and subscribes to changes.

## Repository: complaintUpdateRepository

**What does it do?** Imports ten typed test records and provides getAll, getById, create, update and delete methods, plus change notifications.

**Why does the logic belong here?** Reading and modifying resource data are data-access concerns. The repository contains no React state or business validation.

**Where is it used?** complaintUpdateService reads and creates records through it. Update/delete methods complete the CRUD contract without exposing customer editing controls.

## Modified shared service: complaintService

**What does it do?** Continues handling customer complaint operations. I removed its old updateStatus method when moving admin feedback to the separate update resource.

**Why does the logic belong here?** Customer complaint rules remain separate from admin-update rules; repositories retain data access.

**Where is it used?** The existing complaint hook and pages use it for complaint operations, including archive/restore.

## Component integration

AdminStatusForm and MyComplaints contain explanatory comment blocks. The form delegates submissions to the update service, while the page uses the update hook to display every response. I felt that displaying both the latest and previous admin updates could be confusing, so I updated the CSS to distinguish them visually.

