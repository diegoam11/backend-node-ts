import { ApolloError } from "apollo-server-express";

export function validateAccountInput({
    name,
    email,
}: {
    name: string;
    email: string;
}) {
    if (!name.trim()) {
        throw new ApolloError("Name is required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApolloError("Invalid email format.");
    }
}
