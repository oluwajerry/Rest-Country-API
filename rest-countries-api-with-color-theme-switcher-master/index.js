document.addEventListener('DOMContentLoaded', () =>{
    const dropdown = document.querySelector('.filter-text')
    const dropdownElement = document.querySelector('.countinentList ul')
    const body = document.querySelector('body');
    
    const eachRegionRepCountry = {}
    const groupingByRegion = {}

    dropdown.onclick = () =>{
        dropdownElement.style.display = 'block';
    }

    // displaying stored preferred  theme Mode
    let preferredMode = localStorage.getItem('theme')
    if(preferredMode === 'darkMode'){
        const darkModeBtn = document.getElementById('dark-mode');

        body.classList.add('dark-mode');
        darkModeBtn.innerHTML = `
            <i id="dark-mode-icon" class="fa-solid fa-sun"></i> Light Mode
            `;
    }else{
        body.classList.remove('dark-mode');
    }
    
    // calling fetchRestAPI
    fetchRestAPI(groupingByRegion, eachRegionRepCountry)
    getEachCountryDetails(groupingByRegion);
    filterAndDisplayByRegion(groupingByRegion)
    inputTextFilter(groupingByRegion)
    darkMode();
})


const fetchRestAPI = async (groupingByRegion, eachRegionRepCountry) =>{
    try {
        const url = './data.json'
        const fetchRequest = await fetch(url)
        const response = await fetchRequest.json()

        segmentJsonResponseInGroups(response,groupingByRegion, eachRegionRepCountry)
    } catch (error) {
        console.error('Cant Fetch:' + error)
    }
}

const segmentJsonResponseInGroups = (data, groupingByRegion, eachRegionRepCountry) =>{

    data.forEach(country => {
        const regionName = country.region

            if(!eachRegionRepCountry[regionName]){
                eachRegionRepCountry[regionName] = {
                name: country.name,
                population: country.population,
                capital: country.capital,
                flag: country.flag
                }
            }
            if(!groupingByRegion[regionName]){
                groupingByRegion[regionName] = []
            }

            groupingByRegion[regionName].push({
                name: country.name,
                population: country.population,
                capital: country.capital,
                flag: country.flag,
                nativeName: country.nativeName,
                subRegion:country.subregion,
                currencies:country.currencies,
                languages:country.languages,
                borders:country.borders,
                topLevelDomain:country.topLevelDomain
            })
        })
        
        const countries_summary_display = document.querySelector('.countries_summary_display')

        let HTMLContent = ''

        Object.entries(eachRegionRepCountry).forEach(([region, data]) => {
        
        HTMLContent += `
        
        <section class="card">
            <figure>
                <img src="${data.flag}" alt="flag">
            </figure>
            <figcaption>
                <h1 class="countryName">${data.name}</h1>
                <div class="other-details">
                    <p class="population"><b>Population:</b> ${data.population}</p>
                    <p class="Region">Region:<span> ${region}</span></p>
                    <p class="Capital"><b>Capital:</b> ${data.capital}</p>
                </div>
            </figcaption>
        </section>
        
        `
        countries_summary_display.innerHTML = HTMLContent
    })
}

const getEachCountryDetails = (groupingByRegion) => {
    const countriesContainer = document.querySelector('.countries_summary_display');

    // Event delegation for country clicks
    countriesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('countryName')) {
            const countryName = event.target.textContent;
            const card = event.target.closest('.card');
            const cardRegion = card.querySelector('figcaption .other-details .Region span').innerHTML;

            getCountryData(groupingByRegion, cardRegion, countryName);
        }
    });
};

