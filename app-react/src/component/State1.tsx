import { useState, useEffect } from 'react';

export const State1 = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(8);
  const [c, setC] = useState(3);
  const [d, setD] = useState(4);
  
  useEffect(() => {
    setA(b + c);
  }, [b, c]);

    useEffect(() => {
    setD(a * 2);
  }, [a]);

  useEffect(() => {
    if (a > 10) {
			console.log('resetting');
			setB(0);
      setC(0);
		}
  }, [a]);

  useEffect(() => {
    console.log({ a, b, c, d })
  }, [a,b,c,d]);

  return <div />;
}
