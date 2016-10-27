/* global yebo document */

/* --------------- Pure --------------- */
const storeName = 'demo'
const prop = name => object => object[name]
const head = arr => arr[0]
/* --------------- Kinda --------------- */
const tail = arr => arr.slice(1);
const clickEvent = cb => el => cb(el.currentTarget.getAttribute("variantId"))
const map = cb => arr => arr.map(x => cb(x))
/* --------------- Pure --------------- */



/* --------------- Inpure --------------- */


// Event dispacher
const addCartEvent = (sdk, state, setState, getAuthToken, listPayments) => {
  return variantId => {
    sdk.addCartItems(state.orderToken, state.orderNumber, false, true, state.userToken, variantId, 1)
      .then(setState(state))
      .then(getAuthToken(sdk, setState))
      .then(listPayments(sdk))
  }
}

const setState = (state) => {
  return newState => {
    if (newState.order != undefined) {
      state.orderToken = newState.order.token
      state.orderNumber = newState.order.number
    } else {
      state.userToken = newState.user.token
    }
    return state
  }
}

const getAuthToken = (sdk, setState) => {
  return state => {
    return sdk.executeRequest(yebo.buildAuthentication()).then(res => {
      state.authToken = res.token
      sdk.set('auth', state.authToken)
      return state
    })
  }

}

const listPayments = (sdk) => {
  return state => {
    debugger
    return sdk.getOrderPayments(state.orderNumber, state.userToken, false).then(res => {
      debugger
    })
  }
}

// document
const mainDiv = document.getElementById('main')

// Set Store Name
yebo.set('store', storeName)

const state = {
  orderToken: null,
  orderNumber: null,
  userToken: null,
  authToken: null
}

// this should be the only inpure function
const newProductEl = (doc, clickEvent) => {
  return product => {
    const newElement = doc.createElement("div")
    const btn = doc.createElement("button")
    btn.innerText = product.name
    btn.setAttribute('variantId', head(product.variants_including_master_ids))
    btn.addEventListener("click", clickEvent)

    newElement.appendChild(btn)

    return newElement
  }
}

clickBehaviour = addCartEvent(yebo, state, setState, getAuthToken, listPayments)

yebo.getProducts({})
  .then(prop("products"))
  .then(xs => xs.map(newProductEl(document, clickEvent(clickBehaviour))))
  .then(xs => xs.map(x => mainDiv.appendChild(x)))
/* --------------- Inpure --------------- */


