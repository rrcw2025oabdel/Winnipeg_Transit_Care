import type { Complaint } from "../types/complaint";

export const listedComplaints: Complaint[] = [
        {
      complaintId: 1,
      userId: 1,
      route: "Route 5 - Portage",
      title: "Bus arrived late by 30 minutes",
      description: 
        "The bus arrived approximately 30 minutes late.",
      status: "Submitted",
      archived: false,
    },
    {
      complaintId: 2,
      userId: 1,
      route: "Route 15 - Saint Vital",
      title: "Bus did not stop",
      description:
        "The bus passed the stop even though passengers were waiting and did not stop.",
      status: "In Progress",
      archived: false,
    },
    {
      complaintId: 3,
      userId: 1,
      route: "Route 16 - Saint boniface",
      title: "Bus did not stop",
      description:
        "The bus passed the stop even though passengers were waiting and did not stop.",
      status: "Resolved",
      archived: false,
    },
    {
      complaintId: 4,
      userId: 1,
      route: "Route 10 - North Main",
      title: "Overcrowded bus",
      description:
        "The bus was too crowded to allow more passengers.",
      status: "Resolved",
      archived: false,
    },
]