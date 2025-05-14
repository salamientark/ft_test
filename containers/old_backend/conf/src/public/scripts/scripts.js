/* ************************************************************************** */
/*                             REGISTER SCRIPTS                               */
/* ************************************************************************** */
/**
 * @brief get the register page view
 *
 * Send AJAX request to get register page view
 */
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
/**
 * @brief get the login page view
 *
 * Send AJAX request to get login page view
 * @param msg [OPTIONNAL] The message to be printed in the login info space
 */
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

/**
 * @brief Perform login request
 *
 * Send AJAX login request (get JWT token)
 */
function loginUser() {
	const formData = new FormData(document.getElementById("login-form"));
	const xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 401) {
			setFormInfoMsg(this.responseText);
		}
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("main").innerHTML = this.responseText;
		}
	};
	xhttp.open("POST", "/auth/login", true);
	xhttp.send(formData);
}

/**
 * @brief Logout user
 *
 * Lougout user
 */
function logout() {
	const xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("main").innerHTML = this.responseText;
		}
		console.log("Succesfule logout");
	};
	xhttp.open("GET", "/secure/logout");
	xhttp.send();
};

/* ************************************************************************** */
/*                             BLOCKCHAIN OBSERVER                              */
/* ************************************************************************** */
function getAllTournamentScore() {
	const xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("main").innerHTML = this.responseText;
		}
	};
	xhttp.open("GET", "/secure/tournament/score", true);
	xhttp.send();
}

function saveScore() {
	const formData = new FormData(document.getElementById("tournament-result"));
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("main").innerHTML = this.responseText;
		}
	};
	xhttp.open("POST", "/secure/tournament/score", true);
	xhttp.send(formData);
}
