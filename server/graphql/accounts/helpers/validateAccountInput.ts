export function validateAccountInput({
    name,
    email,
}: {
    name: string;
    email: string;
}) {
    if (!name.trim()) {
        throw new Error("Name is required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
    }
}
