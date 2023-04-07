// let isSmallerThan10 = true;
// let count = 1;
// $: if (count) {
//   if (count < 10) {
//     console.error("smaller", count);
//     // this should trigger this reactive block again and enter the "else" but it doesn't
//     count = 11;
//   } else {
//     console.error("larger", count);
//     isSmallerThan10 = false;
//   }

import { createEffect, createSignal } from "solid-js";

export const Reactivity1 = () => {
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

  return (
    <div>
      <div>Component reactivity</div>
      <div>count: {count()}</div>
      <div>isSmallerThan10: {JSON.stringify(isSmallerThan10())}</div>
    </div>
  );
};
