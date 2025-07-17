import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("/dashboard", "routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/quote-bank", "routes/quote-bank.tsx"),
  route("/journal", "routes/journal.tsx"),
  route("/ai-chat/:chatId?", "routes/ai-chat.tsx"),
  route("/saved-chats", "routes/saved-chats.tsx"),
  route("/*", "routes/not-found.tsx"),
] satisfies RouteConfig;
