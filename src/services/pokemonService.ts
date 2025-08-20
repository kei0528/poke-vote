import type { Pokemon } from '@/types/pokemon.type';

export class PokemonService {
  private static API_URL = 'https://pokeapi.co/api/v2/pokemon';
  private static MAX_ID = 1025; // As of 2025: Number of Pokémon registered in PokeAPI (needs adjustment if increased)

  private static getRandomId(): number {
    return Math.floor(Math.random() * this.MAX_ID) + 1;
  }

  private static async fetchPokemon(id: number): Promise<Pokemon> {
    const res = await fetch(`${this.API_URL}/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch Pokémon with id ${id}`);

    const {
      id: pokeId,
      name,
      sprites,
      weight,
      height,
      base_experience: baseExperience,
      cries,
    } = await res.json();
    return {
      id: pokeId,
      name: name,
      img: sprites.front_default,
      weight: weight / 10, // Convert to kg,
      height: height / 10, // Convert to m
      baseExperience: baseExperience,
      crySound: cries.legacy || cries.latest || null,
    };
  }

  static async getTwoRandom(): Promise<[Pokemon, Pokemon]> {
    const id1 = this.getRandomId();
    let id2 = this.getRandomId();

    while (id1 === id2) {
      id2 = this.getRandomId();
    }

    const [p1, p2] = await Promise.all([this.fetchPokemon(id1), this.fetchPokemon(id2)]);

    return [p1, p2];
  }
}
