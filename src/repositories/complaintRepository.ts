import { listedComplaints } from "../data/complaints";
import type {
    CreateComplaint,
    Complaint,
} from "../types/complaint";

let complaints: Complaint[] = listedComplaints.map((complaint) => ({
    ...complaint,
}))

let nextId = Math.max(...complaints.map((complaint) => complaint.complaintId), 0) + 1;

export const complaintRepository = {
    async getAll(): Promise<Complaint[]> {
        return complaints.map((complaint) => ({
        ...complaint,
        }));
    },

    async getForUser(id: number): Promise<Complaint | null> {
        const complaint = complaints.find(
        (complaint) => complaint.userId === id,
        );

        return complaint ? { ...complaint } : null;
    },

    async getByComplaintId(id: number): Promise<Complaint | null> {
        const complaint = complaints.find(
        (complaint) => complaint.complaintId === id,
        );

        return complaint ? { ...complaint } : null;
    },

    async create(input: CreateComplaint): Promise<Complaint> {
        const complaint: Complaint = {
        complaintId: nextId++,
        ...input,
        };

        complaints = [...complaints, complaint];

        return { ...complaint };
    },

    async cancelByUserId(id: number): Promise<boolean> {
        const originalLength = complaints.length;

        complaints = complaints.filter(
        (complaint) => complaint.userId !== id,
        );

        return complaints.length < originalLength;
    },

    async cancelByComplaintId(id: number): Promise<boolean> {
        const originalLength = complaints.length;

        complaints = complaints.filter(
        (complaint) => complaint.complaintId !== id,
        );

        return complaints.length < originalLength;
    },
};