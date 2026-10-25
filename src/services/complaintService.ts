import { complaintRepository } from "../repositories/complaintRepository";
import type {
    CreateComplaint,
    Complaint,
} from "../types/complaint";

function validateComplaint(input: CreateComplaint): void {
    const errors: string[] = [];

    if (input.title.trim().length < 1) {
        errors.push(
            "Please Fill the Title.",
        );
    }

    if (errors.length > 0) {
        throw new ValidationError(errors);
    }
}

export const complaintService = {
    async getAll(): Promise<Complaint[]> {
        return complaintRepository.getAll();
    },

    async getForUser(
        id: number,
    ): Promise<Complaint | null> {
        if (!Number.isInteger(id) || id < 1) {
        return null;
        }

        return complaintRepository.getForUser(id);
    },

    async getByComplaintId(
        id: number,
    ): Promise<Complaint | null> {
        if (!Number.isInteger(id) || id < 1) {
        return null;
        }

        return complaintRepository.getByComplaintId(id);
    },

    async create(input: CreateComplaint): Promise<Complaint> {
        validateComplaint(input);

        const complaintInput: CreateComplaint = {
            ...input,
            title: input.title.trim(),
            description: input.description?.trim() || undefined,
        };

        return complaintRepository.create(complaintInput);
    },

    async cancelByUserId(id: number): Promise<void> {
        if (!Number.isInteger(id) || id < 1) {
        throw new Error("Invalid User ID.");
        }

        const removed = await complaintRepository.cancelByUserId(id);

        if (!removed) {
        throw new Error("Complaint not found.");
        }
    },

    async cancelByComplaintId(id: number): Promise<void> {
        if (!Number.isInteger(id) || id < 1) {
        throw new Error("Invalid complaint ID.");
        }

        const removed = await complaintRepository.cancelByComplaintId(id);

        if (!removed) {
        throw new Error("Complaint not found.");
        }
    },
};