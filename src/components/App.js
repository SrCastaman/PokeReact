import { useEffect, useState } from "react";
import PokemonDetail from "./PokemonDetail";

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [paginatedPokemons, setPaginatedPokemons] = useState([]);
  const [selectedPokemon,setSelectedPokemon] = useState(null);
  const [selectedGen, setSelectedGen] = useState("all");
  const [genPokemons, setGenPokemons] = useState([]);

  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 20;


  //Carga global de todos los Pokemons
  useEffect(() => {
    async function fetchAll() {
      try{
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1118");
        const data = await res.json();
        setAllPokemons(data.results);
        setFilteredPokemons(data.results);
      } catch (err){
        console.error("Error al cargar lista de pokemons: ", err);
      }
    }
    fetchAll();
  }, []);


  //Cargar pokemons de la generacion seleccionada
  useEffect(() =>{
    async function fetchGen(){
      if(selectedGen === "all"){
        setGenPokemons([]);
        return;
      }
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/generation/${selectedGen}`);
        const data = await res.json();
        const specieList = data.pokemon_species.map(p=>{
          const id = p.url.split("/").filter(Boolean).pop();
          return { name: p.name, url: `https://pokeapi.co/api/v2/pokemon/${id}/` };
        });
        setGenPokemons(specieList);
      } catch (err){
        console.error("Error al cargar generacion: ", err);
      }
    }
    fetchGen();
    setOffset(0);
  }, [selectedGen]);


  useEffect(() => {
    const baseList = selectedGen === "all" ? allPokemons : genPokemons;
    const results = baseList.filter(poke => poke.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredPokemons(results);
    setOffset(0);
  }, [search, allPokemons, genPokemons, selectedGen]);



  useEffect(() => {
    async function fetchPage() {
      try{
        const slice = filteredPokemons.slice(offset, offset + limit);
        const withSprites = await Promise.all(
          slice.map(async (poke, index) => {
            const res = await fetch(poke.url);
            const detail = await res.json();
            return {
              id: offset + index + 1,
              name: poke.name,
              sprite: detail.sprites.front_default,
              url: poke.url,
            }
          })
        );
        setPaginatedPokemons(withSprites);
      } catch (err){
        console.error("error al cargar sprites: " , err);
      }
    }
    if (filteredPokemons.length > 0){
      fetchPage();
    }
  }, [filteredPokemons, offset])

  const handleClick = (poke) => {
    fetch(poke.url)
      .then((res) => res.json())
      .then((data) => setSelectedPokemon(data))
      .catch((err) => console.err("Error al cargar Pokemon:", err));
  }
  

  return (
    <div className="p-6">

      {/*TITULO*/ }

      <div className="flex items-center justify-center mb-3">
        <h1 className="text-5xl font-boldtext-center mb-6 text-center">
          <span className="text-red-500">POKE</span>
          <span className="text-white">REACT</span>
        </h1>
        <img
          src={require('../assets/images/pokeball.png')}
          alt="Pokéball"
          className="w-20 h-20 mb-7"
        />
      </div>  

      {selectedPokemon && selectedPokemon.id ? (
        <PokemonDetail
          pokemon={selectedPokemon}
          onBack={() => setSelectedPokemon(null)}
        />
      ) : (
        <>
          {/*BARRA DE BUSQUEDA*/}
          <div className="flex justify-center mb-6">
            <input type="text" placeholder="Buscar Pokemon..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-4 py-2 border rounded w-64"/>
          </div>

          <div className="flex justify-center mb-6">
            
            {/*SELECT DE GENERACION*/}
            <select value={selectedGen} onChange={(e) => setSelectedGen(e.target.value)} className="px-4 py-2 border rounded">
              <option value="all">Todas las generaciones</option>
              <option value="1">Gen 1</option>
              <option value="2">Gen 2</option>
              <option value="3">Gen 3</option>
              <option value="4">Gen 4</option>
              <option value="5">Gen 5</option>
              <option value="6">Gen 6</option>
              <option value="7">Gen 7</option>
              <option value="8">Gen 8</option>
              <option value="9">Gen 9</option>
            </select>
          </div>

          {/* LISTA DE POKEMON */}
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paginatedPokemons.map((poke) => (
              <li
                key={poke.id}
                className="bg-gray-100 p-4 rounded-xl shadow-md hover:shadow-xl hover:bg-yellow-200 transition cursor-pointer text-center"
                onClick={() => handleClick(poke)}
              >
                <img
                  src={poke.sprite}
                  alt={poke.name}
                  className="mx-auto mb-2 w-20 h-20"
                />
                <span className="capitalize font-medium">{poke.name}</span>
              </li>
            ))}
          </ul>

          {/* PAGINACION*/}
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
            >
              Anterior
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setOffset(offset + limit < filteredPokemons.length ? offset + limit : offset)}
              disabled={offset + limit >= filteredPokemons.length}
            >
              Siguiente
            </button>
          </div>
        </>
      )}


      
    </div>
  );
}

export default App;
