const API_KEY = 'b2a35554';
let currentPage = 1;

async function searchMovies() {
    const query = document.getElementById('search-input').value;
    const rating = document.getElementById('rating-filter').value;
    const url = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${currentPage}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Verifica si la búsqueda fue exitosa
        if (data.Response === "True") {
            const movies = data.Search;

            // Si deseas filtrar por rating, tendrás que obtener detalles adicionales de cada película.
            const detailedMovies = await Promise.all(movies.map(async movie => {
                const movieDetails = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
                return await movieDetails.json();
            }));

            // Filtrar por calificación
            const filteredMovies = detailedMovies.filter(movie => movie.imdbRating >= rating);
            displayMovies(filteredMovies);
        } else {
            document.getElementById('movies-container').innerHTML = '<p>No se encontraron películas con esa búsqueda.</p>';
        }
    } catch (error) {
        console.error('Error al buscar películas:', error);
        alert('Hubo un error al buscar las películas. Inténtalo más tarde.');
    }
}

function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies-container');
    moviesContainer.innerHTML = '';

    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p>No se encontraron películas con esa búsqueda.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = `
            <div class="movie-card">
                <h4>${movie.Title}</h4>
                <img src="${movie.Poster}" alt="${movie.Title}">
                <p>Calificación: ${movie.imdbRating}</p>
            </div>
        `;
        moviesContainer.innerHTML += movieCard;
    });


    footer.classList.add('sticky-footer');
}

function changePage(change) {
    currentPage += change;
    searchMovies();
}
