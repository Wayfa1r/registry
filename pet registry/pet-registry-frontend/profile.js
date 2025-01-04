document.addEventListener('DOMContentLoaded', function () {
    const profileContent = document.getElementById('profile-page-content');
    const storageKey = 'animalProfiles';
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const documentUploadInput = document.getElementById('document-upload');
    const uploadDocumentButton = document.getElementById('upload-document-button');
    const documentList = document.getElementById('document-list');
    const photoUploadInput = document.getElementById('photo-upload');
    const uploadPhotoButton = document.getElementById('upload-photo-button');
    const photoGallery = document.getElementById('photo-gallery');
    const editProfileButton = document.getElementById('edit-profile-button');
  const backButton = document.getElementById('back-button');
      let currentProfile; // will be populated with the correct profile from the list
    // Function to get profile from local storage by id
    function getProfileById(profileId) {
        const storedProfiles = localStorage.getItem(storageKey);
        if (storedProfiles) {
            const profiles = JSON.parse(storedProfiles);
             currentProfile =  profiles.find(profile => profile.id === profileId);
               return currentProfile;
        }
        return null;
    }
    function saveProfiles(profiles) {
      localStorage.setItem(storageKey, JSON.stringify(profiles));
    }
      function calculateAge(dob) {
         const birthDate = new Date(dob);
         const currentDate = new Date();
         let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
        let ageMonths = (ageYears * 12) + (currentDate.getMonth() - birthDate.getMonth());

            const dayDiff = currentDate.getDate() - birthDate.getDate();
           if (dayDiff < 0) {
               ageMonths--;
          }

        if (ageMonths < 12) {
            return ageMonths + ' months';
        } else {
           return (ageMonths/ 12) + ' years';
      }
    }
        function displayPhotos(profile) {
             photoGallery.innerHTML = ""; // clear the photo list
            if(profile.photos && profile.photos.length > 0){
               profile.photos.forEach(photo =>{
                    const photoItem = document.createElement('div');
                      photoItem.innerHTML = `<img src="${photo.url}" alt="${photo.name}">`;
                       photoGallery.appendChild(photoItem);
               });
            } else{
                photoGallery.innerHTML = "<p>No photos uploaded yet</p>";
            }

         }
        function displayDocuments(profile) {
             documentList.innerHTML = ""; // clear the document list
            if(profile.documents && profile.documents.length > 0){
               profile.documents.forEach(document =>{
                    const documentItem = document.createElement('div');
                      documentItem.innerHTML = `<a href="${document.url}" target="_blank">${document.name}</a>`;
                       documentList.appendChild(documentItem);
               });
            } else{
                documentList.innerHTML = "<p>No documents uploaded yet</p>";
            }

         }
       function getAnimalProfile(animalId) {
             return fetch(`/getAnimal?id=${animalId}`)
            .then(response => response.json())
            .then(data =>{
               if (data.error === "true"){
                  alert(data.message);
                  return null;
                 }
               return data;
             });
         }
    // Function to display profile details on page
    function displayProfile(profile) {
         try {
           const detailsContent = document.getElementById('details-tab');
            const medicalContent = document.getElementById('medical-tab');
         const generalInfoContent = document.getElementById('general-info-tab');
          const age = calculateAge(profile.dob);

           generalInfoContent.innerHTML = "";
          detailsContent.innerHTML = `
              <div class="profile-card">
                 <div class="animal-info">
                    <h3>${profile.name}</h3>
                     <p><strong>ID Number:</strong> ${profile["id-number"]}</p>
                     <p><strong>Species:</strong> ${profile.species}</p>
                      ${profile["scientific-name"] ? `<p><strong>Scientific Name:</strong> ${profile["scientific-name"]}</p>` : ''}
                   ${profile.breed ? `<p><strong>Breed:</strong> ${profile.breed}</p>` : ''}
                    <p><strong>Date of Birth:</strong> ${profile.dob}</p>
                     <p><strong>Gender:</strong> ${profile.gender}</p>
                      <p><strong>Age:</strong> ${age}</p>
                         ${profile["spayed-neutered"] ? `<p class="spayed-neutered-info"><strong>Spayed/Neutered:</strong> Yes</p>
                         `:`<p class="spayed-neutered-info"><strong>Spayed/Neutered:</strong> No</p>`}
                     ${profile.description ? `<p><strong>Description:</strong> ${profile.description}</p>` : ''}
                   </div>
                 ${profile.photo ? `<img class="animal-image" src="${profile.photo}" alt="${profile.name}'s photo">` : ''}
               </div>
           `;
           medicalContent.innerHTML = `
                  <div class="medical-info">
                    <h3>Medical Information</h3>
                     ${profile.vaccinations ? `<p><strong>Vaccinations:</strong> ${profile.vaccinations}</p>` : ''}
                     ${profile.allergies ? `<p><strong>Allergies:</strong> ${profile.allergies}</p>`: ''}
                     ${profile.medications ? `<p><strong>Medications:</strong> ${profile.medications}</p>` : ''}
                     ${profile.notes ? `<p><strong>Notes:</strong> ${profile.notes}</p>` : ''}
                   </div>
           `;
            displayPhotos(profile);
        displayDocuments(profile);

  } catch (error) {
       console.error("Error displaying profile", error);
    alert("Error displaying profile");
 }
}
       backButton.addEventListener('click', function(event){
        event.preventDefault();
         window.location.href = "index.html";
    })
       editProfileButton.addEventListener('click', function() {
             window.location.href = `index.html?edit=${currentProfile.id}`;
         });
     // Upload photo functionality
        uploadPhotoButton.addEventListener('click', function(){
       if(photoUploadInput.files.length > 0){
          let files = Array.from(photoUploadInput.files);
              let promises = files.map(file => {
                  return new Promise((resolve, reject) => {
                      const reader = new FileReader();
                       reader.onload = function(e){
                           resolve({name: file.name, url: e.target.result})
                        };
                        reader.onerror = reject;
                         reader.readAsDataURL(file);
                  })
             });
           Promise.all(promises).then(results => {
             let profiles =  JSON.parse(localStorage.getItem(storageKey));
               let currentProfileIndex  = profiles.findIndex(profile => profile.id === currentProfile.id);
                   if(!profiles[currentProfileIndex].photos){
                       profiles[currentProfileIndex].photos = [];
                   }
                  profiles[currentProfileIndex].photos =  profiles[currentProfileIndex].photos.concat(results);
                 saveProfiles(profiles);
                  displayPhotos(profiles[currentProfileIndex]) // refresh the page
            })
       }
     });
    // Upload document functionality
     uploadDocumentButton.addEventListener('click', function(){
       if(documentUploadInput.files.length > 0){
          const file = documentUploadInput.files[0];
          const reader = new FileReader();
             reader.onload = function(e){
              let profiles =  JSON.parse(localStorage.getItem(storageKey));
                    let currentProfileIndex  = profiles.findIndex(profile => profile.id === currentProfile.id);
                    if(!profiles[currentProfileIndex].documents){
                        profiles[currentProfileIndex].documents = [];
                    }

                profiles[currentProfileIndex].documents.push({name: file.name, url: e.target.result})
                  saveProfiles(profiles);
                  displayDocuments(profiles[currentProfileIndex]) // refresh the page
              }
                reader.readAsDataURL(file);
       }
     });
    // Get the profile ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');
        // Load and display profile if ID is valid
   if (profileId) {
      getAnimalProfile(profileId)
      .then(profile =>{
        if(profile){
          displayProfile(profile);
            currentProfile = profile;
       }else{
          profileContent.innerHTML = "<p>Profile not found.</p>"
       }
      })
     } else {
      profileContent.innerHTML = "<p>Invalid profile ID</p>"
     }
   // Tab functionality
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
          const tabId = this.getAttribute('data-tab');

          // Remove active class from all tabs
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));

          // Add active class to the selected tab
         this.classList.add('active');
          document.getElementById(tabId).classList.add('active');
        });
    });
});