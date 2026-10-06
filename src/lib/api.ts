export const SHOP_API = "https://functions.poehali.dev/a1719013-4252-40a6-8f34-309e227c05c8";

export const shopRequest = async (action: string, opts: { method?: string; body?: unknown; password?: string } = {}) => {
  const res = await fetch(`${SHOP_API}?action=${action}`, {
    method: opts.method ?? (opts.body ? "POST" : "GET"),
    headers: {
      "Content-Type": "application/json",
      ...(opts.password ? { "X-Admin-Password": opts.password } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
};
