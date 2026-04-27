import { useState } from 'preact/hooks';

function truncateText(text, maxLength) {
	if (text.length <= maxLength) {
		return text;
	}

	const clipped = text.slice(0, maxLength).trimEnd();
	const lastSpace = clipped.lastIndexOf(' ');

	if (lastSpace > maxLength * 0.6) {
		return clipped.slice(0, lastSpace).trimEnd();
	}

	return clipped;
}

export function ExpandableText({
	text,
	maxLength = 180,
	fallback = 'Sans contenu',
	quote = false,
	expandedByDefault = false,
	class: wrapperClass = '',
	contentClass = '',
	buttonClass = '',
	moreLabel = 'Voir plus',
	lessLabel = 'Voir moins',
}) {
	const [expanded, setExpanded] = useState(expandedByDefault);
	const normalizedText = String(text ?? '').trim();
	const hasOverflow = normalizedText.length > maxLength;
	const baseText = normalizedText || fallback;
	const displayText = hasOverflow && !expanded ? `${truncateText(baseText, maxLength)}...` : baseText;
	const wrapperClasses = ['min-w-0', wrapperClass].filter(Boolean).join(' ');
	const contentClasses = [contentClass, 'text-flow'].filter(Boolean).join(' ');
	const toggleClasses = [
		'mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.3em] text-primary transition-colors hover:text-primary/80',
		buttonClass,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div class={wrapperClasses}>
			<p class={contentClasses}>
				{quote ? '"' : ''}
				{displayText}
				{quote ? '"' : ''}
			</p>
			{hasOverflow && (
				<button
					type="button"
					aria-expanded={expanded}
					onClick={() => setExpanded((value) => !value)}
					class={toggleClasses}
				>
					<span class="material-symbols-outlined text-[16px]">{expanded ? 'expand_less' : 'expand_more'}</span>
					{expanded ? lessLabel : moreLabel}
				</button>
			)}
		</div>
	);
}
