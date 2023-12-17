// Select Elements
siteNameInput = document.getElementById("siteName");
siteURLInput = document.getElementById("siteURL");
InputsList = [siteNameInput, siteURLInput];
addBtn = document.getElementById("addBtn");
updateBtn = document.getElementById("updateBtn");
tableCaption = document.getElementById("tCaption");

// Handle Clear Inputs
function clearInputs(){
  siteNameInput.value = "";
  siteURLInput.value = "";
}

// Handle Add Site
var sitesList = [];
sitesList = (localStorage.getItem("sites") != null) ? JSON.parse(localStorage.getItem("sites")) : [];
if (sitesList.length > 0) {displaySites(sitesList)};
function addSite(){
  if (checkValidate()){
    site = {
      siteName: siteNameInput.value,
      siteURL: siteURLInput.value
    }
    sitesList.push(site);
    localStorage.setItem("sites", JSON.stringify(sitesList));
    displaySites(sitesList);
    clearInputs();
    InputsList.forEach(input => input.classList.remove("is-valid"));
  }
  else {
    Swal.fire({
      title: "Please enter a valid input!",
      icon: "warning"
    });
    InputsList.forEach(input => {if(!input.classList.contains("is-valid")) {input.classList.add("is-invalid")}});
  }
}

// Handle Display Sites
function displaySites(sitesList){
  var rowsBox = "";
  for (var i=0; i<sitesList.length; i++){
    rowsBox += `
    <tr>
      <td>${i+1}</td>
      <td>${sitesList[i].siteName}</td>
      <td><button onclick="visitSite(${i})" class="btn btn-info"><i class="fa-solid fa-eye"></i></button></td>       
      <td>
          <div id="actionBtns" class="d-flex">
            <button onclick="fillForm(${i})" class="btn btn-warning"><i class="fa-solid fa-pencil"></i></button>
            <button onclick="deleteSite(${i})" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
          </div>
      </td>
    </tr>    
    `
  }
  document.getElementById("tBody").innerHTML = rowsBox;
  tableCaption.innerHTML = `Sites Count: <span>${sitesList.length}</span>`
}


// Handle Visit Site
function visitSite(index){
  var httpsRegex = /^https?:\/\//;
  if (httpsRegex.test(sitesList[index].siteURL)) {
    window.open(sitesList[index].siteURL, '_blank');
  } else {
    window.open(`https://${sitesList[index].siteURL}`, '_blank');
  }
}

// Handle Delete Site
function deleteSite(index){
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-danger mx-2",
      cancelButton: "btn btn-success mx-2"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      sitesList.splice(index,1);
      // overwrite/update localStorage
      localStorage.setItem("sites", JSON.stringify(sitesList));
      displaySites(sitesList);
      swalWithBootstrapButtons.fire({
        title: "Deleted!",
        text: "Site has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 1000
      });
    }
  });
}

// Handle Update Site
let indexUpdate;
function fillForm(i){
  updateBtn.classList.toggle("btn-hide");
  addBtn.classList.toggle("btn-hide");
  siteNameInput.value = sitesList[i].siteName;
  siteURLInput.value = sitesList[i].siteURL;
  indexUpdate = i;
  validate(siteNameInput, nameRegexp);
  validate(siteURLInput, urlRegexp);
}
function updateSite(){
  if (checkValidate()  ){
    updateBtn.classList.toggle("btn-hide");
    addBtn.classList.toggle("btn-hide");
    sitesList[indexUpdate].siteName = siteNameInput.value;
    sitesList[indexUpdate].siteURL = siteURLInput.value;
    // overwrite/update localStorage
    localStorage.setItem("sites", JSON.stringify(sitesList));
    displaySites(sitesList);
    clearInputs();
    indexUpdate = null;
    InputsList.forEach(input => input.classList.remove("is-valid"));
  }
  else {
    Swal.fire({
      title: "Please enter a valid input!",
      icon: "warning"
    });
    InputsList.forEach(input => {if(!input.classList.contains("is-valid")) {input.classList.add("is-invalid")}});
  }
}

// Handle Search
let matchedSitesList = [];
function searchName(searchKeyword){
  matchedSitesList = sitesList.filter(p => p.siteName.toLowerCase().includes(searchKeyword.toLowerCase()));
  displaySites(matchedSitesList)
  // console.log(matchedSitesList)
}

// Handle Input Validation
var nameRegexp = /^\w{3,}(\s+\w+)*$/;
var urlRegexp = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

function validate(element, regexp){
if (regexp.test(element.value)){
  element.classList.add("is-valid");
  element.classList.remove("is-invalid");
}
else {
  element.classList.add("is-invalid");
  element.classList.remove("is-valid");
}
}

siteNameInput.addEventListener("input", function () {
  validate(siteNameInput, nameRegexp);
});
siteURLInput.addEventListener("input", function () {
  validate(siteURLInput, urlRegexp);
});

function checkValidate(){
  return InputsList.every(input => input.classList.contains("is-valid"));
}

// Handle Sorting/Ordering Table
colName = document.getElementById("colName");
let sort_asc = true;
colName.onclick = () => {
  colName.classList.add('active-sort');
  colName.classList.toggle('asc', sort_asc);
  sort_asc = colName.classList.contains('asc') ? false : true;
  sortTable(sort_asc);
}
function sortTable(sort_asc,) {
let sitesListToSort = (matchedSitesList.length > 0) ? matchedSitesList : sitesList;
sitesListToSort.sort((a, b) => {
    let first_row =  a.siteName.toLowerCase(),
        second_row =  b.siteName.toLowerCase();
    return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
})
    displaySites(sitesListToSort);
}