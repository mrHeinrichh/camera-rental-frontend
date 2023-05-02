export function generateKey(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
  return result;
}
