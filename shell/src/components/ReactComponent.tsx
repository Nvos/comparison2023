import { lazy, useMemo, Suspense } from "react";
// import App from 'app-react';

type Props = {
  app: string;
}

// const App = lazy(() => import('app-react'));
const ReactComponent = ({app}: Props) => {
  console.log(app)
  // return lazy(() => import(`${app}/app.js`));
  const App = useMemo(() => lazy(() => import(app)), [])
  return <Suspense fallback={<div>Loading...</div>}><App /></Suspense>
};

export default ReactComponent;