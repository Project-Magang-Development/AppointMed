/* eslint-disable react/no-deprecated */
import React from "react";
import ReactDOM from "react-dom";
import SchedulerComponent from "./embededScheduleReact";

const App: React.FC = () => {
  const apiKey =
    document.querySelector("script[apiKey]")?.getAttribute("apiKey") || "";

  return (
    <div id="app-container">
      <SchedulerComponent apiKey={apiKey} />
    </div>
  );
};

const rootElement = document.getElementById("schedules-root");
if (rootElement) {
  ReactDOM.render(<App />, rootElement);
}

export default App;
