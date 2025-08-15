import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <Outlet /> {/* This is where child routes render */}
    </>
  );
}

export default App;
