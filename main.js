/* yebo: YeboSdk */
/* createElement: document */
/* getElementById: document */
const storeName = 'demo'

// Set Store Name
yebo.set('store', storeName)

const state = {
  token: null,
  number: null,
  userToken: null,
}

// ===============
// ===============
const addCartEvent = (el) => {
  const variantId = el.currentTarget.getAttribute("variantId")
  yebo.addCartItems(state.token, state.number, false, true, state.userToken, variantId, 1).then(res => {

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


