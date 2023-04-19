import { createEffect, createSignal, onCleanup } from 'solid-js';

export const NestedReactivity1 = () => {
  const [value, setValue] = createSignal(1);

  createEffect(() => {
    console.log('nested starts with', value());
    const [nested, setNested] = createSignal(value());

    const ref = setInterval(() => setNested((prev) => prev + prev), 2000);

    createEffect(() => {
      console.log('nested', nested());
    });

    onCleanup(() => {
      console.log('cleanup');
      clearInterval(ref);
    });
  });

  return (
    <div>
      <button onClick={() => setValue((prev) => prev + 1)}>increment</button>
    </div>
  );
};
