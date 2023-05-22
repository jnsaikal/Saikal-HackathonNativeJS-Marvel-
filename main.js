let API = "http://localhost:8000/movies";

let form = document.querySelector(".inputs")
let inpImg = document.querySelector("#inpImage");
let inpTrailer = document.querySelector("#inpTrailer")
let inpTitle = document.querySelector("#inpTitle");
let inpDesc = document.querySelector("#inpDesc");
let btnAdd = document.querySelector("#btnAdd");
let inpCategory= document.querySelector("#inpCategory");
let cardsContainer = document.querySelector("#cards");

let movieList = document.querySelector(".movie-list");

// FILTER
let filterBtns = document.querySelector(".filter_btns ")
let categoryValue = "";
// FILTER

// SEARCH
let searchInp = document.querySelector(".search-inp")
let searchVal = "";

// SEARCH

// PAGINATION
let currentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination-list")
let prev = document.querySelector(".prev")
let next = document.querySelector(".next")
// PAGINATION

form.addEventListener("submit", (e) => {
  if (
    !inpTitle.value.trim() ||
    !inpImg.value.trim() ||
    !inpDesc.value.trim() ||
    !inpTrailer.value.trim()||
    !inpCategory.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }
let newCard = {
  title: inpTitle.value,
  image: inpImg.value,
  description: inpDesc.value,
  trailer: inpTrailer.value,
  category: inpCategory.value,
};
// creating a new object with the values that we have received in inputs
createCard(newCard)
readCard()
});

// ! Create - adding new movies

async function createCard(creatingCard) {
  await fetch(API,{
    method:"POST",
    headers:{
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(creatingCard),
  });
  inpTitle.value = "";
  inpImg.value = "";
  inpDesc.value = "";
  inpTrailer.value = "";
  inpCategory.value = "Age";
  // очистка инпутов
  readCard()
}


// !READ
async function readCard(){
  let res = await fetch(`${API}?q=${searchVal}&_page=${currentPage}&_limit=3`);

// GET-request to the specified API-end with the specified parameters
// and saves the answer object in the variable res,
// so that the data can be further processed.

let data = await res.json();
// распарсенные данные JSON, полученные из ответа сервера после вызова res.json()
  cardsContainer.innerHTML = "";
  movieList.innerHTML = "";

  // cleaning in order to get blank when we are adding new movie

  data.forEach(elem => {
    // everytime we add new movie we are displaying the information that we get from user
    cardsContainer.innerHTML +=`
    <div class="draw">
            <div class="card" style="width: 23rem; height: auto">
              <img
              onclick="redirectToTrailer('${elem.trailer}')"
                style="height: auto; width: 100%"
                src="${elem.image}"
                class="card-img-top"
                alt="..."
              />
              <div class="card-body">
                <h5 class="card-title">${elem.title}</h5>
                <p>${elem.category}</p>
                <p class="card-text"> ${elem.description}  </p>
                <button onclick="showModalEdit(${elem.id})" style="color: white;
                background-color: #09094c;
                border: none;
                border-radius: 5px;
                width: 40%;" class="btn btn-edit">Edit</button>
                <button onclick="deleteCard(${elem.id})" style="color: white;
                background-color: #09094c;
                border: none;
                border-radius: 5px;
                width: 40%;"  class="btn">Delete</button>
              </div>
            </div>      
          </div>
    `
  });
  drawPaginationButtons();
}
readCard()
function redirectToTrailer(trailerUrl) {
  window.location.href = trailerUrl;
}
// window.location - let us to get url of the current page

//! DELETE
   async function deleteCard(id) {
    await fetch(`${API}/${id}`,{
      method:"DELETE"
    });
    readCard()
   };
   

  // ! EDIT
  // getting elements to edit
  let modal = document.querySelector("#modalEdit");
let closeBtn = document.querySelector("#closeEditModal");
let editInpName = document.querySelector("#editInpTitle");
let editInpImage = document.querySelector("#editInpImage");
let editInpTrailer = document.querySelector("#editInpTrailer");
let editInpDesc = document.querySelector("#editInpDesc");
let editInpCategory = document.querySelector("#editInpCategory");
let editForm = document.querySelector("#editForm");
let btnSave = document.querySelector("#saveEditModal");

async function showModalEdit(id) {
  modal.style.display = "block";
  let res = await fetch(`${API}/${id}`);
  let data = await res.json();

  // we can see in console the information of which card we are going to edit
  console.log(data);

  editInpName.value = data.title;
  editInpImage.value = data.image;
  editInpTrailer.value = data.trailer;
  editInpDesc.value = data.description;
  editInpCategory.value = data.category;
  btnSave.setAttribute("id", data.id);
  // setting new information after the editing depending on what we have received in promise
}


editForm.addEventListener("submit", (e) => {
  let editedCard = {
    title: editInpName.value,
    image: editInpImage.value,
    trailer: editInpTrailer.value,
    description: editInpDesc.value,
    category: editInpCategory.value,
  };
  // reseting the card with new edited information
  
  editCardFunc(editedCard, btnSave.id);
});

// editCardFunc contains object with the udpated info. Sends the updated card to the server, close the editModal and display it on our website
async function editCardFunc(editedCard, id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editedCard),
    });
    modal.style.display = "none";
    readCard();
  } catch (error) {
    console.error(error);
  }
  
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});



// SEARCH
searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  readCard();
  // the value of the text intered into searchInp is saved in searchVal
  // and it's look for that value in the code above (let res)
});

// SEARCH

// PAGINATION
function drawPaginationButtons() {
  fetch(`${API}`)
    .then((res)=> res.json())
    .then((data)=> {
      pageTotalCount = Math.ceil(data.length/3);
      // devides pages by 3 movies, and if we have one more it will appear on the next page
      paginationList.innerHTML = "" 
      // is used to clean the paginationList element content 
      // to remove previous pagination buttons 
      // before creating and adding new buttons to drawPaginationButtons() function.
      for(let i =1; i<=pageTotalCount; i++){
        if(currentPage==i){
          let page =document.createElement('li')
        
          page.innerHTML = `<li class="page-item active"><a onclick = "changePage(${i})" class="page-link page-number" href="#">${i}</a></li> `
          paginationList.append(page);
        }
        else{
          let page =document.createElement('li')
        
          page.innerHTML = `<li class="page-item "><a onclick = "changePage(${i})" class="page-link page-number" href="#">${i}</a></li> `
          paginationList.append(page);
        }
      }
  
      if(currentPage===1){
        prev.classList.add('disabled');
      }
      else{
        prev.classList.remove("disabled")
      }
      if(currentPage === pageTotalCount){
        next.classList.add('disabled')
      }
      else{
        next.classList.remove("disabled")
      }
    })
  }
  
  prev.addEventListener('click',()=>{
    if(currentPage<=1){
      return
    }
    currentPage--
   
    readCard();
  })
  
  next.addEventListener('click', () => {
    if (currentPage >= pageTotalCount) {
      return;
    }
    currentPage++;
    readCard();
  });

readCard();

function changePage(pageNumber) {
  currentPage = pageNumber;
  readCard()
  // Assigns the currentPage variable a pageNumber value,
  //  that is, sets the current page to the specified page number.
}

// FILTER
// функция для фильтрации по категориям
function filterByCategory(value) {
    categoryValue = value;
  // вызов функции для отрисовки с учетом categoryValue
  readCard();
}
// FILTER
