const p = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconSliders = () => (
  <svg {...p}>
    <path d="M3 5h8M15 5h2M3 10h2M9 10h8M3 15h10M17 15h0" />
    <circle cx="13" cy="5" r="2" />
    <circle cx="7" cy="10" r="2" />
    <circle cx="15" cy="15" r="2" />
  </svg>
);

export const IconUser = () => (
  <svg {...p}>
    <circle cx="10" cy="6.5" r="3.5" />
    <path d="M3.5 17c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" />
  </svg>
);

export const IconHistory = () => (
  <svg {...p}>
    <path d="M3 10a7 7 0 1 0 2.2-5.1M3 3.5V6h2.5M10 6v4l2.5 1.5" />
  </svg>
);
