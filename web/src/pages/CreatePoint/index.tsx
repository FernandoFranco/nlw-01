import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import api from '../../services/api';
import ibge from '../../services/ibge';

import DropZone from '../../components/Dropzone';

import './styles.css';
import logo from '../../assets/logo.svg';

interface IItem {
  id: string,
  image_url: string,
  title: string,
}

interface IIBGEUF {
  id: number,
  sigla: string,
  nome: string,
}

interface IIBGECity {
  id: number,
  nome: string,
}

const CreatePoint = () => {
  const history = useHistory();

  const [items, setItems] = useState<Array<IItem>>([]);
  const [ufs, setUFs] = useState<Array<IIBGEUF>>([]);
  const [cities, setCities] = useState<Array<IIBGECity>>([]);

  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });

  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    api.get('/items')
      .then(({ data }) => {
        setItems(data.map((item: IItem) => ({
          ...item,
          image_url: api.defaults.baseURL + item.image_url,
        })));
      });
  }, []);

  useEffect(() => {
    ibge.get('/localidades/estados')
      .then(({ data }) => {
        setUFs(data);
      });
  }, []);

  useEffect(() => {
    ibge.get(`/localidades/estados/${selectedUF}/municipios`)
      .then(({ data }) => {
        setCities(data);
      });
  }, [selectedUF]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setSelectedPosition([latitude, longitude]);
    });
  }, []);

  function handleSelectUF($event: ChangeEvent<HTMLSelectElement>) {
    const { value } = $event.target;
    if (value === '0') return;

    setSelectedUF($event.target.value);
  }

  function handleSelectCity($event: ChangeEvent<HTMLSelectElement>) {
    const { value } = $event.target;
    if (value === '0') return;

    setSelectedCity($event.target.value);
  }

  function handleMapClick($event: LeafletMouseEvent) {
    setSelectedPosition([$event.latlng.lat, $event.latlng.lng]);
  }

  function handleInputChange($event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = $event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSelectItem(itemId: string) {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((item: string) => item !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  }

  async function handleSubmit($event: FormEvent) {
    $event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUF;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    await api.post('/points', data);

    setFinished(true);

    setTimeout(() => {
      history.push('/');
    }, 2000);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>

        <DropZone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" value={formData.whatsapp} onChange={handleInputChange} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={selectedPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado</label>
              <select name="uf" id="uf" value={selectedUF} onChange={handleSelectUF}>
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf.id} value={uf.sigla}>{uf.nome}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                <option value="0">Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.nome}>{city.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt="Oleos"/>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>

      <div id="finished" className={finished ? 'active' : ''}>
        <FiCheckCircle size="64" className="icon" />
        <h1>Cadastro concluído</h1>
      </div>
    </div>
  );
};

export default CreatePoint;
