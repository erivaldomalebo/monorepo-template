interface PaginationMapperParams<T> {
	data: T[];
	total: number;
	path: string;
	page?: number;
	limit?: number;
}

export interface ReadWithPagination<T> {
	data: T[];
	pagination: {
		previousPage: string | null;
		currentPage: string;
		nextPage: string | null;
		lastPage: number;
		hasNextPage: boolean;
		total: number;
	};
}

export function paginationMapper<T>({
	data,
	total,
	page = 1,
	limit = 10,
	path,
}: PaginationMapperParams<T>): ReadWithPagination<T> {
	const lastPage = Math.ceil(total / limit);
	const hasPrev = page > 1;
	const hasNext = page < lastPage;

	return {
		data,
		pagination: {
			previousPage: hasPrev
				? `${path}?page=${page - 1}&limit=${limit}`
				: null,
			currentPage: `${path}?page=${page}&limit=${limit}`,
			nextPage: hasNext
				? `${path}?page=${page + 1}&limit=${limit}`
				: null,
			lastPage,
			hasNextPage: hasNext,
			total,
		},
	};
}
