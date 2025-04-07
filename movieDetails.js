import movier from 'movier'

export async function getMovieInfo(movieName){
    const movieData = await movier.getTitleDetailsByName(movieName);
    return movieData;
}