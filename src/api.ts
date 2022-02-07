const API_KEY = "05b81ffe05cb24c3ab044ea04aa9cc17";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie{
    id:number;
    backdrop_path:string;
    poster_path:string;
    title:string;
    overview:string;
    release_date:string;
    vote_average:number;
    vote_count:number;
    popularity:number;
}

export interface IGetMoviesResult {
    dates:{
        maximum:string;
        minimum:string;
    };
    page:number;
    results:IMovie[];
    total_pages:number;
    total_results:number;
}

interface ITv{
    id:number;
    name:string;
    backdrop_path:string;
    poster_path:string;
    overview:string;
    first_air_date:string;
    popularity:number;
    vote_average:number;
    vote_count:number;
}

export interface IGetTvResult {
    page:number,
    results:ITv[];
    total_pages:number,
    total_results:number
}

export function getMoviesNowPlaying(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response)=>response.json());
}

export function getMoviesLatest(){
    return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}&language=en-US`).then((response)=>response.json());
}

export function getMoviesTop(){
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`).then((response)=>response.json());
}

export function getMoviesUp(){
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`).then((response)=>response.json());
}

export function searchMovies(keyword:string){
    return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}`).then((response)=>response.json());
}

export function searchTv(keyword:string){
    return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&language=en-US&query=${keyword}`).then((response)=>response.json());
}

export function getTvLatest(){
    return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}&language=en-US`).then((response)=>response.json());
}

export function getTvAiring(){
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=en-US&page=1`).then((response)=>response.json());
}

export function getTvPopular(){
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`).then((response)=>response.json());
}

export function getTvTop(){
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`).then((response)=>response.json());
}