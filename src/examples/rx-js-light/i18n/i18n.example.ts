import { translationsExample } from './translations.example';
import { formatDateExample } from './format-date.example';
import { formatCurrencyExample } from './format-currency.example';
import { translationsShortcutsExample } from './translations.shortcuts.example';
import { formatRelativeTimeExample } from './format-relative-time.example';

export async function i18nExample() {
  await formatDateExample();
  // await formatRelativeTimeExample();
  // await formatCurrencyExample();
  // await translationsExample();
  // await translationsShortcutsExample();
}
