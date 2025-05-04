import config from "../../../config/app";

export function validatePagination({
    limit,
    page,
}: {
    limit?: number;
    page?: number;
}) {
    const { page: defaultPage, perPage: defaultLimit } = config.pagination;

    const rawLimit = typeof limit === "number" ? limit : defaultLimit;
    const rawPage = typeof page === "number" ? page : defaultPage;

    const safeLimit = Math.min(Math.max(rawLimit, 1), defaultLimit);
    const safePage = Math.max(rawPage, 1);

    return { limit: safeLimit, page: safePage };
}
