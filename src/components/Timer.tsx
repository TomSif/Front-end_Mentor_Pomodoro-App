import useSettings from "../hooks/useSettings";

function Timer() {
  const { settings } = useSettings();
  return <p className="text-black">{settings.color}</p>;
}

export default Timer;
