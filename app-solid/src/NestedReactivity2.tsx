import { Accessor, createSignal, JSX, For } from 'solid-js';

type Value = {
  id: number;
  state: Accessor<boolean>;
  toggleState: () => void;
};

//Simplified implementation based off https://www.solidjs.com/tutorial/stores_nested_reactivity?solved
export const NestedReactivity2 = () => {
  const [value, setValue] = createSignal<Value[]>([]);
  let latestId = 0;

  const handleClick = () => {
    const [state, setState] = createSignal<boolean>(false);
    setValue([
      ...value(),
      {
        id: latestId,
        state: state,
        toggleState: () => setState((prev) => !prev),
      },
    ]);

    latestId++;
  };

  return (
    <div>
      <button onclick={handleClick}>append</button>
      <div>
        <For each={value()}>
          {(it) => (
            <div style={{ display: 'flex', gap: '8px' }}>
              <div>{it.id}</div>
              <div>{`${it.state()}`}</div>
              <button onClick={it.toggleState}>toggle</button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
