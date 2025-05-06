/* ************************************************************************** */
/*                         REGISTER PAGE SCRIPTS                              */
/* ************************************************************************** */
/**
 * @brief get the login page view
 *
 * Send AJAX request to get login page view
 * @param msg [OPTIONNAL] The message to be printed in the login info space
 */
function getLoginView(msg: string) {
	const xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.body.innerHTML = this.responseText;
			if (msg)
				setFormInfoMsg(msg);
		}
		else
			console.log("Error " + this.responseText);
	};
	xhttp.open("GET", "/auth/login", true);
	xhttp.send();
};

/**
 * @brief Helper to quicly set form reply text
 *
 * @param msg The message to display
 */
function setFormInfoMsg(msg: string) {
	const formReplyTextObj = document.getElementById("form-reply-info");

	if (!formReplyTextObj) {
		const infoTextZone = document.createElement("p");
		const infoText = document.createTextNode(msg);
		const form_enc = document.getElementById("auth-form-enc");

		if (!form_enc)
			return ;
		infoTextZone.setAttribute("id", "form-reply-info");
		infoTextZone.appendChild(infoText);
		form_enc.insertBefore(infoTextZone, form_enc.firstChild);
	}
	else
		formReplyTextObj.innerText = msg;
}

/**
 * @brief Register a new user if not exist
 */
function register() {
	const formElement = document.getElementById("register-form") as HTMLFormElement;
	if (!formElement)
		return ;
	const formData = new FormData(formElement);
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
	xhttp.open("POST", "/db/register", true);
	xhttp.send(formData);
}

/**
  * @brief Logout the user
  *
  * Remove the access token from the cookies then reload page view
  */
function logout() {
	document.cookie = "access_token=;expires=" + new Date(0).toUTCString();
	// browser.cookies.remove({
	// 	name: 'access_token',
	// });
	getLoginView("Logged out");
}


/* ************************************************************************** */
/*                          LOGIN PAGE SCRIPTS                                */
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
			const infoTextZone: HTMLParagraphElement = document.createElement("p");
			const infoText: string  = this.responseText;
			const form: HTMLElement | null = document.getElementById("register-form");
			const form_encapsulator: HTMLElement | null = document.getElementById("auth-form-enc");

			if (form_encapsulator === null)
				return;
			infoTextZone.innerHTML = infoText;
			form_encapsulator.insertBefore(infoTextZone, form);
		}
		if (this.readyState == 4 && this.status == 200) {
			document.body.innerHTML = this.responseText;
		}
	};

	xhttp.open("GET", "/auth/register", true);
	xhttp.send();
}

/**
 * @brief get the Pong game page
 *
 * Send AJAX request to get pong page view
 */
function getPongView() {
	const	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 400) {
			getLoginView("Unauthorized");
		}
		if (this.readyState == 4 && this.status == 200) {
			document.body.innerHTML = this.responseText;
			// document.body.innerHTML = this.responseText;

			// console.log((window as any).BALL_RADIUS);
			// if ((window as any).BALL_RADIUS == undefined) {
			// 	const script = document.createElement("script");
			// 	script.src = `/game/pong/public/pong.js`;
			// 	// script.src = `/game/pong/public/pong.js?v=${Date.now()}`;
			// 	document.head.appendChild(script);
			// }

			const existingScript = Array.from(document.getElementsByTagName('script')).find(
				script => script.src.includes('/game/pong/public/pong.js')
			);

			if (!existingScript) {
				const script = document.createElement("script");
				script.src = `/game/pong/public/pong.js`;
				// script.src = `/game/pong/public/pong.js?v=${Date.now()}`;
				document.head.appendChild(script);
			}
		}
	};

	xhttp.open("GET", "/game/pong", true);
	xhttp.send();
}

function verify_2fa() {
	const formElement = document.getElementById("2fa-form") as HTMLFormElement;
	if (!formElement)
		return ;
	const formData = new FormData(formElement);
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			getPongView();
		}
		else {
			if (!document.getElementById("form-reply-info")) {
				const errorText = document.createElement("p");
				errorText.innerHTML = this.responseText;
				errorText.setAttribute("id", "form-reply-info");
				document.getElementById("2fa-auth")!.appendChild(errorText);
			}
			else {
				document.getElementById("form-reply-info")!.innerHTML = this.responseText;
			}
			// setFormInfoMsg(this.responseText);
			// getLoginView("2FA code invalid");
		}
	};
	xhttp.open("POST", "/db/2fa", true);
	xhttp.send(formData);
}

function get2FAView() {
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.body.innerHTML = this.responseText;
		}
		else {
			setFormInfoMsg(this.responseText);
		}
	};
	xhttp.open("GET", "/auth/2fa", true);
	xhttp.send();
};

/**
 * @brief Perform login request
 *
 * Send AJAX login request (get JWT token)
 */
function loginUser() {
	const formElement = document.getElementById("login-form") as HTMLFormElement;
	if (!formElement)
		return ;
	const formData = new FormData(formElement);
	const xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200)
			get2FAView();
			// getPongView();
		else {
			setFormInfoMsg(this.responseText);
		}
	};
	xhttp.open("POST", "/db/login", true);
	xhttp.send(formData);
}
