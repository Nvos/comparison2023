import { createEffect, onMount } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

type Value = {
  value1: {
    value2: {
      value3: {
        valueArray: { id: number; state: boolean }[];
      };
    };
  };
};

export const Store = () => {
  const [values, setValues] = createStore<Value>({
    value1: {
      value2: {
        value3: {
          valueArray: [
            { id: 1, state: false },
            { id: 2, state: true },
          ],
        },
      },
    },
  });

  const [values1, setValues1] = createStore<Value>({
    value1: {
      value2: {
        value3: {
          valueArray: [
            { id: 1, state: false },
            { id: 2, state: true },
          ],
        },
      },
    },
  });

  onMount(() => {
    setValues(
      'value1',
      'value2',
      'value3',
      'valueArray',
      (it) => it.id === 1,
      'state',
      (state) => !state
    );

    setValues1(
      'value1',
      'value2',
      'value3',
      'valueArray',
      (it) => it.id === 1,
      produce((value) => {
        value.state = !value.state;
      })
    );
  });

  createEffect(() =>
    console.log('value', values.value1.value2.value3.valueArray[1].state)
  );

  createEffect(() =>
    console.log('value1', values1.value1.value2.value3.valueArray[1].state)
  );

  return null;
};
