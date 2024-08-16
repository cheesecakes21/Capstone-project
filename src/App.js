import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Form from "./Form.js";

function App() {
  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path="/" components={Form} />
            <Route path="/app" components={Form} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
