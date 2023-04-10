import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

export const State4 = () => {
  const [componentValue, setComponentValue] = createSignal<number>(0)
  const [storeValue, setStoreValue] = createStore<{value: number}>({value: 0});

  const handleStoreClick = () => {
    setStoreValue({value: storeValue.value + 1})
    console.log('store click', storeValue.value);
  }

  const handleComponentClick = () => {
    setComponentValue(componentValue() + 1)
    console.log('component click', componentValue());
  }

  createEffect(() => console.log('store effect', storeValue.value));
  createEffect(() => console.log('component effect', componentValue()))

  return <div>
    <button onClick={handleStoreClick}>Click store</button>
    <button onClick={handleComponentClick}>Click component</button>
  </div>
}