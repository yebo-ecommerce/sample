(function(){
  /* global yebo document */

  /* --------------- Pure --------------- */
  const storeName = 'demo'
  const prop = name => object => object[name]
  const head = arr => arr[0]
  /* --------------- Kinda --------------- */
  const tail = arr => arr.slice(1);
  const map = cb => arr => arr.map(x => cb(x))
  /* --------------- Pure --------------- */

  /* --------------- Inpure --------------- */

  // Event dispacher
  const addCartEvent = function(state, sdk, resources) {
    return variantId => {
      return sdk.loginUser("teste@teste.com", "123123").then(resources['loginUser'](sdk)).then(state => {
        return sdk.addCartItems(state.orderToken, state.orderNumber, false, true, state.userToken, variantId, 1)
          .then(resources["processToken"](sdk, state))
          .then(resources["getAuthToken"](sdk))
          .then(resources["createAddress"](sdk))
          .then(resources["listOrderShipments"](sdk))
          .then(resources["setOrderShipment"](sdk))
          .then(resources["listOrderPayments"](sdk))
          .then(resources["pay"](sdk))
      })
    }
  }

  const loginUser = function(sdk) {
    return res => {
      state.userToken = res.user.token
      return state
    }
  }

  const processToken = function(sdk, state) {
    return res => {
      state.orderToken = res.order.token
      state.orderNumber = res.order.number
      return state
    }
  }

  const getAuthToken = function(sdk) {
    return state => {
      return sdk.executeRequest(yebo.buildAuthentication()).then(res => {
        state.authToken = res.token
        sdk.set('auth', state.authToken)
        return state
      })
    }
  }

  // Create element with state in the click action
  const createAddress = function(sdk) {
    return state => {
      const options = {
        user_token: state.userToken,
        firstname: "...",
        lastname: "...",
        address1: "...",
        address2: "...",
        city: "....",
        zipcode: "08773-000",
        phone: "...",
        state_name: null,
        alternative_phone: null,
        company: null,
        state_id: 26,
        country_id: 28
      }

      const kind = 'bill'
      const req = sdk.buildRequest('POST', `/checkout/${state.orderNumber}/address/create/${kind}`, options);
      return sdk.executeRequest(req).then(res => {
        return state
      })
    }
  }

  const listOrderShipments = function(sdk) {
    return state => {
      const req = sdk.buildRequest('GET', `/checkout/${state.orderNumber}/shipments`, { user_token: state.userToken });
      return sdk.executeRequest(req).then(res => {
        state.shipment = head(res.shipments)
        return state
      })
    }
  }

  const setOrderShipment = function(sdk) {
    return state => {
      const options = {
        user_token: state.userToken,
        package: prop("id")(state.shipment),
        rate: prop("id")(head(state.shipment.rates))
      }

      const req = sdk.buildRequest('POST', `/checkout/${state.orderNumber}/shipments/set`, options);
      return sdk.executeRequest(req).then(res => {
        return state
      })
    }
  }

  const listOrderPayments = function(sdk) {
    return state => {
      return sdk.getOrderPayments(state.orderNumber, state.userToken, false).then(res => {
        state.payment = head(res.payments.filter(x => x.id === 1))
        return state
      })
    }
  }

  const pay = function(sdk) {
    return state => {
      const options = {
        user_token: state.userToken,
        method_id: state.payment.id,
        source: {
          card_type: head(state.payment.extra.flags).slug,
          installments: "1",
          name: "teste teste",
          number: '1111222233334444',
          verification_value: "123",
          year: 2027,
          month: 7
        }
      };

      const req = sdk.buildRequest('POST', `/checkout/${state.orderNumber}/payments`, options);
      return sdk.executeRequest(req).then(console.log).catch(console.log)
    }
  }

  // document
  const mainDiv = document.getElementById('main')

  // Set Store Name
  yebo.set('store', storeName)
  // yebo.set('apiURL', 'lvh.me/api')
  // yebo.set('protocol', 'http')

  const state = {
    orderToken: null,
    orderNumber: null,
    userToken: null,
    authToken: null,
    payment: null,
    shipment: null
  }

  // this should be the only inpure function
  const newProductEl = function(doc, clickEvent) {
    return product => {
      const newElement = doc.createElement("div")
      const btn = doc.createElement("button")
      btn.innerText = product.name
      btn.addEventListener("click", clickEvent(head(product.variants_including_master_ids)))

      newElement.appendChild(btn)

      return newElement
    }
  }

  const clickEvent = cb => variantId => eventFired => cb(variantId)

  const clickBehaviour = addCartEvent(state, yebo, {
    'loginUser': loginUser,
    'processToken': processToken,
    'getAuthToken': getAuthToken,
    'createAddress': createAddress,
    'listOrderShipments': listOrderShipments,
    'setOrderShipment': setOrderShipment,
    'listOrderPayments': listOrderPayments,
    'pay': pay
  })

  yebo.getProducts({})
    .then(prop("products"))
    .then(xs => xs.map(newProductEl(document, clickEvent(clickBehaviour))))
    .then(xs => xs.map(x => mainDiv.appendChild(x)))
  /* --------------- Inpure --------------- */
})()


console.log("heloo again")

