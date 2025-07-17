import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("/dashboard", "routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/*", "routes/not-found.tsx"),
] satisfies RouteConfig;
