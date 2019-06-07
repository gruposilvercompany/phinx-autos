import React from 'react';
import './car-details.less';
import { Divider, Button, message, Popconfirm } from 'antd';
import firebase from '../../../Firebase/firebase';

class CarDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      car: this.props.car
    };
    this.subscription = {};
  }

  componentDidMount() {
    firebase.cars().doc(this.props.car.id).onSnapshot(car => {
      this.setState({ car: { ...car.data(), ...{ id: car.id } } });
    });
  }

  componentWillReceiveProps(props) {
    this.setState({ car: props.car });
  }

  activateOrDeactivateCar = async () => {
    try {
      await firebase.cars()
        .doc(this.props.car.id)
        .update({
          status: (this.props.car.status === 0) ? 1 : 0
        });
      this.props.onClose();
      message.success('Actualizado correctamente.');
    } catch (error) {
      message.error('Ha ocurrido un error al actualizar');
    }
  }

  deleteCar = async () => {
    try {
      await firebase.cars().doc(this.props.car.id)
        .delete();
      message.success('Vehiculo eliminado.');
      this.props.onClose();
    } catch (error) {
      message.error('No se ha podido eliminar.')
    }

  }

  render() {

    const { car } = this.props;

    return (
      <div>
        <div className='modal-content'>

          <div className="country-data">
            {car.country_code && <img alt="country_flag" src={`https://www.countryflags.io/${car.country_code.toLowerCase()}/flat/64.png`}></img>}
            <h2>{car.country}</h2>
            <div>
              <span style={{ textTransform: 'capitalize' }}>{car.brand}</span>
              <Divider type="vertical" />
              <span>{car.year}</span>
            </div>
          </div>

          <div className="description">
            <p>{car.description || 'Sin descripción.'}</p>
            <div style={{ display: 'flex', flexFlow: 'row' }}>
              {car.available_colors.map(color => <div className="color-block" style={{ background: color }} key={color}></div>)}
            </div>
          </div>

        </div>
        <Divider type="horizontal" />
        <div>
          Acciones
          <Divider type="vertical" />
          <Button onClick={this.activateOrDeactivateCar}>{this.state.car.status ? 'Activar' : 'Desactivar'}</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="¿Seguro deseas eliminar este vehiculo?"
            onConfirm={this.deleteCar}
            okText="Si"
            cancelText="No"
          >
            <Button type='danger'>Eliminar</Button>
          </Popconfirm>
        </div>
      </div>
    );
  }

}

export default CarDetails;