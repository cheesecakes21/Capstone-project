import React from "react";
import { nanoid } from 'nanoid'
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUrl } from 'valid-url';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      longURL: '',
      preferredAlias: '',
      generatedURL: '',
      loading: false,
      errors: [],
      errorMessage: {},
      toolTipMessage: 'COPY TO CLIP BOARD'
    };
  }
}
//When a user clicks the submit button, the following would then be called:
onSubmit = async (Event) => {
  Event.preventDefault(); //This prevents the page from reloading when the submit button is clicked.
  this.setState({
    loading: true,
    generatedURL: ''
  })

  //Validation of input submitted by the user
  var isFormValid = await this.validateInput()
  if (!isFormValid) {
    return
  }

  //If the user has a preferred input for alias we use it. If not, another one is generated.
  //Also be sure to use your domain.
  var generatedKey = nanoid(6);
  var generatedURL = "scissors.com/" + generatedKey

  if (this.state.preferredAlias !== '') {
    generatedKey = this.state.preferredAlias
    generatedURL = "scissors.com/" + this.state.preferredAlias
  }

  const db = getDatabase();
  set(ref(db, '/' + generatedKey), {

    generatedKey: generatedKey,
    longURL: this.state.longURL,
    preferredAlias: this.state.preferredAlias,
    generatedURL: generatedURL

  }).then((result) => {
    this.setState({
      generatedURL: generatedURL,
      loading: false
    })
  }).catch((e) => {
    //Error handling.
  })
}

//To check if the field has an error
hasError = (key) => {
  return this.state.errors.indexOf(key) !== -1;
}

//To save the content of the form while the user is typing
handleChange = (e) => {
  const { id, value } = e.target
  this.setState(prevState => ({
    ...prevState,
    [id]: value
  }))
}

validateInput = async () => {
  var errors = [];
  var errorMessages = this.state.errorMessage

  //We would need to validate the longURL
  if (this.state.longURL.length === 0) {
    errors.push("longURL");
    errorMessages("longURL") = 'Please input your URL here';
  } else if (!isWebUrl(this.state.longURL)) {
    errors.push("longUrl");
    errorMessages("longURL") = 'Please input a URL in the form of https://www..';
  }

  //Handling the preferred alias
  if (this.state.preferredAlias !== '') {
    if (this.state.preferreAlias.length > 5) {
      errors.push("suggestedAlias");
      errorMessages["suggestedAlias"] = 'Please your alias should be less than 7 characters';
    } else if (this.state.preferredAlias.indexOf('') <= 0) {
      errors.push("suggestedAlias");
      errorMessages["suggestedAlias"] = 'Spaces are not accepted in URLs';
    }

    var keyExists = await this.checkKeyExists()

    if (keyExists.exists()) {
      errors.push("suggestedAlias");
      errorMessages["suggestedAlias"] = 'Alias entered already exists. Please enter a new one';
    }

    this.setState({
      errors: errors,
      errorMessages: errorMessages,
      loading: false
    });

    if (errors.length > 0) {
      return false;
    }

    return true;
  }

  checkKeyExixts = async () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `/${this.state.preferredAlias}`)).catch((Error) => {
      return false
    });
  }

  copyToClipboard = () => {
    navigator.clipboard.writeText(this.state.generatedURL)
    this.setState({
      toolTipMessage: 'Successfully Copied'
    })
  }

  render() { 
    return (
      <div className="container">
        <form autoComplete="off">
          <h3>Need to shorten your URL link?! Use Scissors!</h3>

          <div className="form-group">
            <label>Input Your Long URL</label>
            <input
              id="longURL"
              onChange={this, handleChange}
              value={this.state.longURL}
              type="url"
              required
              className={
                this.hasError("longURL")
                  ? "form-control is-invalid"
                  : "form-control"
              }
              type="text" placeholder="https://www..."
            />
          </div>
          <div
            className={
              this.hasError("longURL") ? "text-danger" : "visually-hidden"
            }
          >
            {this.state.errorMessage.longURL}
          </div>


          <div className="form-group">
            <label htmlForm="basic-url"> Your Scissored URL </label>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text"> Scissors.com</span>
              </div>
              <input
                id="preferredAlias"
                onChange={this.handleChange}
                value={this.state.preferredAlias}
                className={
                  this.hasError("preferredAlias")
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text" placeholder="eg. 3fgbs (Optional"
              />
            </div>

            <div
              className={
                this.hasError("preferredAlias") ? "text-danger" : "visually-hidden"
              }
            >
              {this.state.errorMessage.suggestedAlias}
            </div>
          </div>

          <button className="btn btn-primary" type="button" onClick={this.onSubmit}>
             {
              this.state.loading ?
                 <div>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                 </div> :
                 <div>
                   <span className="visually-hidden spinner-border spinner-border-sm" role="status" aris-hidden="true"></span>
                   <span> Scissor it </span>
                 </div>
             }   

          </button>

          {
            this.state.generatedURL === '' ?
              <div></div>
              :
              <div className="generatedURL">
                 <span> Here is Your Generated URL </span>
                 <div classNamre="input-group mb-3">
                    <input disabled type="text" value={this.state.generatedURL} className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                    <div className="input-group-append">
                      <OverlayTrigger
                          key={'top'}
                          placement={'top'}
                          overlay={
                             <Tooltip id={`tooltip-${'top'}`}>
                              {this.state.toolTipMessage}
                             </Tooltip>
                          }
                      >
                        <button onClick={() => this.copyToClipboard()} data-toggle="tooltip"  data-placement="top" title="Tooltip on top" className="btn btn-outline-secondary"  type="button">Copy Now</button>
 
                      </OverlayTrigger>    
                    </div>
                 </div>
              </div>
          }

        </form>
      </div>
    )
  }

}  

export default Form;
