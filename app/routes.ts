import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("/dashboard", "routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/quote-bank", "routes/quote-bank.tsx"),
  route("/journal", "routes/journal.tsx"),
  route("/ai-chat/:chatId?", "routes/ai-chat.tsx"),
  route("/saved-chats", "routes/saved-chats.tsx"),
  route("/saved-quotes", "routes/saved-quotes.tsx"),
  route("/profile", "routes/profile.tsx"),
  route("/mind-bank", "routes/mind-bank.tsx"),
  route("/badges", "routes/badges.tsx"),
  route("/daily-routine", "routes/daily-routine.tsx"),
  route("/*", "routes/not-found.tsx"),
] satisfies RouteConfig;
