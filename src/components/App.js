import React from 'react';
import Login from './Login/login';
import Cars from './Cars/cars';
import { Layout, Button, Spin, notification } from 'antd';
import firebase from '../Firebase/firebase';

const {
  Header, Content
} = Layout;

class App extends React.Component {

  constructor() {
    super();
    this.state = { isAuth: null, loadingFirebase: true };
    this.sub = {};
  }

  componentDidMount() {
    this.sub = firebase.auth.onAuthStateChanged(firebase => {
      this.setState({
        isAuth: firebase !== null ? true : null,
        loadingFirebase: false
      });
    }, error => {
      notification.error({ message: 'Compruebe su conexion a internet.', description: error.message });
    });
  }

  componentWillUnmount() {
    this.sub();
  }

  logOut = async () => {
    await firebase.signOut();
    this.setState({ isAuth: null });
  }

  authChanged = (result, message) => {
    if (!result) this.openNotification('Error', message);
    this.setState({ isAuth: result });
  }

  openNotification = (message, description) => {
    notification.error({
      key: 'updatable',
      message,
      description,
      duration: 5
    });
  };

  render() {
    return (
      <Layout>
        <Header style={{ paddingLeft: 24, display: 'flex', flexFlow: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
          <h2 style={{ color: '#fff', fontWeight: 'lighter' }}>Autos Phinx</h2>
          {this.state.isAuth && <Button onClick={this.logOut} shape="circle" icon="logout" style={{ float: 'right' }} />}
        </Header>
        <Content style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          {this.state.loadingFirebase ? <div className="spin-wrapper" ><Spin tip="Cargando..." /></div>
            : (this.state.isAuth === null)
              ? <Login onLogin={this.authChanged}></Login >
              : <Cars />}
        </Content>
      </Layout >
    );
  }

}

export default App;
