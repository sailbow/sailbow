import { useNavigate, useParams as useReactRouterParams } from "react-router";

export function useParams<T extends Record<string, string>>() {
  return useReactRouterParams() as T;
}

export function redirect(to: string): never {
  window.location.assign(to);
  throw new Error(`Redirecting to ${to}`);
}

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (to: string) => navigate(to),
    replace: (to: string) => navigate(to, { replace: true }),
    back: () => navigate(-1),
  };
}

export function usePathname() {
  return window.location.pathname;
}