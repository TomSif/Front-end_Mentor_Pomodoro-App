import { SettingsProvider } from "./context/SettingsProvider";

function App() {
  return (
    <>
      <SettingsProvider>
        <h1 className="text-white bg-black">TEST TAILWINDCSS</h1>
      </SettingsProvider>
    </>
  );
}

export default App;
