import React from 'react';
import './new-car.less';
import { carBrands } from './brands';
import { Input, Select, InputNumber, Button, Tooltip, message } from 'antd';
import { SketchPicker } from 'react-color';

const Option = Select.Option;

export const CAR = {
  brand: undefined,
  year: undefined,
  country: undefined,
  country_code: undefined,
  maxspeed: undefined,
  status: undefined,
  available_colors: [],
  description: '',
  number_of_doors: undefined
};

class NewCar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      car: CAR,
      countries: [],
      displayColorPicker: false,
      selectedColor: '#fff'
    }
  }

  componentDidMount() {
    this.getCountries();
  }

  getCountries = async () => {
    try {
      const response = await fetch('https://restcountries.eu/rest/v2/all/?fields=alpha2Code;translations;name');
      const countries = await response.json();
      this.setState({ countries: countries });
    } catch (error) {
      message.error('Ha ocurrido un error al consultar la lista de paises.');
    }

  }

  setCurrentColor = (color) => {
    this.setState({ selectedColor: color.hex });
  }

  openColorPicker = () => {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker,
    });
  }

  clearValues = () => {
    this.setState({ car: CAR });
  }

  pushColor = () => {

    const { selectedColor } = this.state;
    const { available_colors } = this.state.car;

    if (!available_colors.includes(selectedColor)) {
      available_colors.push(selectedColor);
      this.setState(prevState => ({
        car: {
          ...prevState.car,
          available_colors
        }
      }));
    }
    this.setState({ displayColorPicker: false });
  };

  deleteColor = (color) => {
    const { available_colors } = this.state.car;
    available_colors.splice(available_colors.findIndex(idxColor => color === idxColor), 1);
    this.setState(prevState => ({
      car: {
        ...prevState.car,
        available_colors
      }
    }));
  }

  setFormChanges = (input, event = null, name = null) => {

    if (input === null) return;

    const xinput = typeof input === 'object' ? input.target.value : input;
    const xname = typeof name === 'string' ? name : input.target.name;
    let currentCar = this.state.car;

    if (name === 'country') { currentCar.country_code = event.key.toLowerCase() };

    this.setState({ car: { ...currentCar, [xname]: xinput } });

  }

  render() {

    const { car } = this.state;

    let years = [];
    for (let i = (new Date().getFullYear() + 1); i >= 1900; i--) {
      years.push(i);
    }

    return (
      <div className="form-container">

        <Select
          showSearch
          style={{ width: '49%' }}
          className="form-input"
          placeholder="Marca"
          name='brand'
          value={car.brand}
          onChange={(input, event) => this.setFormChanges(input, event, 'brand')}
        >
          {
            carBrands.map((brand, i) => (<Option key={i} value={brand}>{brand}</Option>))
          }
        </Select>

        <Select
          showSearch
          className="form-input"
          style={{ width: '49%' }}
          placeholder="Año de fabricación"
          name='year'
          value={car.year}
          onChange={(input, event) => this.setFormChanges(input, event, 'year')}
        >
          {years.map((year, i) => <Option key={i} value={year}>{year}</Option>)}
        </Select>

        <Select
          showSearch
          style={{ width: '49%' }}
          placeholder="Pais"
          name='country'
          value={car.country}
          onChange={(input, event) => this.setFormChanges(input, event, 'country')}
        >
          {this.state.countries.map(country => (
            <Option key={country.alpha2Code} value={country.translations.es || country.name}>{country.translations.es || country.name}</Option>
          ))}
        </Select>

        <InputNumber value={car.number_of_doors} name='number_of_doors' onChange={(input, event) => this.setFormChanges(input, event, 'number_of_doors')} placeholder="Nº de puertas" min={1} max={5} className="form-input" style={{ width: '49.5%' }} />

        <InputNumber value={car.maxspeed} name='maxspeed' onKeyUp={(input, event) => this.setFormChanges(input, event, 'maxspeed')} placeholder="Velocidad maxima (Km/h)" min={1} className="form-input" style={{ width: '49%' }} />

        <Select
          showSearch
          className="form-input"
          style={{ width: '49%' }}
          placeholder="Estado"
          name='status'
          value={car.status}
          onChange={(input, event) => this.setFormChanges(input, event, 'status')}
        >
          <Option value={0}>Activo</Option>
          <Option value={1}>Inactivo</Option>
        </Select>

        <Button
          onClick={this.state.displayColorPicker ? this.pushColor : this.openColorPicker}
          type='primary'
          icon={this.state.displayColorPicker ? 'check' : 'plus'}
          className="form-input"
          style={{ width: '49%' }}>
          {this.state.displayColorPicker ? 'Agregar color' : 'Seleccionar color'}
        </Button>

        {this.state.displayColorPicker &&
          <div className="color-picker" >
            <SketchPicker disableAlpha={true} presetColors={car.available_colors} color={this.state.selectedColor} onChangeComplete={this.setCurrentColor} />
          </div>}

        <div className="form-input color-box" style={{ width: '49%' }}>
          {car.available_colors.map((color, i) => (
            <Tooltip key={i} title="Click para eliminar">
              <div onClick={() => this.deleteColor(color)} style={{ backgroundColor: color }} ></div>
            </Tooltip>
          ))}
        </div>

        <Input.TextArea onChange={(input, event) => this.setFormChanges(input, event, 'description')} value={car.description} name='description' className="form-input" placeholder="Descripción" style={{ width: '100%' }} rows={4} />

      </div>
    );
  }

}

export default NewCar;