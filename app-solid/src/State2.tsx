import { createEffect, createSignal } from "solid-js";

export const State2 = () => {
  const [count, setCount] = createSignal(0);
  const [isSmallerThan10, setIsSmallerThan10] = createSignal(true);

  createEffect(() => {
    if (count() < 10) {
      console.log("smaller", count());
      setCount(11);
    } else {
      console.log("larger", count());
      setIsSmallerThan10(false);
    }
  });

  return null;
};
