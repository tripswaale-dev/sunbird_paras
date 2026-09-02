export interface AdminPaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface AdminPaginatedResult<T> {
  data: T[];
  meta: AdminPaginationMeta;
}
