/* ************************************************************************** */
/*                         REGISTER PAGE SCRIPTS                              */
/* ************************************************************************** */
/**
 * @brief get the login page view
 *
 * Send AJAX request to get login page view
 * @param msg [OPTIONNAL] The message to be printed in the login info space
 */
function getLoginView() {
	const xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.body.innerHTML = this.responseText;
		}
		else
			console.log("Error " + this.responseText);
	};
	xhttp.open("GET", "/auth/login", true);
	xhttp.send();
};

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
