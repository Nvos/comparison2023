import { useEffect, useState } from "react";
type Props = {
  wtf: number;
}
export const State2 = () => {
  const [count, setCount] = useState(0);
  const [isSmallerThan10, setIsSmallerThan10] = useState(true);
  useEffect(() => {
    if (count < 10) {
      console.log("smaller", count);
      setCount(11);
    } else {
      console.log("larger", count);
      setIsSmallerThan10(false);
    }
  }, [count, setCount, setIsSmallerThan10]);

  return null;
};
