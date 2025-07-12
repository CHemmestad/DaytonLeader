export function getVhPx(percent) {
  return `${(window.innerHeight * (percent / 100)).toFixed(2)}px`;
}