import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "./icons";
import {Switch} from "@nextui-org/react";

export const ThemeSwitch = () => {
	const { theme, setTheme } = useTheme();
	const isSSR = useIsSSR();

	const onChange = () => {
		theme === "light" ? setTheme("dark") : setTheme("light");
	};

	return (
		<Switch
			defaultSelected={theme === "light" || isSSR}
			size="lg"
			color="success"
			startContent={<SunFilledIcon size={18} />}
			endContent={<MoonFilledIcon size={18} />}
			aria-label={`Switch to ${theme === "light" || isSSR ? "dark" : "light"} mode`}
			onChange={onChange}
			className="px-px transition-opacity hover:opacity-80 cursor-pointer"
			wrapperClassName={(classNames) =>
				clsx([
					"w-auto h-auto",
					"bg-transparent",
					"rounded-lg",
					"flex items-center justify-center",
					"group-data-[selected=true]:bg-transparent",
					"!text-default-500",
					"pt-px",
					"px-0",
					"mx-0",
					classNames?.wrapper,
				])
			}
		>
			<VisuallyHidden>
				<input />
			</VisuallyHidden>
		</Switch>
	);
};
