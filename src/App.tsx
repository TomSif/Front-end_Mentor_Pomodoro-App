import { SettingsProvider } from "./context/SettingsProvider";
import Timer from "./components/Timer";
import ModeSelector from "./components/ModeSelector";

function App() {
  return (
    <div className="flex flex-col items-center w-full bg-blue-850 max-h-screen h-screen py-8">
      <SettingsProvider>
        <header className="w-full px-6 mb-10">
          <h1 className="mx-auto text-white text-center  ">Pomodoro</h1>
        </header>
        <nav>
          <ModeSelector />
        </nav>
        <main>
          <Timer />
        </main>
        <footer></footer>
      </SettingsProvider>
    </div>
  );
}

export default App;
