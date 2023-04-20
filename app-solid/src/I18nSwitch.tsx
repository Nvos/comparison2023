import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { Rerun } from '@solid-primitives/keyed';

const ref = i18n;

await dynamicActivate('en');

export async function dynamicActivate(locale: string) {
  const { messages } = await import(`./locales/${locale}.po`);

  ref.load(locale, messages);
  ref.activate(locale);
}

export const I18nSwitch = () => {
  const [locale, setLocale] = createSignal<'en' | 'ar' | undefined>('en');
  // const
  const handleChangeLocale = () => {
    setLocale(ref.locale as 'en' | 'ar');
    console.log('changing locale', ref.locale);
  };

  onMount(async () => {
    dynamicActivate('en');
    ref.on('change', handleChangeLocale);
  });

  onCleanup(() => {
    ref.removeListener('change', handleChangeLocale);
  });

  return (
    <Rerun on={locale}>
      <div>
        <p>{t({ message: 'Hello some text en 1' })}</p>
        <p>{i18n._('Hello some text en 2', {})}</p>
        <div>
          <button onClick={() => dynamicActivate('en')}>en</button>
          <button onClick={() => dynamicActivate('ar')}>ar</button>
        </div>
      </div>
    </Rerun>
  );
};
