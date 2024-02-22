import * as React from "react";
import { IconSvgProps } from "@/types";

export const Logo: React.FC<IconSvgProps> = ({
	size = 36,
	width,
	height,
	...props
}) => (
	<svg
		fill="none"
		height={size || height}
		viewBox="0 0 32 32"
		width={size || width}
		{...props}
	>
		<image
			width="100%"
			height="100%"
			href="/logo.svg" // Update the href with the correct path to your logo.svg file
		/>
	</svg>
);

export const FacebookIcon: React.FC<IconSvgProps> = ({
														 size = 24,
														 width,
														 height,
														 ...props
													 }) => {
	return (
		<svg
			height={size || height}
			viewBox="0 0 24 24"
			width={size || width}
			{...props}
		>
			<path
				d="M0,12.94C0,12.31.04,10.98.04,10.94c.14-1.62.58-3.16,1.36-4.58C3.27,2.98,6.1.91,9.89.18c.4-.08.81-.12,1.21-.18h1.78c.03.05.08.04.13.04,2.92.26,5.45,1.4,7.49,3.5,2.87,2.95,3.98,6.5,3.3,10.56-.82,4.94-4.77,8.86-9.72,9.72-.18.03-.22,0-.22-.18,0-2.66,0-5.31,0-7.97,0-.18.05-.22.22-.22.8,0,1.59,0,2.39,0,.14,0,.2-.02.22-.18.15-1.03.31-2.05.48-3.07.03-.19-.01-.22-.19-.22-.98,0-1.95,0-2.93,0-.13,0-.19-.02-.19-.17.01-.73,0-1.47.01-2.2.02-.97.59-1.59,1.55-1.72.57-.07,1.14-.03,1.71-.03.14,0,.21-.01.21-.18,0-.87,0-1.73,0-2.6,0-.13-.03-.18-.16-.19-1.11-.16-2.23-.3-3.36-.16-1.02.13-1.92.52-2.62,1.31-.77.88-1.06,1.93-1.08,3.07-.02.89,0,1.78,0,2.67,0,.17-.04.22-.22.22-.87,0-1.75,0-2.62,0-.16,0-.21.03-.21.2,0,1.02,0,2.05,0,3.07,0,.17.05.21.21.2.88,0,1.76,0,2.65,0,.15,0,.2.03.2.19,0,2.67,0,5.34,0,8.01,0,.16-.03.19-.19.16-2.63-.47-4.87-1.68-6.69-3.62-1.62-1.72-2.64-3.75-3.05-6.08-.07-.4-.12-.79-.18-1.19h0Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const InstagramIcon: React.FC<IconSvgProps> = ({
	size = 24,
	width,
	height,
	...props
}) => {
	return (
		<svg
			height={size || height}
			viewBox="0 0 24 24"
			width={size || width}
			{...props}
		>
			<path
				d="M24,12v6.73c-.01,2.53-1.88,4.73-4.37,5.16-.29.05-.58.08-.87.08-4.51,0-9.02.01-13.53,0-2.52,0-4.71-1.89-5.14-4.37-.05-.29-.08-.59-.08-.89-.01-4.49-.01-8.98-.01-13.48C0,2.71,1.89.51,4.37.08c.29-.05.59-.08.88-.08C9.76,0,14.27,0,18.78,0c2.5,0,4.72,1.91,5.13,4.37.06.34.09.68.09,1.02v6.61h0ZM21.03,11.98h.02c0-.72.01-1.43,0-2.15-.02-.74-.04-1.48-.09-2.21-.05-.72-.24-1.42-.58-2.06-.76-1.43-1.98-2.21-3.55-2.49-.71-.13-1.43-.14-2.14-.15-1.52,0-3.04,0-4.56,0-.89,0-1.78,0-2.66.12-.74.09-1.44.29-2.08.68-1.31.78-2.03,1.96-2.29,3.44-.12.68-.15,1.36-.15,2.04,0,2.05,0,4.1.02,6.15,0,.64.06,1.27.22,1.9.33,1.32,1.05,2.35,2.23,3.04.84.49,1.77.68,2.73.72.79.03,1.58.05,2.37.05,1.59,0,3.18,0,4.77-.02.63,0,1.26-.05,1.88-.2,1.81-.44,3.02-1.53,3.58-3.31.23-.72.29-1.47.29-2.22.01-1.1,0-2.2,0-3.3v-.02ZM19.45,11.98c-.01,1.03-.02,2.07-.04,3.1-.01.6-.03,1.2-.18,1.78-.35,1.35-1.23,2.15-2.59,2.39-.48.09-.98.12-1.48.13-1.41.02-2.81.03-4.22.03-.86,0-1.73-.02-2.59-.05-.57-.02-1.13-.09-1.66-.29-1.02-.39-1.64-1.12-1.92-2.17-.16-.58-.19-1.18-.2-1.78-.02-1.88-.03-3.77-.02-5.65,0-.63.04-1.27.11-1.9.1-.92.48-1.72,1.24-2.3.47-.35,1-.53,1.57-.62.82-.13,1.65-.13,2.47-.13,1.47,0,2.93-.01,4.4,0,.67,0,1.35.04,2.02.11.92.1,1.72.47,2.3,1.22.36.47.55,1,.64,1.57.13.84.12,1.68.13,2.53v2h.01v.03ZM16.64,11.98c0-2.57-2.08-4.65-4.65-4.65s-4.66,2.08-4.66,4.65,2.08,4.66,4.66,4.66,4.65-2.08,4.65-4.66ZM16.82,6.06c-.6,0-1.08.49-1.08,1.09s.49,1.08,1.09,1.09c.6,0,1.09-.49,1.09-1.1s-.49-1.08-1.09-1.08h-.01ZM8.95,11.97c0-1.66,1.36-3.03,3.02-3.03s3.05,1.35,3.05,3.01-1.35,3.05-3.02,3.06c-1.68,0-3.04-1.35-3.04-3.04h-.01Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const DriveIcon: React.FC<IconSvgProps> = ({
	size = 24,
	width,
	height,
	...props
}) => {
	return (
		<svg
			height={size || height}
			viewBox="0 0 24 24"
			width={size || width}
			{...props}
		>
			<path
				d="M11.98,24C5.36,23.98-.05,18.56,0,11.98.05,5.33,5.39,0,12,0c6.62,0,12.01,5.4,12,12.01-.01,6.62-5.41,12.01-12.01,11.99ZM19.41,13.36c-.05-.1-.06-.15-.09-.19-1.57-2.73-3.15-5.46-4.72-8.19-.08-.14-.17-.17-.32-.17-1.34,0-2.67,0-4.01,0-.06,0-.12,0-.2.01.04.09.07.14.1.19,1.57,2.72,3.14,5.44,4.71,8.17.08.15.18.19.34.19,1.02-.01,2.04-.01,3.06-.01.37,0,.74,0,1.14,0ZM9.28,5.28c-.05.05-.07.07-.08.09-1.59,2.76-3.19,5.52-4.77,8.28-.05.08-.03.24.02.33.53.93,1.08,1.86,1.62,2.79.16.28.33.56.5.86.06-.09.1-.16.14-.23,1.42-2.46,2.84-4.92,4.26-7.39.17-.3.47-.62.47-.92,0-.31-.3-.62-.48-.92-.56-.96-1.12-1.92-1.69-2.9ZM7.36,18.04c.08,0,.12.02.15.02,3.17,0,6.34,0,9.52,0,.1,0,.24-.11.3-.2.66-1.13,1.31-2.27,1.95-3.41.04-.07.07-.14.12-.23-.08,0-.13,0-.18,0-3.15,0-6.31,0-9.46,0-.16,0-.24.07-.31.2-.61,1.08-1.24,2.16-1.85,3.25-.07.12-.14.25-.23.41Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const MoonFilledIcon = ({
	size = 24,
	width,
	height,
	...props
}: IconSvgProps) => (
	<svg
		aria-hidden="true"
		focusable="false"
		height={size || height}
		role="presentation"
		viewBox="0 0 24 24"
		width={size || width}
		{...props}
	>
		<path
			d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
			fill="currentColor"
		/>
	</svg>
);

