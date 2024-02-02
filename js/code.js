const urlBase = 'http://cop4331c-group27.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let userName = "";
let firstName = "";
let lastName = "";
let phoneNumber = "";
let emailAddress = "";

function validatePhoneNumber(phone) {
    // Check if phone number has exactly 10 digits
    return /^\d{10}$/.test(phone);
}

function validatePassword(password) {
    // Check if password has at least 6 characters and at least one number
    return /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/.test(password);
}

// LOGIN AND SIGNUP COMPLETE

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("login").value;
	let password = document.getElementById("loginpassword").value;
	//var hash = md5( password );
	
	let tmp = {login:login,password:password};
	//var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("error-message").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "homepage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("error-message").innerHTML = err.message;
	}

}


function doRegister() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let login = document.getElementById("username").value;
    let password = document.getElementById("registerpassword").value;
    let verify = document.getElementById("verifyPassword").value;
    let phoneNumber = document.getElementById("phoneNumber").value; // Add this line
    let emailAddress = document.getElementById("emailAddress").value; // Add this line

    if (password != verify) {
		alert("Passwords do not match");
        return;
    }

    if (firstName == "" || lastName == "" || login == "" || password == "" || verify == "" || phoneNumber == "" || emailAddress == "") {
        alert("Missing Fields");
        return;
    }

	if (!validatePhoneNumber(phoneNumber)) {
		alert("Invalid phone number (must have 10 digits)");
        return;
    }

    if (!validatePassword(password)) {
        alert("Invalid password (must be at least 6 characters with at least one number)");
        return;
    }

    let currentDate = new Date();
    let dateCreated = currentDate.toISOString(); // Convert to ISO format

    let tmp = {
        firstName,
        lastName,
        login,
        password,
        phoneNumber,
        emailAddress,
        dateCreated  // Add this line for the date created
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    alert("User already exists");
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                location.reload();
                alert("Successfully added user!");
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Registration failed: " + err.message);
    }
}


// EVERYTHING BELOW IS BEYOND LOGIN/SIGNUP NEEDS FIXING!!!


function doUpdateContactInfo() {
	let updateUserName = document.getElementById("updateUserName").value;
    let updateFirstName = document.getElementById("updateFirstName").value;
    let updateLastName = document.getElementById("updateLastName").value;
	let updatePhone = document.getElementById("updatePhone").value;
    let updateEmail = document.getElementById("updateEmail").value;

    if (firstName == "" || lastName == "" || login == "" || password == "" || verify == "" || phoneNumber == "" || emailAddress == "") {
        alert("Empty Field(s)");
        return;
    }

    let updateData = {
        userId: userId,
		userName: updateUserName,
        firstName: updateFirstName,
        lastName: updateLastName,
		phoneNumber: updatePhone,
		emailAddress: updateEmail
    };

    let jsonPayload = JSON.stringify(updateData);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let updateResult = JSON.parse(xhr.responseText);

                if (updateResult.success) {
                    alert("Contact information updated successfully!");
                    // You can also redirect to the home page or perform other actions as needed
                } else {
                    alert("Failed to update contact information. Please try again.");
                }
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        console.error("Update failed: " + err.message);
    }
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}


function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
}


function displayUserInfo() {
    // Assuming you have elements with these IDs in your HTML
    document.getElementById("userFirstName").innerText = firstName;
    document.getElementById("userLastName").innerText = lastName;
    document.getElementById("userId").innerText = userId;
}


function doLogout()
{
	userId = 0;
	userName = "";
	firstName = "";
	lastName = "";
	phoneNumber = "";
	emailAddress = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


function doViewInfo()
{
	window.location.href = "info.html";
	readCookie();
	displayUserInfo();
}


function doUpdateInfo()
{
	window.location.href = "update.html";
}


function doHome()
{
	window.location.href = "homepage.html";
}


function doSearchContacts() {
    let search = document.getElementById("search").value;
    
    if (!search) {
        alert("Please enter a search query.");
        return;
    }

    // Example API endpoint for searching contacts
    let url = urlBase + '/SearchContact.' + extension;

    let searchData = { search: search };
    let jsonPayload = JSON.stringify(searchData);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let searchResults = JSON.parse(xhr.responseText);

                // Handle search results, for example, display them on the page
                displaySearchResults(searchResults);
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        console.error("Search failed: " + err.message);
    }
}


function displaySearchResults(results) {
    // Assuming you have an element with the id "searchResults" to display the results
    let searchResultsContainer = document.getElementById("searchResults");

    // Clear previous search results
    searchResultsContainer.innerHTML = "";

    if (results.length === 0) {
        searchResultsContainer.innerHTML = "No results found.";
        return;
    }

    // Iterate through the results and display them
    for (let i = 0; i < results.length; i++) {
        let contact = results[i];

        let resultElement = document.createElement("div");
        resultElement.innerHTML = `${contact.firstName} ${contact.lastName} - ${contact.email}`; // Adjust fields as per your contact structure
        searchResultsContainer.appendChild(resultElement);
    };
}