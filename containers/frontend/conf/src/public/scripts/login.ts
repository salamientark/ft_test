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
			const	main: HTMLElement | null = document.getElementById("main");
			if (main === null)
				return;
			main.innerHTML = this.responseText;
		}
	};

	xhttp.open("GET", "/auth/register", true);
	xhttp.send();
}

/**
 * @brief Perform login request
 *
 * Send AJAX login request (get JWT token)
 */
// function loginUser() {
	// const formData = new FormData(document.getElementById("login-form"));
	// const xhttp = new XMLHttpRequest();
	//
	// xhttp.onreadystatechange = function() {
	// 	if (this.readyState == 4 && this.status == 401) {
	// 		setFormInfoMsg(this.responseText);
	// 	}
	// 	if (this.readyState == 4 && this.status == 200) {
	// 		document.getElementById("main").innerHTML = this.responseText;
	// 	}
	// };
	// xhttp.open("POST", "/auth/login", true);
	// xhttp.send(formData);
// }
