fetch("movies.json")
    .then(response => response.json())
    .then(data => { 
             console.log(data); 
             currentData = data.movies; 
             displayData(currentData.slice(0, numberPerPage));
             searchCast();
             searchTitle();
             selectGenre(data.movies);
             selectStartYear(data.movies);
             selectEndYear(data.movies);
             filterMovies();
             pagination(currentData);

         }).catch(error => console.log(error));


let currentData = [];
const numberPerPage = 50; 
let currentPage = 1;

//show the movie table

function displayData(movie) {
    const displayTable = document.getElementById("movieTable").getElementsByTagName("tbody")[0];

    let text = "";  

    movie.forEach(movie => {
        text += `
            <tr>
                <td>${movie.year}</td>
                <td><a href="https://en.wikipedia.org/wiki/${movie.title}" target="_blank">${movie.title}</a></td>
                <td>${movie.genres}</td>
                <td>${movie.cast}</td>

            </tr>
        
        `
    });

    displayTable.innerHTML = text;
}


function filterMovies() {
    const startYear = parseInt(document.getElementById("selectYearStart").value) || 0;
    const endYear = parseInt(document.getElementById("selectYearEnd").value) || new Date().getFullYear();
    const selectedGenre = document.getElementById("selectGenre").value;
    const filterTitle = document.getElementById("inputTitle").value.toUpperCase();
    const filterCasts = document.getElementById("inputCast").value.toUpperCase();

    let filteredMovies = currentData.filter(movie => {
        let titleMatch = movie.title.toString().toUpperCase().includes(filterTitle);
        let genreMatch;
        if (selectedGenre === "ALL") {
            genreMatch = true;
        } else if (selectedGenre === "NONE") {
            genreMatch = !movie.genres || movie.genres.length === 0;
        } else {
            genreMatch = movie.genres.includes(selectedGenre);
        }

        const yearMatch = (movie.year >= startYear) && (movie.year <= endYear);
        
        if(startYear>endYear){
            alert("An end year should be not smaller than a start year!");
            location.href = location.href;
        }

        let castMatch;
        if (filterCasts === "NONE"){
            castMatch = !movie.cast || movie.cast.length === 0;
        } else {
            castMatch = movie.cast.toString().toUpperCase().includes(filterCasts);
        }

        return titleMatch && genreMatch && yearMatch && castMatch;
    });
    currentPage = 1;
    displayData(filteredMovies.slice(0, numberPerPage));
    pagination(filteredMovies);
}

//search Casts
function searchCast() {
    let inputs = document.getElementById("inputCast");
    inputs.addEventListener('keyup', filterMovies);

}


//search title
function searchTitle() {
    let input = document.getElementById("inputTitle");
    input.addEventListener('keyup', filterMovies);
}

//select genre
function selectGenre(movies) {
    const showGenre = document.getElementById("selectGenre");
    
    let newGenre = [...new Set(movies.flatMap(G => G.genres))];

    newGenre.sort();
    newGenre.unshift('ALL');
    newGenre.push('NONE')

    newGenre.forEach(genre => {
        showGenre.add(new Option(genre,genre));
    })

    showGenre.addEventListener('change', filterMovies);
}



//select start year
function selectStartYear(data) {
    const showStartYear = document.getElementById("selectYearStart");
    
    let newYear = [...new Set(data.flatMap(Y => Y.year))];
    newYear.sort(function(a, b){return a - b});
    newYear.unshift('ALL');
    newYear.forEach(year => {
        showStartYear.add(new Option(year,year));
    })
    
    showStartYear.addEventListener('change', filterMovies);
}

//select end year
function selectEndYear(data) {
    const showEndYear = document.getElementById("selectYearEnd");
    
    let newYears = [...new Set(data.flatMap(Y => Y.year))];
    newYears.sort(function(a, b){return a - b});
    newYears.unshift('ALL');    
    newYears.forEach(year => {
        showEndYear.add(new Option(year,year));
    })
    

    showEndYear.addEventListener('change', filterMovies);
}



//pagination
function pagination(data) {
    const numberOfMovies = data.length;
    const numberOfPages = Math.ceil(numberOfMovies/numberPerPage);
    const pageNumberContainer = document.getElementById('pageNation');
    pageNumberContainer.innerHTML = '';

    if (numberOfPages <= 1) {
        pageNumberContainer.style.display = "none";
        return;
    } else {
        pageNumberContainer.style.display = 'block';
    }
    const maxPageNumbersToShow = 10;
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + maxPageNumbersToShow - 1, numberOfPages);

    if (startPage > 1) {
        pageNumberContainer.appendChild(createPageButton('...', () => changePageRange(-1, data)));
    }
    for (let i = startPage; i <= endPage; i++) {
        const pageNumberButton = createPageButton(i, () => buildPage(i, data));
        pageNumberContainer.appendChild(pageNumberButton);
    }
    if (endPage < numberOfPages) {
        pageNumberContainer.appendChild(createPageButton('...', () => changePageRange(1, data)));
    }

    function buildPage(currPage, data) {
        currentPage = currPage;
        const trimStart = (currPage - 1) * numberPerPage;
        const trimEnd = trimStart + numberPerPage;
        displayData(data.slice(trimStart, trimEnd));
    }
    
    function changePageRange(direction, data){
        currentPage += direction*maxPageNumbersToShow;
        currentPage = Math.max(1, Math.min(currentPage, numberOfPages - maxPageNumbersToShow +1));
        pagination(data)
    }   

}

function createPageButton(text, clickHandler) {
    const button = document.createElement('button');
    button.innerText = text;
    if (clickHandler) {
        button.addEventListener('click', clickHandler);
    }
    return button;
}


function darkmode () {
    var element = document.body.classList.toggle("dark-mode");
    var toggle = document.getElementById('button-14');
    if(element) {
     toggle.textContent = '🌞';
    } else {
     toggle.textContent = '🌑';
    }
}

