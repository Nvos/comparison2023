import { Component } from "solid-js";
import { Calc } from "./Calc";
import { Button } from "./Complex";
import { Reactivity1 } from "./Reactivity1";

const IconLeft: Component<{ count: number }> = (props) => {
  return <div>{props.count}</div>;
};

export const App = () => {
  return (
    <div>
      <Button IconLeft={IconLeft} count={0} loading={false}>
        Button!
      </Button>
    </div>
  );
};
