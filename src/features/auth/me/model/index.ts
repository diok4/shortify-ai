export const getMe = async () => {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
  });

  return res.json();
};