const getCountryData = (groupingByRegion, cardRegion, countryName) => {
    const countryDetails = document.querySelector('.EachCountryDetails');
    
    const filteredByRegion = Object.entries(groupingByRegion)
    .filter(([region]) => region === cardRegion.trim());
        
    let result = null;
    filteredByRegion.forEach(([region, data]) => {
        const country = data.find(country => country.name === countryName); 
        if (country) {
            result = { region, ...country };
            const countries_summary_display = document.querySelector('.countries_summary_display');

            const singlerLanguage = result.languages.map(language => language.name).join(', ');
            
            let currency = result.currencies.map(e => e.name).join(', ');
            
            countries_summary_display.style.display = 'none';
            countryDetails.style.display = 'block'; 
            countryDetails.innerHTML = `
                <button id="backToHomePage"><i class="fa-solid fa-arrow-left"></i> Back</button>
                <section class="countryDetails">
                    <figure>
                        <img src="${result.flag}" alt="">
                    </figure>
                    <section class="countryData">
                        <h1>${result.name}</h1>
                        <section class="basicData">
                            <div>
                                <p><b>Native Name:</b> ${result.nativeName}</p>
                                <p><b>Population:</b> ${result.population}</p>
                                <p><b>Region:</b> ${result.region}</p>
                                <p><b>Sub Region:</b> ${result.subRegion}</p>
                                <p><b>Capital:</b> ${result.capital}</p>
                            </div>
                            <div>
                                <p><b>Top Level Domain:</b> ${result.topLevelDomain}</p>
                                <p><b>Currencies:</b> ${currency}</p>
                                <p><b>Languages:</b> ${singlerLanguage}</p>
                            </div>
                        </section>
                        <section class="borderCountries">
                            <p><b>Border Countries:</b> ${result.borders ? result.borders.join(', ') : "None"}</p>
                        </section>
                    </section>
                </section>
            `;

            const backPage = document.getElementById('backToHomePage');
            backPage.addEventListener('click', () => {
                countries_summary_display.style.display = 'grid'
                countryDetails.style.display = 'none'
                countryDetails.innerHTML = ''
            });
        }
    });
};

const filterAndDisplayByRegion = (groupingByRegion) =>{
    const regionList = document.querySelector('.countinentList');
    const countries_summary_display = document.querySelector('.countries_summary_display');
    const dropdownElement = document.querySelector('.countinentList ul');

    regionList.onclick = (event) =>{
        if(event.target.tagName.toLowerCase() == 'li'){
            const regionName = event.target.textContent
            const siblings = event.target.parentElement.children

            for(let sibling of siblings){
                sibling.classList.remove('active');
            }

            event.target.classList.add('active')
            // event.target.style.color = '#fff';

            let HTMLContent = ''

            Object.entries(groupingByRegion).filter(([region, data]) => {
                if(region === regionName){
                    data.forEach(country => {

                        HTMLContent += `
                        <section class="card">
                            <figure>
                                <img src="${country.flag}" alt="flag">
                            </figure>
                            <figcaption>
                                <h1 class="countryName">${country.name}</h1>
                                <div class="other-details">
                                    <p class="population"><b>Population:</b> ${country.population}</p>
                                    <p class="Region">Region:<span> ${region}</span></p>
                                    <p class="Capital"><b>Capital:</b> ${country.capital}</p>
                                </div>
                            </figcaption>
                        </section>
                        ` 
                    })
                }
            })
            countries_summary_display.innerHTML = HTMLContent

            setTimeout(() => {
                dropdownElement.style.display = 'none';
            }, 2000);
        }
        else{
            alert('Error Occured')
        }
    }
} 

const inputTextFilter = (groupingByRegion) => {
    const search = document.querySelector('input[type="search"]')
    const countries_summary_display = document.querySelector('.countries_summary_display');

    search.oninput = (event) => {
        const searchValues = event.target.value.toLowerCase().trim()

        let HTMLContent = ''
        Object.entries(groupingByRegion).forEach(([region, data]) => {
            data.map(country => {
                const countryName = country.name.toLowerCase()

                if(countryName.startsWith(searchValues)){
                        HTMLContent += `
                        <section class="card">
                            <figure>
                                <img src="${country.flag}" alt="flag">
                            </figure>
                            <figcaption>
                                <h1 class="countryName">${country.name}</h1>
                                <div class="other-details">
                                    <p class="population"><b>Population:</b> ${country.population}</p>
                                    <p class="Region">Region:<span> ${region}</span></p>
                                    <p class="Capital"><b>Capital:</b> ${country.capital}</p>
                                </div>
                            </figcaption>
                        </section>
                        `     
                }
            })
        })

        if(HTMLContent === ''){
            HTMLContent = '<h2>No Result Found!</h2>';
        }
        countries_summary_display.innerHTML = HTMLContent
    }
}

const darkMode = () => {
    const darkModeBtn = document.getElementById('dark-mode');
    const body = document.querySelector('body');

    darkModeBtn.onclick = () => {
        body.classList.toggle('dark-mode'); 
        
        if (body.classList.contains('dark-mode')) {
            darkModeBtn.innerHTML = `
                <i id="dark-mode-icon" class="fa-solid fa-sun"></i> Light Mode
            `;
            localStorage.setItem('theme', 'darkMode')
        } else {
            darkModeBtn.innerHTML = `
                <i id="dark-mode-icon" class="fa-solid fa-moon"></i> Dark Mode
            `;
            localStorage.setItem('theme', 'lightMode')
        }
    }; 
};

