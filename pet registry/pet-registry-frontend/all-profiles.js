import { calculateAge } from './utils.js';
import { displayModal } from './modal.js';
const animalList = document.getElementById('animal-list-ul');
const searchInput = document.getElementById('search-input');
const backButton = document.getElementById('back-button');
const storageKey = 'animalProfiles';
let allProfiles = [];
let profileToRemoveId = null;

function loadProfiles() {
      //no need to load from local storage
        fetch('/getAllAnimals')
        .then(response => response.json())
        .then(data => {
            if(data.error === "true"){
                alert("There was a problem retrieving profiles. " + data.message)
           } else{
            allProfiles = data;
            displayProfiles(allProfiles);
         }
    }).catch(error => {
             console.error('Error:', error);
             alert('There was an error communicating with the server');
        });
}
function saveProfiles() {
     //no need to save to local storage anymore
}
function displayProfiles(profiles) {
     try {
          animalList.innerHTML = ''; // Clear existing list
        allProfiles.sort((a, b) => a.name.localeCompare(b.name));
        allProfiles.forEach(profile => addAnimalToList(profile));
     } catch (error) {
      console.error("Error displaying profiles", error)
        alert("Error displaying profiles");
    }
}
function addAnimalToList(profile) {
    try {
     const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="animal-card">
              <a href="profile.html?id=${profile.id}">
                <div class="animal-info">
                    <h3>${profile.name}</h3>
                    <p><strong>Species:</strong> ${profile.species}</p>
                    ${profile["scientific-name"] ? `<p><strong>Scientific Name:</strong> ${profile["scientific-name"]}</p>` : ''}
                    ${profile.breed ? `<p><strong>Breed:</strong> ${profile.breed}</p>` : ''}
                    <p><strong>Age:</strong> ${calculateAge(profile.dob)}</p>
                 </div>
                  ${profile.photo ? `<img class="animal-image" src="${profile.photo}" alt="${profile.name}'s photo">` : ''}
              </a>
              <button class="remove-button" data-id="${profile.id}">Remove</button>
            </div>
       `;
       animalList.appendChild(listItem)
    } catch (error) {
        console.error("Error adding animal to list", error);
        alert("Error adding animal to list");
    }
}
backButton.addEventListener('click', function(event){
    event.preventDefault();
  window.location.href = "index.html";
});
animalList.addEventListener('click', function(event){
    if (event.target.classList.contains('remove-button')) {
        event.preventDefault();
        profileToRemoveId = event.target.getAttribute('data-id');
        displayModal(
          "Are you sure you want to remove this profile?",
           () => { removeProfileFromList(profileToRemoveId); profileToRemoveId = null },
            () => { profileToRemoveId = null }
       );
    }
});
function removeProfileFromList(profileId) {
       fetch(`/deleteAnimal?id=${profileId}`, {method: 'DELETE'})
           .then(response => {
            if(!response.ok){
                alert("There was an error deleting the profile");
             }
             else {
                 loadProfiles();
            }
        }).catch(error =>{
            console.error("Error deleting profile", error)
             alert("Error deleting profile");
         })
}
searchInput.addEventListener('input', function () {
  try {
         const searchTerm = searchInput.value.toLowerCase();
          const filteredProfiles = allProfiles.filter(profile => {
            return profile.name.toLowerCase().includes(searchTerm) ||
                   profile.species.toLowerCase().includes(searchTerm) ||
                    profile["scientific-name"]?.toLowerCase().includes(searchTerm);
        });
           displayProfiles(filteredProfiles);
    } catch (error) {
        console.error("Error searching profiles", error);
        alert("Error searching profiles.");
    }
});
loadProfiles();