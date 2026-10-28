import type { ComplaintUpdate } from "../types/complaintUpdate";

export const complaintUpdateTestData: ComplaintUpdate[] = [
  {
    id: 1,
    complaintId: 1,
    status: "Submitted",
    adminNote: "Your late-bus report has been received.",
  },
  {
    id: 2,
    complaintId: 2,
    status: "Submitted",
    adminNote: "Your missed-stop report has been received.",
  },
  {
    id: 3,
    complaintId: 3,
    status: "Submitted",
    adminNote: "Your service report has been received.",
  },
  {
    id: 4,
    complaintId: 4,
    status: "Submitted",
    adminNote: "Your overcrowding report has been received.",
  },
  {
    id: 5,
    complaintId: 2,
    status: "In Progress",
    adminNote: "The missed stop is being investigated.",
  },
  {
    id: 6,
    complaintId: 3,
    status: "In Progress",
    adminNote: "The team is reviewing your report.",
  },
  {
    id: 7,
    complaintId: 3,
    status: "Resolved",
    adminNote: "The service review has been completed.",
  },
  {
    id: 8,
    complaintId: 4,
    status: "Resolved",
    adminNote: "The overcrowding report has been reviewed.",
  },
  {
    id: 9,
    complaintId: 1,
    status: "Submitted",
    adminNote: "Your report is waiting for assignment.",
  },
  {
    id: 10,
    complaintId: 2,
    status: "In Progress",
    adminNote: "The investigation is still in progress.",
  },
];