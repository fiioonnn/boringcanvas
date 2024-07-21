<script>
	export let color = "#f0f0f0";
	export let size = 1;
</script>

<svg
	width="30"
	height="30"
	viewBox="0 0 30 30"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g id="icon_size">
		<circle
			id="outer"
			cx="15"
			cy="15"
			r="14.5"
			stroke={size >= 14 ? color : "#ffffff"}
		/>
		<circle
			id="inner"
			cx={size}
			cy={size}
			r={size}
			transform="matrix(1 0 0 -1 {15 - size} {size + 15})"
			fill={color}
		/>
	</g>
</svg>
