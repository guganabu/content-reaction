import "./App.scss";
import Reaction from "./components/Reaction";

function App() {
  return (
    <div className="App">
      <div className="Content">
        <div className="Body">
          <img
            src={window.location.href + "logo192.png"}
            width="60"
            alt="logo"
          />
          <div className="Body-content">
            <span>UserId: 10</span> <span>ContentId: 1</span>
          </div>
        </div>
        <Reaction userId={10} contentId={1} />
      </div>
      <div className="Content">
        <div className="Body">
          <img
            src={window.location.href + "logo192.png"}
            width="60"
            alt="logo"
          />
          <div className="Body-content">
            <span>UserId: 1</span> <span>ContentId: 2</span>
          </div>
        </div>
        <Reaction userId={1} contentId={2} />
      </div>
    </div>
  );
}

export default App;
