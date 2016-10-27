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
const addCartEvent = (state, setState) => {
  return variantId => {
    yebo.addCartItems(state.orderToken, state.orderNumber, false, true, state.userToken, variantId, 1)
      .then(setState)
      .then(getAuthToken)
      .then(listPayments)
  }
}

const setState = (newState) => {
  if (newState.order != undefined) {
    state.orderToken = newState.order.token
    state.orderNumber = newState.order.number
  } else {
    state.userToken = newState.user.token
  }
  return state
}

const getAuthToken = (state) => {
  return yebo.executeRequest(yebo.buildAuthentication()).then(res => {
    state.authToken = res.token
    yebo.set('auth', state.authToken)
    return state
  })
}

const listPayments = (state) => {
  debugger
  yebo.getOrderPayments(state.orderNumber, state.userToken, false).then(res => {
    debugger
  })
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

yebo.getProducts({})
  .then(prop("products"))
  .then(xs => xs.map(newProductEl(document, clickEvent(addCartEvent(state, setState)))))
  .then(xs => xs.map(x => mainDiv.appendChild(x)))
/* --------------- Inpure --------------- */


