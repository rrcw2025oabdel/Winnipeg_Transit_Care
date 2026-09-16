interface Complaint {
  complaintId: number;
  userId: number;
  route: string;
  title: string;
  description: string;
  status: string;
}

const availableRoutes: string[] = [
  "BLUE - Unicity Mall / University of Manitoba",
  "FX2 - Main / St. Mary's",
  "FX3 - Regent / Grant",
  "FX4 - Gateway / Portage",
  "F5 - McPhillips / Donald",
  "F6 - McGregor / Osborne",
  "F7 - St. Anne's / Provencher",
  "F8 - Henderson / Pembina",
  "F9 - Lagimodiere / Abinojii Mikanah",
];