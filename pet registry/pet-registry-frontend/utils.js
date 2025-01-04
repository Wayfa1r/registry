// utils.js
export function calculateAge(dob) {
    try {
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

    } catch (error) {
        console.error('Error calculating age:', error);
        return 'N/A';
    }
}
export function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve({ name: file.name, url: e.target.result });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function getProfileIndex(profiles, profileId) {
    return profiles.findIndex(profile => profile.id === profileId);
}
export function displayItems(items, container, type) {
    container.innerHTML = ""; // clear the list
    if (items && items.length > 0) {
        items.forEach(item => {
            const itemElement = document.createElement('div');
            if (type === "document") {
                itemElement.innerHTML = `<a href="${item.url}" target="_blank">${item.name}</a>`;
            } else if (type === "photo") {
                itemElement.innerHTML = `<img src="${item.url}" alt="${item.name}">`;
            }
            container.appendChild(itemElement);
        });
    } else {
        container.innerHTML = `<p>No ${type}s uploaded yet</p>`;
    }
}

export function generateUniqueId() {
   return Date.now().toString(36) + Math.random().toString(36).substring(2);
}