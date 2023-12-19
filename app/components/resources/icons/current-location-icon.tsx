// icon:current-location | Tabler Icons https://tablericons.com/ | Csaba Kissi

function IconCurrentLocation(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M15 12 A3 3 0 0 1 12 15 A3 3 0 0 1 9 12 A3 3 0 0 1 15 12 z" />
      <path d="M20 12 A8 8 0 0 1 12 20 A8 8 0 0 1 4 12 A8 8 0 0 1 20 12 z" />
      <path d="M12 2v2M12 20v2M20 12h2M2 12h2" />
    </svg>
  );
}

export default IconCurrentLocation;
