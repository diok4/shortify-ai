export const sendMessage = async (message: string) => {
  const res = await fetch("/api/chat", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return res.json();
};
