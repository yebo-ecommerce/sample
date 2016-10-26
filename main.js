/* yebo: YeboSdk */
/* createElement: document */
/* getElementById: document */
const storeName = 'demo'

// Set Store Name
yebo.set('store', storeName)

const state = {
  orderToken: null,
  orderNumber: null,
  userToken: null,
  authToken: null
}

// ===============
// ===============
const setState = (newState) => {
  if (newState.order != undefined) {
    state.orderToken = newState.order.token
    state.orderNumber = newState.order.number
  } else {
    state.userToken = newState.user.token
  }
  return state
}

const addCartEvent = (el) => {
  const variantId = el.currentTarget.getAttribute("variantId")

  yebo.addCartItems(state.orderToken, state.orderNumber, false, true, state.userToken, variantId, 1)
    .then(setState)
    .then(getAuthToken)
    .then(listPayments)
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

const newProductElement = (product) => {
  const newDiv = document.createElement("div")

  const btn = document.createElement("button")
  btn.innerText = product.name
  btn.setAttribute('variantId', product.variants_including_master_ids[0])
  btn.addEventListener("click", addCartEvent)

  newDiv.appendChild(btn)

  return newDiv
}

const createElement = (target) => {
  return (product) => {
    target.appendChild(newProductElement(product))
  }
}

const mainDiv = document.getElementById('main')

// Getting products
yebo.getProducts({})
  .then(res => res.products)
  .then(prods => prods.map(createElement(mainDiv)))


yebo.loginUser("teste@teste.com", "123123").then(setState)

// window.addEventListener('DOMContentLoaded', function() {
// })
