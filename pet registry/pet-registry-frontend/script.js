import { generateUniqueId, readFile } from './utils.js';

const form = document.getElementById('registration-form');
const mainTabButtons = document.querySelectorAll('.main-tab-button');
const mainTabContents = document.querySelectorAll('.main-tab-content');
const storageKey = 'animalProfiles';
let allProfiles = [];
let editProfileId = new URLSearchParams(window.location.search).get('edit');

function loadProfiles() {
  //no need to load from local storage anymore
}

function saveProfiles() {
     //no need to save to local storage anymore
}

function removeProfileFromList(profileId) {
    //no need to remove from local storage
}
function loadExistingProfile(profile){
    document.getElementById('name').value = profile.name;
    document.getElementById('scientific-name').value = profile["scientific-name"];
    document.getElementById('species').value = profile.species;
    document.getElementById('breed').value = profile.breed;
    document.getElementById('dob').value = profile.dob;
    document.getElementById('gender').value = profile.gender;
    document.getElementById('description').value = profile.description;
    document.getElementById('vaccinations').value = profile.vaccinations;
    document.getElementById('allergies').value = profile.allergies;
    document.getElementById('medications').value = profile.medications;
    document.getElementById('notes').value = profile.notes;
    document.getElementById('spayed-neutered').checked = profile["spayed-neutered"] || false;
}
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    let profileId = generateUniqueId();
    if(editProfileId){
         profileId = editProfileId;
         editProfileId = null;
    }
     const fileInput = document.getElementById('photo');
      let newAnimal = {
        id: profileId,
       "id-number": document.getElementById('id-number').value,
        name: document.getElementById('name').value,
        "scientific-name": document.getElementById('scientific-name').value,
        species: document.getElementById('species').value,
        breed: document.getElementById('breed').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        description: document.getElementById('description').value,
        vaccinations: document.getElementById('vaccinations').value,
        allergies: document.getElementById('allergies').value,
        medications: document.getElementById('medications').value,
        notes: document.getElementById('notes').value,
        "spayed-neutered": document.getElementById('spayed-neutered').checked,
      };
    if (fileInput.files.length > 0) {
        try {
            const file = fileInput.files[0];
           const { url } = await readFile(file);
           newAnimal.photo = url;
         } catch (error) {
            console.error('Error reading file:', error);
            alert('There was a problem reading the photo. Please try again.');
            return;
         }
    }
     fetch("/addAnimal", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAnimal),
       }).then(response => {
           if(response.ok){
              form.reset();
             alert("Profile successfully created!");
           } else {
              response.json().then(data => {
               alert("There was a problem creating the profile: " + data.message)
              })
          }
       })

});
mainTabButtons.forEach(button => {
    button.addEventListener('click', function(){
        const tabId = this.getAttribute('data-tab');

        mainTabButtons.forEach(button => button.classList.remove('active'));
        mainTabContents.forEach(content => content.classList.remove('active'));

         this.classList.add('active');
          if(tabId === "animal-list-tab"){
               window.location.href = 'all-profiles.html';
          } else {
                document.getElementById(tabId).classList.add('active');
         }
    })
 });
function handleRfidScan() {
    fetch('/scanRfid')
        .then(response => response.json()) //parse the json response from the backend
        .then(data => {
             if (data.error === "true"){
                 alert(data.message);
             } else{
                 window.location.href = `/profile.html?id=${data.animalId}`;
             }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error communicating with the server');
        });
}
loadProfiles();