import { createSignal, createEffect } from 'solid-js';

export function State1() {
  const [a, setA] = createSignal(1);
  const [b, setB] = createSignal(8);
  const [c, setC] = createSignal(3);
  const [d, setD] = createSignal(4);
  
  // Effect 1
  createEffect(() => {
    setA(b() + c());
  });

  // Effect 2
  createEffect(() => {
    setD(a() * 2);
  });

  // Effect 3
  createEffect(() => {
    if (a() > 10) {
			console.log('resetting');
			setB(0);
      setC(0);
		}
  });

  // Effect 4
  createEffect(() => {
    console.log({ a:a(), b:b(), c:c(), d:d() })
  });

  return null;
}
