import React, { useEffect, useState } from 'react';

const Counter: React.FC = () => {
  let [count, setCount] = useState<number>(0);

  // useEffect(() => {
  //   dbSave(count);
  // }, [count]);

  const increment = (): void => {
    const newCount = count + 1;
    setCount(newCount);
    dbSave(newCount);
  };

  const dbSave = (count: number): void => {
    console.log('Saving to DB:', count);
  };

  return (
    <div>
      <p>Count: {count}</p>

      <button onClick={increment}>Increment</button>
    </div>
  );
};

export default Counter;
