import type { Complaint } from "../types/complaint";
// This file contains a list of predefined complaints for testing and demonstration purposes.
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
    {
      complaintId: 5,
      userId: 1,
      route: "D10 - Panet",
      title: "Bus arrived late",
      description:
        "The D10 bus arrived more than 20 minutes late at a Panet route stop.",
      status: "Submitted",
      archived: false,
    },
    {
      complaintId: 6,
      userId: 1,
      route: "D11 - Salter",
      title: "Missing stop announcement",
      description:
        "The D11 bus did not announce the next stop along the Salter route.",
      status: "In Progress",
      archived: false,
    },
    {
      complaintId: 7,
      userId: 1,
      route: "D12 - Ellice",
      title: "Bus did not arrive",
      description:
        "The D12 bus did not arrive during its scheduled time on the Ellice route.",
      status: "Submitted",
      archived: false,
    },
    {
      complaintId: 8,
      userId: 1,
      route: "22 - Portage",
      title: "Overcrowded bus",
      description:
        "The 22 Portage bus was too crowded to allow more passengers.",
      status: "Resolved",
      archived: false,
    },
    {
      complaintId: 9,
      userId: 1,
      route: "28 - Arlington",
      title: "Bus arrived early",
      description:
        "The 28 Arlington bus left the stop before its scheduled departure time.",
      status: "In Progress",
      archived: false,
    },
    {
      complaintId: 10,
      userId: 1,
      route: "101 - South St, Vital On-Request",
      title: "On-Request bus did not arrive",
      description:
        "The 101 On-Request bus did not arrive for a scheduled St. Vital pickup.",
      status: "Submitted",
      archived: false,
    }
]