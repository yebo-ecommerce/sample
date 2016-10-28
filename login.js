(function() {
  // To manage the fulux th elogin could be recreated if its after user add
  // cart
  // if is before it calls other things
  const createLogin = function(doc, event) {
    const emailInput = doc.createElement("input")
    emailInput.value = "teste@teste.com"

    const passwordInput = doc.createElement("input")
    passwordInput.value = "123123"

    const btn = doc.createElement("button")
    btn.innerText = "Login"
    btn.addEventListener("click", event(emailInput, passwordInput))

    const form = doc.createElement("form")
    // prevent default submit
    form.onclick = x => false

    form.appendChild(btn)
    form.appendChild(emailInput)
    form.appendChild(passwordInput)

    return form
  }

  const login = function(state, sdk, getUserToken) {
    return (email, password) => {
      return el => {
        // return [state, sdk, email, password, el]
        return sdk.loginUser(email.value, password.value).then(getUserToken(state))
      }
    }
  }

  const getUserToken = function(state) {
    return res => {
      state.userToken = res.user.token
      return state
    }
  }

  const state = {
    userToken: null
  }

  const mainDiv = document.getElementById('main')

  mainDiv.appendChild(createLogin(document, login(state, yebo, getUserToken)))
})()
