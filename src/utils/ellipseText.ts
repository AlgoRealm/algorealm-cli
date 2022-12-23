export function ellipseText(text = ``, maxLength = 9999): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + `...`;
  }
  return text;
}
