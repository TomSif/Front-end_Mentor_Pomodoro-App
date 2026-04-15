import { SettingsProvider } from "./context/SettingsProvider";
import Timer from "./components/Timer";

function App() {
  return (
    <div className="flex flex-col items-center w-full bg-blue-850 max-h-screen h-screen py-8">
      <SettingsProvider>
        <Timer />
      </SettingsProvider>
    </div>
  );
}

export default App;
