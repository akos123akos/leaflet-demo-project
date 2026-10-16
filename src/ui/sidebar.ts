// Callers must escape any untrusted data included in `html`.
export function showInfo(html: string): void {
  document.getElementById('info')!.innerHTML = html;
}
