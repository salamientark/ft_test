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
