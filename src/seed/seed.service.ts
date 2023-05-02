import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async runSeed() {
    // Delete * from Pokemons
    await this.pokemonModel.deleteMany({});
    const pokemonsToinsert: CreatePokemonDto[] = [];
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonsToinsert.push({ name, no });
    });
    await this.pokemonModel.insertMany(pokemonsToinsert);
    return 'Seed Running';

    /*
    // To delete * pokemons
    await this.pokemonModel.deleteMany({});
    // Connecting Api Pokemons
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );
    // Create for registers block
    const insertPromisseArray = [];
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      insertPromisseArray.push(this.pokemonModel.create({ name, no }));
    });
    console.log(insertPromisseArray);
    await Promise.all(insertPromisseArray);
    return 'Seed Running';
    */
  }
}
