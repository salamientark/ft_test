/* ************************************************************************** */
/*                             MUTATION OBSERVER                              */
/* ************************************************************************** */
// /**
//  * Add event listener to register button
//  */
// function addRegisterButtonEvent() {
// 	const registerButton = document.getElementById("register-button");
// 	if (registerButton) {
// 		registerButton.addEventListener("click", getRegisterView);
// 	}
// };
//
// /**
//  * Create a mutationObserver object that will add event listener when needed
//  */
// const observer = new MutationObserver(function(mutation) {
// 	mutation.forEach(function(mutation) {
// 		if (mutation.type === "childList") {
// 			addRegisterButtonEvent();
// 		}
// 	});
// });
//
// // Start observing the DOM for mutation
// observer.observe(document.body, { childList: true, subtree: true });
//
// // Initial check in case the initial element is present
// addRegisterButtonEvent();


/* ************************************************************************** */
/*                             REGISTER SCRIPTS                               */
/* ************************************************************************** */
function getRegisterView() {
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 400) {
			const infoTextZone = document.createElement("p");
			const infoText = this.responseText;
			// const infoText = document.createTextNode("Username already in use");
			const form = document.getElementById("register-form");
			infoTextZone.appendChild(infoText);
			document.getElementById("auth-form-enc").insertBefore(infoTextZone, form);
		}
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("main").innerHTML = this.responseText;
		}
	};
	xhttp.open("GET", "/auth/register", true);
	xhttp.send();
}

/**
 * @brief Helper to quicly set form reply text
 *
 * @param msg The message to display
 */
function setFormInfoMsg(msg) {
	if (!document.getElementById("form-reply-info")) {
		const infoTextZone = document.createElement("p");
		infoTextZone.setAttribute("id", "form-reply-info");
		const infoText = document.createTextNode(msg);
		infoTextZone.appendChild(infoText);
		document.getElementById("auth-form-enc").insertBefore(infoTextZone, document.getElementById("auth-form-enc").firstChild);
	}
	else {
		const formReplyTextObj = document.getElementById("form-reply-info");
		formReplyTextObj.innerText = msg;
	}
}
/**
 * @brief Register a new user if not exist
 */
function register() {
	const formData = new FormData(document.getElementById("register-form"));
	const xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 400) {
			setFormInfoMsg(this.responseText);
		}
		if (this.readyState == 4 && this.status == 200) {
			getLoginView("User registered");
			setFormInfoMsg("User registered");
		}
	};
	xhttp.open("POST", "/auth/register/new", true);
	xhttp.send(formData);
}

/* ************************************************************************** */
/*                               LOGIN SCRIPTS                                */
/* ************************************************************************** */
function getLoginView(msg) {
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("main").innerHTML = this.responseText;
			if (msg)
				setFormInfoMsg(msg);
		}
	};
	xhttp.open("GET", "/auth/login", true);
	xhttp.send();
};
