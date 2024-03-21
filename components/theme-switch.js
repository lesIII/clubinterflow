import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "./icons";
import { Switch } from "@nextui-org/react";

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

		>
			<VisuallyHidden>
				<input />
			</VisuallyHidden>
		</Switch>
	);
};
