function PokemonDetail({ pokemon, onBack}) {

    if (!pokemon) {
        return (
        <div className="text-center mt-6 text-gray-500">
            Cargando Pokémon...
        </div>
        );
    }

    const {sprites, name, height, weight, types, stats} = pokemon;


    return (
        <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <img
                src={sprites?.front_default || ""}
                alt={name}
                className="mx-auto w-40 h-40 mb-4"
            />
            <h2 className="text-2xl font-bold capitalize mb-2">{name}</h2>
            <p>Altura: {height / 10} m</p>
            <p>Peso: {weight / 10} kg</p>
            <p>
                Tipo: {types?.map((t) => t.type.name).join(", ") || "Desconocido"}
            </p>

            
            {/* Stats */}
            {stats && stats.length > 0 && (
                <div className="mt-4 text-left">
                <h3 className="font-semibold mb-2">Stats:</h3>
                {stats.map((s) => (
                    <div key={s.stat.name} className="mb-2">
                        <div>
                            <span className="capitalize">{s.stat.name}:</span>
                            <span className="font-semibold">{s.base_stat}</span>
                        </div>                    
                    </div>
                ))}
                </div>
            )}

            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={onBack}>
                Volver
            </button>
        </div>
    );
}

export default PokemonDetail;