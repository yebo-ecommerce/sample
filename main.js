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
  // orderNumber: "R368402021",
  // orderToken: "FL5vgmk4EwJ_el2b-iGFOQ",
  // userToken: "fcbb4866e5a77d00a7a2e060e651a99009168068be7b1b28"
}

// ===============
// ===============
const addCartEvent = (el) => {
  const variantId = el.currentTarget.getAttribute("variantId")

  yebo.addCartItems(state.orderToken, state.orderNumber, false, true, state.userToken, variantId, 1).then(res => {
    state.orderToken = res.order.token
    state.orderNumber = res.order.number
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


const getUser = (el) => {
  const user = document.getElementById('user').value
  const password = document.getElementById('password').value
  yebo.loginUser(user, password).then(res => {
    state.userToken = res.user.token
    const orderNumber = res.user.order.number
    if (orderNumber != null) {
      state.orderNumber = orderNumber
    }
    alert(user + ' Logado')
  }).catch(res => {
    yebo.registerUser(user, password, password).then(res => {
      state.userToken = res.user.token
      const orderNumber = res.user.order.number
      if (orderNumber != null) {
        state.orderNumber = orderNumber
      }
      alert(user + ' Criado com a senha ' + password)
    }).catch((res, err) => {
      alert("Usuario já existe")
    })
  })
}

window.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('createUser')
  container.addEventListener('click', getUser)
})
