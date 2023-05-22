export declare enum ClientRequestMethod {
    GET = "get",
    POST = "post",
    PUT = "put",
    HEAD = "head",
    DELETE = "delete",
    OPTIONS = "options"
}
export interface ClientRequestBaseResponse<T> {
    success: boolean;
    data: T;
    pagination?: ClientResponsePagination;
}
export interface ClientResponsePagination {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links: {
        next_page: number | null;
        prev_page: number | null;
    };
}
