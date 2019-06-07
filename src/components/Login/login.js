import React from 'react';
import './login.less';
import { Card, Input, Icon, Button } from 'antd';
import firebase from '../../Firebase/firebase';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', logingIn: false };
  }

  handleLogin = async () => {

    this.setState({ logingIn: true });
    let success = false;
    let errorMessage = null;
    try {
      await firebase.signIn(this.state);
      success = true;
    } catch (error) {
      success = false;
      errorMessage = error.message;
    } finally {
      this.onLoginAttemp(success, errorMessage);
    }

  }

  onLoginAttemp = (result, message = null) => {
    this.setState({ logingIn: result });
    this.props.onLogin(result || null, message);
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }


  render() {
    return (
      <div className="container">
        <Card title="Iniciar Sesión" className="login-card">
          <form className="card-content">
            <Input addonBefore={<Icon type="user" />} name="email" value={this.state.email} onChange={this.handleChange} />
            <Input.Password onKeyUp={(e) => (e.keyCode === 13 ? this.handleLogin() : null)} addonBefore={<Icon type="key" />} name="password" value={this.state.password} onChange={this.handleChange} />
            <Button type="primary" loading={this.state.logingIn} onClick={this.handleLogin}>Acceder</Button>
          </form>
        </Card>
      </div>
    );
  }

}

export default Login;
