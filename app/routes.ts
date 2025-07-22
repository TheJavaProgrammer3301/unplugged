import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("/dashboard", "routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/quote-bank", "routes/quote-bank.tsx"),
  route("/journal/:journalId?", "routes/journal.tsx"),
  route("/journal-entries", "routes/journal-entries.tsx"),
  route("/ai-chat/:chatId?", "routes/ai-chat.tsx"),
  route("/saved-chats", "routes/saved-chats.tsx"),
  route("/saved-quotes", "routes/saved-quotes.tsx"),
  route("/profile", "routes/profile.tsx"),
  route("/mind-bank", "routes/mind-bank.tsx"),
  route("/badges", "routes/badges.tsx"),
  route("/daily-routine", "routes/daily-routine.tsx"),
  route("/weekly-summary", "routes/weekly-summary.tsx"),
  route("/streak", "routes/streak.tsx"),
  route("/shop", "routes/shop.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/leaderboard", "routes/leaderboard.tsx"),
  route("/*", "routes/not-found.tsx"),
] satisfies RouteConfig;
