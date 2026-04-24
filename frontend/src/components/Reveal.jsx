import { useEffect, useRef, useState } from 'preact/hooks';

export function Reveal({
	as: Tag = 'div',
	class: className = '',
	delay = 0,
	threshold = 0.18,
	once = true,
	style = {},
	children,
	...props
}) {
	const ref = useRef(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return undefined;

		if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
			setVisible(true);
			return undefined;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					if (once) observer.disconnect();
				} else if (!once) {
					setVisible(false);
				}
			},
			{ threshold },
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, [once, threshold]);

	return (
		<Tag
			ref={ref}
			class={['reveal', visible ? 'is-visible' : '', className].filter(Boolean).join(' ')}
			style={{ ...style, '--reveal-delay': `${delay}ms` }}
			{...props}
		>
			{children}
		</Tag>
	);
}
