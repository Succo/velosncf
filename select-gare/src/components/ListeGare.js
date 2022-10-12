import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Maps from './Maps'
import ApiRequest from './ApiRequest'

export default function Stops_nom({setActiveCategory, activeCategory, type}) {
  const [data, setData] = useState(['Paris Austerlitz']);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterOrigin = (filter) => {
    setFilter(filter);
  };
  useEffect(() => {
    fetch(`data/liste_station.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        setData(actualData);
        setError(null);
      })
      .catch((err) => {
        setData(null);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  console.log("data")
  console.log(activeCategory)
  console.log(filter)
  return (
    <div>
      {loading && <div>Chargement des données</div>}
      {error && (
                <div>{` ${error}`}</div>
                )}
  <h4> Pré-filtrage des gares en fonction d'un lieu </h4>
  <p> Je veux les gares à moins de <input type="number" id="quantity" name="quantity" min="5" max="50" value="20" size="5"></input> km de : </p>
  <div style={{"display":"flex", "flexDirection":"row"}}>
  <ApiRequest filterOrigin={filterOrigin}/>
  <button className="button">Filtre</button>
  </div>
  <h4> Sélection de gares </h4>
  <Autocomplete
    multiple
    limitTags={2}
    defaultValue={activeCategory}
    onChange={(event: any, newValue: string | null) => {
      setActiveCategory(newValue);
    }}
    options={data}
    getOptionLabel={data => data.stop_name}
    renderInput={params => (
      <TextField {...params} label= {type} margin="normal" />
    )}/>
		    <Maps
			    filter = {activeCategory}/>
    </div>
  );
}
