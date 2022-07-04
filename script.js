
const resultsNav = document.getElementById('resultsNav');
const favoritesNav =document.getElementById('favoritesNav');
const imagesContiner= document.querySelector('.images-container');
const saveConfirmed =document.querySelector('.save-confirmed');
const loader= document.querySelector('.loader');


// NASA API
const count=10;
const apiKey='DEMO_KEY';
const apiUrl=`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray =[];
let favorites={};

function showContent(page){
    window.scrollTo({
        top:0,
        behavior: 'instant'
    });
    if(page === 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }
    else{
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function setEnumerable(){
    Object.defineProperty(favorites, 'url', { enumerable: true });
    Object.defineProperty(favorites, 'hdurl', { enumerable: true });
    Object.defineProperty(favorites, 'title', { enumerable: true });
    Object.defineProperty(favorites, 'explanation', { enumerable: true });
    Object.defineProperty(favorites, 'date', { enumerable: true });
    Object.defineProperty(favorites, 'copyright', { enumerable: true });
    Object.defineProperty(favorites, 'media_type', { enumerable: true });
    
}


function createDOMNodes(page){

   
    setEnumerable();
    
    let currentArray;

    if(page === 'results'){
       currentArray=resultsArray;
    }
    else{
         currentArray= Object.values(favorites);

    }


    currentArray.forEach((result) => {
        if(result){
           // card container
        const card=document.createElement('div');
        card.classList.add('card');
        // link
        const link=document.createElement('a');
        link.href=result.hdurl;
        link.title= 'View Full Image';
        link.target='_blank';
        // image
        const image=document.createElement('img');
        image.src=result.url;
        image.alt='NASA Picture of the Day';
    
         image.loading='lazy';
        image.classList.add('card-img-top');
        // card body
        const cardBody=document.createElement('div');
        cardBody.classList.add('card-body');
        // card title
        const cardTitle=document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent=result.title;
        // save text
        const saveText=document.createElement('p');
        saveText.classList.add('clickable')
        if(page === 'results'){
            saveText.textContent='Add To Favorites';
        
        // function to add favorites
        saveText.setAttribute('onclick',`saveFavorite('${result.url}')`);

        }
        else{
            saveText.textContent='Remove Favorite';
        
       
        saveText.setAttribute('onclick',`removeFavorite('${result.url}')`);

        }

        // card text
        const cardText=document.createElement('p');
        cardText.textContent=result.explanation;
        // footer
        const footer= document.createElement('small');
        footer.classList.add('text-muted');
        // date
        const date=document.createElement('strong');
        date.textContent=result.date;
        // copyright
        const copyrightcheck= result.copyright === undefined? '' : result.copyright;
        const copyright=document.createElement('span');
        copyright.textContent=`  ${copyrightcheck}`;

        // append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText,footer);
        link.append(image);
        card.append(link, cardBody);
        imagesContiner.appendChild(card);

        

       

    
 }
});
        
  
  


 
}

function updateDOM(page) {
   
    
    // get favorites from localStorage
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        
    }
    imagesContiner.textContent='';
    createDOMNodes(page);
    showContent(page);
    
    
}

// get images from NASA API
 async function getNasaPictures(){
    // show loader
    loader.classList.remove('hidden');
    try{
       const response = await fetch(apiUrl);
       resultsArray= await response.json();
       
       updateDOM('results');
       
      
    }catch(error){

    }
 }

//  add result to favorites

function saveFavorite(itemUrl){
    //    looping to select favorite item
    resultsArray.forEach((item)=>{
       if(item.url.includes(itemUrl) && !favorites[itemUrl]){
        favorites[itemUrl]=item;
       
        // show save confirmation for 2 sec
        saveConfirmed.hidden=false;
        setTimeout(()=>{
            saveConfirmed.hidden=true;
        },2000);
        
        // save favorites in local storage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));

       }
    });
}

// remove favorite

function removeFavorite(itemUrl){
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
        // set favorites in localStorege;
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}


getNasaPictures();