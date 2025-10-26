import { IconProps } from "./types";

const IconArrowDown = ({ width = "30px", height = "30px", color = '#fff', className }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={color} height={height} width={width} viewBox="0 0 24 24">
      <g clip-path="url(#clip0_429_11251)">
      <path d="M7 10L12 15" stroke="#292929" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 15L17 10" stroke="#292929" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
      <clipPath id="clip0_429_11251">
      <rect width="24" height="24" fill="white"/>
      </clipPath>
      </defs>
    </svg>
  );
};
export default IconArrowDown;
