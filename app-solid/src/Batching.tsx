import { batch, createEffect, createSignal, onMount } from "solid-js";

export const Reproduction = () => {
  const [value1, setValue1] = createSignal<number>(0);
  const [value2, setValue2] = createSignal<number>(0);

  createEffect(() => {
    if (value1() === 1) {
      console.log('value1 effect', value1());
      setValue1(value1() + 1);
      console.log('value1 effect', value1());
    }
  })

  createEffect(() => {
    if (value2() === 1) {
      console.log('value2 effect', value2());
      setValue2(value2() + 1);
      console.log('value2 effect', value2());
    }
  })

  const handleValue1Click = () => {
    console.log('before value1', value1());
    setValue1(value1() + 1)
    console.log('before value1', value1());
  }

  const handleValue2Click = () => {   
    batch(() => {
      console.log('before value2', value2());
      setValue2(value2() + 1);
      console.log('after value2', value2());
      setValue2(value2() + 2);
      console.log('after value2', value2());
    })
  }

  onMount(() => handleValue1Click())

  return <div>
    <button onClick={handleValue2Click}>Click</button>
  </div>
}