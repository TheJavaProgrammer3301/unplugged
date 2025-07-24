import { extendTheme } from "@mui/joy";

type Theme = {
	colors: {
		primaryBackground: string;
		primaryBackgroundBorder: string;
		userChatBackground: string;
		userChatBorder: string;
		assistantChatBackground: string;
		assistantChatBorder: string;
	}
}

const TEST_THEME: Theme = {
	colors: {
		//rgb(32, 116, 223)
		primaryBackground: "rgb(0, 17, 44)",
		primaryBackgroundBorder: "rgb(0, 17, 44)",
		userChatBackground: "rgb(24, 87, 168)",
		userChatBorder: "rgb(44, 107, 188)",
		assistantChatBackground: "rgb(30, 30, 30)",
		assistantChatBorder: "rgb(50, 50, 50)",
	}
} satisfies Theme;

const UGLY_ASS_THEME = {
	colors: {
		//rgb(32, 116, 223)
		primaryBackground: "linear-gradient(145deg,#1a1a40,indigo,#6a00ff)",
		primaryBackgroundBorder: "linear-gradient(145deg,#1a1a40,indigo,#6a00ff)",
		userChatBackground: "rgb(106, 0, 255)",
		userChatBorder: "rgb(126, 20, 255)",
		assistantChatBackground: "rgba(255, 255, 255, 0.1)",
		assistantChatBorder: "rgba(255, 255, 255, 0.2)",
	}
} satisfies Theme

const DULL_ASS_THEME = {
	colors: {
		primaryBackground: "rgb(20, 20, 20)",
		primaryBackgroundBorder: "rgb(30, 30, 30)",
		userChatBackground: "rgb(75, 75, 75)",
		userChatBorder: "rgb(65, 65, 65)",
		assistantChatBackground: "rgb(30, 30, 30)",
		assistantChatBorder: "rgb(50, 50, 50)"
	}
} satisfies Theme;

export const CURRENT_THEME = DULL_ASS_THEME;

export const CURRENT_JOY_THEME = extendTheme({
	colorSchemes: {
		light: {
			palette: {
				background: {
					// surface: "rgb(20, 20, 20)", // card background
				},
				neutral: {
					outlinedColor: "rgb(255, 255, 255)", // text color
					softBg: CURRENT_THEME.colors.assistantChatBackground,
					plainActiveBg: "white",
					plainActiveColor: "#252525",
					plainHoverBg: "#185EA5",
					plainHoverColor: "white"
				},
				primary: {
					solidBg: CURRENT_THEME.colors.assistantChatBorder,
					solidDisabledBg: CURRENT_THEME.colors.assistantChatBackground,
					outlinedColor: "rgb(255, 255, 255)",
					outlinedBorder: CURRENT_THEME.colors.assistantChatBorder,
				}
			},
		},
	},
});
