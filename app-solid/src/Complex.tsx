import {
  ParentComponent,
  JSX,
  splitProps,
  createSignal,
  mergeProps,
  Switch,
  Match,
  createEffect,
  onMount,
  onCleanup,
} from "solid-js";
import { Show } from "./Show";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  count: number;
  loading: boolean;
  onCountIs3?: () => void;
  onCountChange?: (value: number) => void;
  IconLeft: ParentComponent<{ count: number }> | undefined;
};

export const Button: ParentComponent<Props> = ({
  count: initialCount,
  loading,
  onCountIs3,
  onCountChange,
  IconLeft,
  ...other
}) => {
  // const [local, other] = splitProps(
  //   mergeProps({ count: 0, loading: false }, props),
  //   ["count", "loading", "children", "onCountIs3", "onCountChange", "IconLeft"]
  // );

  const [count, setCount] = createSignal(initialCount);

  onMount(() => console.log("mount"));
  onCleanup(() => console.log("cleanup"));

  createEffect(() => {
    if (onCountChange === undefined) {
      return;
    }

    onCountChange(count());
  });

  const handleClick: JSX.EventHandlerUnion<unknown, MouseEvent> = (event) => {
    setCount(count() + 1);

    if (count() === 3) {
      if (onCountIs3 === undefined) {
        return;
      }

      onCountIs3();
    }
  };

  const iconLeftGuard = (
    component?: ParentComponent<{ count: number }>
  ): component is ParentComponent<{ count: number }> => {
    return component !== undefined;
  };

  // const value: number | undefined;
  const obj: { value: number } | undefined = { value: 0 };

  return (
    <button onclick={handleClick} {...other}>
      <Show when={obj}>{obj.value}</Show>

      <Show when={IconLeft}>
        <IconLeft count={count()} />
      </Show>

      <Show when={IconLeft}>
        {(child) => {
          const Component = child();
          return <Component count={count()} />;
        }}
      </Show>
      {/* <Switch fallback={<>Loading...</>}>
        <Match when={!local.loading}>{local.children}</Match>
      </Switch> */}
    </button>
  );
};
