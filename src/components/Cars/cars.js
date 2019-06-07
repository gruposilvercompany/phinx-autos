import React from 'react';
import './cars.less';
import { Table, Button, Modal, Tag, Spin, Tooltip, message } from 'antd';
import firebase from '../../Firebase/firebase';
import NewCar, { CAR } from './new-car/new-car';
import CarDetails from './car-details/car-details';

class Cars extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cars: [],
      visible: false,
      detailModalVisible: false,
      saving: false,
      loading: true,
      selectedCar: CAR
    };
    this.newCar = React.createRef();
    this.detailsCar = React.createRef();
  }

  componentDidMount() {
    firebase.cars()
      .onSnapshot(cars => {
        this.setState({
          cars: cars.docs.map(snapShot => Object.assign(snapShot.data(), { id: snapShot.id })),
          loading: false
        });
      });
  }

  getAllCars = async () => {
    try {
      const cars = await firebase.cars().get();
      this.setState({
        cars: cars.docs.map(snapShot => Object.assign(snapShot.data(), { id: snapShot.id }))
      });
    } catch (error) {
      message.error(error);
    }
  }

  showNewCarModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleSubmit = async () => {

    const { car } = this.newCar.current.state;

    if (this.invalidCar(car)) {
      const eMessage = 'Todos los campos a excepción de la descripción, son requeridos.';
      this.showMessage(eMessage, 'error');
      return;
    }

    try {
      this.setState({ saving: true });
      await firebase.cars().add(car);
      this.newCar.current.clearValues();
      this.showMessage('Procesado correctamente.', 'success');
      this.setState({ visible: false });
    } catch (error) {
      this.showMessage(error.message, 'error');
    } finally {
      this.setState({ saving: false });
    }

  };

  invalidCar = (car) => {
    return (Object.values(car).includes(undefined) || car.available_colors.length < 1);
  }

  showMessage = (text, type) => {
    switch (type) {
      case 'success':
        message.success(text);
        break;
      default:
        message.error(text || 'Error desconocido');
        break;
    }
  }

  handleCancel = (modal) => {
    const modalVisibility = (modal === 'details') ? 'detailModalVisible' : 'visible';

    if (modal !== 'details') {
      this.newCar.current.clearValues();
    }

    this.setState({
      [modalVisibility]: false,
      selectedCar: CAR
    });

  }

  carDetails = (car) => {
    this.setState({ detailModalVisible: true, selectedCar: car });
  }

  onDetailsClose = () => {
    this.setState({ detailModalVisible: false });
  }

  render() {
    return (
      <div>

        <h2 style={{ fontWeight: 'lighter' }}>Listado de vehiculos</h2>

        <Table loading={this.state.loading} onRow={(car) => ({ onClick: () => { this.carDetails(car) } })} dataSource={this.state.cars} rowKey="id" columns={this.columns()} style={{ maxWidth: '100%' }} pagination={{ pageSize: 6 }} />

        <div className="button-panel">
          <Tooltip placement="left" title='Nuevo auto'><Button className="action-button" onClick={this.showNewCarModal} type="primary" shape="circle" icon="plus" /></Tooltip>
        </div>

        <Modal
          title="Nuevo automovil"
          key="m1"
          visible={this.state.visible}
          onOk={this.handleSubmit}
          confirmLoading={this.confirmLoading}
          onCancel={this.handleCancel}
          maskClosable={false}
          closable={false}
          mask={false}
          okButtonProps={{ disabled: this.state.saving }}
          cancelButtonProps={{ disabled: this.state.saving }}
          cancelText="Cancelar"
          okText="Guardar">
          <NewCar ref={this.newCar} />
          {this.state.saving && <Spin className='spin-process' tip="Guardando..." />}
        </Modal>

        <Modal closable={false} cancelText="Salir" okButtonProps={{ style: { display: 'none' } }} title="Detalles" visible={this.state.detailModalVisible} onCancel={() => this.handleCancel('details')}>
          <CarDetails onClose={this.onDetailsClose} ref={this.detailsCar} car={this.state.selectedCar} />
        </Modal>

      </div>
    );
  }

  columns = () => {
    return [
      {
        title: 'Marca',
        dataIndex: 'brand',
      },
      {
        title: 'Año',
        dataIndex: 'year',
      },
      {
        title: 'Pais',
        dataIndex: 'country_code',
        render: (country, record) => {

          return (
            country ?
              <Tooltip placement="left" title={record.country}>
                <img alt={country} src={`https://www.countryflags.io/${country.toLowerCase()}/flat/32.png`}></img>
              </Tooltip>
              : 'Desconocido'
          )
        }
      },
      {
        title: 'Velocidad Maxima',
        dataIndex: 'maxspeed',
      },
      {
        title: 'Estado',
        dataIndex: 'status',
        render: (status) => (
          <Tag color={(status === 1) ? 'orange' : 'green'} key={status}>
            {status === 1 ? 'Inactivo' : 'Activo'}
          </Tag>
        )
      },
      {
        title: 'Colores',
        dataIndex: 'available_colors',
        render: (colors) => (
          <div style={{ display: 'flex', flexFlow: 'row' }}>
            {colors.map(color => <div className="color-block" style={{ background: color }} key={color}></div>)}
          </div>
        )
      }
    ]
  }

}

export default Cars;