export const SunFilledIcon = ({
	size = 24,
	width,
	height,
	...props
}: IconSvgProps) => (
	<svg
		aria-hidden="true"
		focusable="false"
		height={size || height}
		role="presentation"
		viewBox="0 0 24 24"
		width={size || width}
		{...props}
	>
		<g fill="currentColor">
			<path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
			<path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
		</g>
	</svg>
);

export const HeartFilledIcon = ({
	size = 24,
	width,
	height,
	...props
}: IconSvgProps) => (
	<svg
		aria-hidden="true"
		focusable="false"
		height={size || height}
		role="presentation"
		viewBox="0 0 24 24"
		width={size || width}
		{...props}
	>
		<path
			d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
			fill="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
		/>
	</svg>
);

export const SearchIcon = (props: IconSvgProps) => (
	<svg
		aria-hidden="true"
		fill="none"
		focusable="false"
		height="1em"
		role="presentation"
		viewBox="0 0 24 24"
		width="1em"
		{...props}
	>
		<path
			d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
		/>
		<path
			d="M22 22L20 20"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
		/>
	</svg>
);

export const NextUILogo: React.FC<IconSvgProps> = (props) => {
  const { width, height = 40 } = props;

  return (
    <svg
      fill="none"
      height={height}
      viewBox="0 0 161 32"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-black dark:fill-white"
        d="M55.6827 5V26.6275H53.7794L41.1235 8.51665H40.9563V26.6275H39V5H40.89L53.5911 23.1323H53.7555V5H55.6827ZM67.4831 26.9663C66.1109 27.0019 64.7581 26.6329 63.5903 25.9044C62.4852 25.185 61.6054 24.1633 61.0537 22.9582C60.4354 21.5961 60.1298 20.1106 60.1598 18.6126C60.132 17.1113 60.4375 15.6228 61.0537 14.2563C61.5954 13.0511 62.4525 12.0179 63.5326 11.268C64.6166 10.5379 65.8958 10.16 67.1986 10.1852C68.0611 10.1837 68.9162 10.3468 69.7187 10.666C70.5398 10.9946 71.2829 11.4948 71.8992 12.1337C72.5764 12.8435 73.0985 13.6889 73.4318 14.6152C73.8311 15.7483 74.0226 16.9455 73.9968 18.1479V19.0773H63.2262V17.4194H72.0935C72.1083 16.4456 71.8952 15.4821 71.4714 14.6072C71.083 13.803 70.4874 13.1191 69.7472 12.6272C68.9887 12.1348 68.1022 11.8812 67.2006 11.8987C66.2411 11.8807 65.3005 12.1689 64.5128 12.7223C63.7332 13.2783 63.1083 14.0275 62.6984 14.8978C62.2582 15.8199 62.0314 16.831 62.0352 17.8546V18.8476C62.009 20.0078 62.2354 21.1595 62.6984 22.2217C63.1005 23.1349 63.7564 23.9108 64.5864 24.4554C65.4554 24.9973 66.4621 25.2717 67.4831 25.2448C68.1676 25.2588 68.848 25.1368 69.4859 24.8859C70.0301 24.6666 70.5242 24.3376 70.9382 23.919C71.3183 23.5345 71.6217 23.0799 71.8322 22.5799L73.5995 23.1604C73.3388 23.8697 72.9304 24.5143 72.4019 25.0506C71.8132 25.6529 71.1086 26.1269 70.3314 26.4434C69.4258 26.8068 68.4575 26.9846 67.4831 26.9663V26.9663ZM78.8233 10.4075L82.9655 17.325L87.1076 10.4075H89.2683L84.1008 18.5175L89.2683 26.6275H87.103L82.9608 19.9317L78.8193 26.6275H76.6647L81.7711 18.5169L76.6647 10.4062L78.8233 10.4075ZM99.5142 10.4075V12.0447H91.8413V10.4075H99.5142ZM94.2427 6.52397H96.1148V22.3931C96.086 22.9446 96.2051 23.4938 96.4597 23.9827C96.6652 24.344 96.9805 24.629 97.3589 24.7955C97.7328 24.9548 98.1349 25.0357 98.5407 25.0332C98.7508 25.0359 98.9607 25.02 99.168 24.9857C99.3422 24.954 99.4956 24.9205 99.6283 24.8853L100.026 26.5853C99.8062 26.6672 99.5805 26.7327 99.3511 26.7815C99.0274 26.847 98.6977 26.8771 98.3676 26.8712C97.6854 26.871 97.0119 26.7156 96.3973 26.4166C95.7683 26.1156 95.2317 25.6485 94.8442 25.0647C94.4214 24.4018 94.2097 23.6242 94.2374 22.8363L94.2427 6.52397ZM118.398 5H120.354V19.3204C120.376 20.7052 120.022 22.0697 119.328 23.2649C118.644 24.4235 117.658 25.3698 116.477 26.0001C115.168 26.6879 113.708 27.0311 112.232 26.9978C110.759 27.029 109.302 26.6835 107.996 25.9934C106.815 25.362 105.827 24.4161 105.141 23.2582C104.447 22.0651 104.092 20.7022 104.115 19.319V5H106.08V19.1831C106.061 20.2559 106.324 21.3147 106.843 22.2511C107.349 23.1459 108.094 23.8795 108.992 24.3683C109.993 24.9011 111.111 25.1664 112.242 25.139C113.373 25.1656 114.493 24.9003 115.495 24.3683C116.395 23.8815 117.14 23.1475 117.644 22.2511C118.16 21.3136 118.421 20.2553 118.402 19.1831L118.398 5ZM128 5V26.6275H126.041V5H128Z"
      />
      <path
        className="fill-black dark:fill-white"
        d="M23.5294 0H8.47059C3.79241 0 0 3.79241 0 8.47059V23.5294C0 28.2076 3.79241 32 8.47059 32H23.5294C28.2076 32 32 28.2076 32 23.5294V8.47059C32 3.79241 28.2076 0 23.5294 0Z"
      />
      <path
        className="fill-white dark:fill-black"
        d="M17.5667 9.21729H18.8111V18.2403C18.8255 19.1128 18.6 19.9726 18.159 20.7256C17.7241 21.4555 17.0968 22.0518 16.3458 22.4491C15.5717 22.8683 14.6722 23.0779 13.6473 23.0779C12.627 23.0779 11.7286 22.8672 10.9521 22.4457C10.2007 22.0478 9.5727 21.4518 9.13602 20.7223C8.6948 19.9705 8.4692 19.1118 8.48396 18.2403V9.21729H9.72854V18.1538C9.71656 18.8298 9.88417 19.4968 10.2143 20.0868C10.5362 20.6506 11.0099 21.1129 11.5814 21.421C12.1689 21.7448 12.8576 21.9067 13.6475 21.9067C14.4374 21.9067 15.1272 21.7448 15.7169 21.421C16.2895 21.1142 16.7635 20.6516 17.0844 20.0868C17.4124 19.4961 17.5788 18.8293 17.5667 18.1538V9.21729ZM23.6753 9.21729V22.845H22.4309V9.21729H23.6753Z"
      />
    </svg>
  );
};
