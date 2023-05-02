import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async runSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );
    data.results.forEach(({ name, url }) => {
      console.log(url);
      const segments = url.split('/');
      console.log(segments);
      const pokemonNumber = +segments[segments.length - 2];
      console.log(name, pokemonNumber);
    });
    return data.results;
  }
}
