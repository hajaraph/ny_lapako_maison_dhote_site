import { useEffect, useState } from 'preact/hooks';

function clampPage(value, pageCount) {
	const parsed = Number(value);

	if (!Number.isFinite(parsed)) {
		return 1;
	}

	const nextPage = Math.trunc(parsed);
	return Math.min(Math.max(nextPage, 1), pageCount);
}

function buildPageWindow(page, pageCount) {
	if (pageCount <= 7) {
		return Array.from({ length: pageCount }, (_, index) => index + 1);
	}

	const pages = [1];
	const start = Math.max(2, page - 1);
	const end = Math.min(pageCount - 1, page + 1);

	if (start > 2) {
		pages.push('start-ellipsis');
	}

	for (let current = start; current <= end; current += 1) {
		pages.push(current);
	}

	if (end < pageCount - 1) {
		pages.push('end-ellipsis');
	}

	pages.push(pageCount);
	return pages;
}

export function usePagination(collection, pageSize = 6) {
	const items = Array.isArray(collection) ? collection : [];
	const [page, setPage] = useState(1);
	const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

	useEffect(() => {
		setPage((current) => clampPage(current, pageCount));
	}, [pageCount]);

	const safePage = clampPage(page, pageCount);
	const startIndex = items.length === 0 ? 0 : (safePage - 1) * pageSize;
	const pageItems = items.slice(startIndex, startIndex + pageSize);
	const endIndex = pageItems.length === 0 ? 0 : startIndex + pageItems.length;

	return {
		page: safePage,
		pageCount,
		total: items.length,
		pageItems,
		startIndex,
		endIndex,
		goToPage: (nextPage) => setPage(clampPage(nextPage, pageCount)),
		nextPage: () => setPage((current) => clampPage(current + 1, pageCount)),
		prevPage: () => setPage((current) => clampPage(current - 1, pageCount)),
	};
}

export function PaginationControls({
	page,
	pageCount,
	total = 0,
	startIndex = 0,
	endIndex = 0,
	onPageChange,
	class: className = '',
}) {
	if (pageCount <= 1) {
		return null;
	}

	const pages = buildPageWindow(page, pageCount);
	const wrapperClass = ['mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className].filter(Boolean).join(' ');

	return (
		<div class={wrapperClass}>
			<div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline">
				Affichage {startIndex + 1}-{endIndex} sur {total}
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<button
					type="button"
					onClick={() => onPageChange(page - 1)}
					disabled={page <= 1}
					aria-label="Page précédente"
					class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-white text-on-surface transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
				>
					<span class="material-symbols-outlined text-[20px]">keyboard_arrow_left</span>
				</button>

				{pages.map((item) =>
					typeof item === 'number' ? (
						<button
							key={item}
							type="button"
							onClick={() => onPageChange(item)}
							aria-current={item === page ? 'page' : undefined}
							class={`inline-flex min-w-[2.75rem] items-center justify-center rounded-full px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${
								item === page
									? 'bg-primary text-on-primary shadow-soft'
									: 'border border-primary/10 bg-white text-outline hover:border-primary/30 hover:text-on-surface'
							}`}
						>
							{item}
						</button>
					) : (
						<span key={item} class="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-outline">
							...
						</span>
					),
				)}

				<button
					type="button"
					onClick={() => onPageChange(page + 1)}
					disabled={page >= pageCount}
					aria-label="Page suivante"
					class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-white text-on-surface transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
				>
					<span class="material-symbols-outlined text-[20px]">keyboard_arrow_right</span>
				</button>
			</div>
		</div>
	);
}
