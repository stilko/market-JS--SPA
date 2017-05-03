function startApp() {
    sessionStorage.clear()
showHideMenu()
    showView(`viewAppHome`)
function showHideMenu() {
    if(sessionStorage.getItem(`authToken`)== null) {
        $(`#linkMenuAppHome`).show()
        $(`#linkMenuLogin`).show()
        $(`#linkMenuRegister`).show()
        $(`#linkMenuLogout`).hide()
        $(`#linkMenuCart`).hide()
        $(`#linkMenuUserHome`).hide()
        $(`#linkMenuShop`).hide()
        $(`#spanMenuLoggedInUser`).hide()
    }
    else {
        $(`#linkMenuAppHome`).hide()
        $(`#linkMenuLogin`).hide()
        $(`#linkMenuRegister`).hide()
        $(`#linkMenuLogout`).show()
        $(`#linkMenuCart`).show()
        $(`#linkMenuUserHome`).show()
        $(`#linkMenuShop`).show()
        $(`#spanMenuLoggedInUser`).show()
    }
}

        $(`#linkMenuAppHome`).click(appHome)
        $(`#linkMenuLogin`).click(login)
        $(`#linkMenuRegister`).click(register)
        $(`#linkMenuLogout`).click(logout)
        $(`#linkMenuUserHome`).click(userHome)
        $(`#linkMenuShop`).click(listProducts)
        $(`#linkUserHomeShop`).click(listProducts)
        $(`#linkUserHomeCart`).click(cardProducts)
        $(`#linkMenuCart`).click(cardProducts)



    $(`#formRegister`).submit(registerUser)
    $(`#formLogin`).submit(loginUser)
    function appHome() {
        showView(`viewAppHome`)
        showHideMenu()
    }
    function userHome() {
        showView(`viewUserHome`)
        showHideMenu()
    }
    function login() {
        showView(`viewLogin`)
        showHideMenu()
    }
    function register() {
        showView(`viewRegister`)
        showHideMenu()
    }

    function showView(form) {
        $(`main > section`).hide();
        $(`#${form}`).show();
    }

    const baseUrl = "https://baas.kinvey.com/";
    const appId = "kid_BJdQ5ZFVx";
    const appSecret = "54457e78e8554174a5b0380dfac42154";
    const basicAuthorization ={"Authorization": "Basic " + btoa(appId + ":" + appSecret)};

    function cardProducts() {
        let authorization ={"Authorization": "Kinvey " + sessionStorage.getItem(`authToken`)};
        $.ajax({
            method: "GET",
            url: baseUrl + "user/" + appId + "/" + sessionStorage.getItem(`userId`),
            headers: authorization,
            success:userCart,
            error:ajaxError
        })
    }
    function userCart(arr) {
        $(`#cartProducts tbody`).empty()
        var allText = [];
        $.each(arr.cart,function(i,obj){
            allText.push(obj);
        });
        for(let i= 0; i <allText.length;i++ ) {
            //console.log(allText[i].product)
            let tr = $(`<tr>`)
            let price = Number(allText[i].product.price) * Number(allText[i].quantity)
            tr.append($(`<td>`).text(allText[i].product.name))
            tr.append($(`<td>`).text(allText[i].product.description))
            tr.append($(`<td>`).text(allText[i].quantity))
            tr.append($(`<td>`).text(price.toFixed(2)))
                tr.append($(`<td>`).append($(`<button>Discard</button>`).click(removeProduct.bind(this,allText[i]))))
            $(`#cartProducts tbody`).append(tr)
        }
        showView(`viewCart`)
    }
   function removeProduct(arr) {
       let authorization = {"Authorization": "Kinvey " + sessionStorage.getItem(`authToken`)};
       $.ajax({
           method: "GET",
           url: baseUrl + "user/" + appId + "/" + sessionStorage.getItem(`userId`),
           headers: authorization,
           success: gosho,
           error: ajaxError
       })

       function gosho(prob) {
           $(`#cartProducts tbody`).empty()
           var allText = [];
           $.each(prob.cart, function (i, obj) {
               allText.push(obj);

               let rest = [];
               for (var key in prob.cart) {
                   if (arr.product.name != prob.cart[key].product.name) {
                       rest.push(key)
                       rest.push(prob.cart[key])
                   }
               }
               for (let i = 0; i < allText.length; i++) {
                   if (allText[i].product.name != arr.product.name) {
                       rest.push(allText[i])
                   }
               }
               let data = {
                   _id: prob._id,
                   username: prob.username,
                   name: prob.name,
                   _acl: {creator: prob._acl.creator},
                   _kmd: {
                       lmt: prob._kmd.lmt,
                       ect: prob._kmd.ect
                   }
                   //cart:sd
               }
           })
       }

   }
       function listProducts() {
           let authorization = {"Authorization": "Kinvey " + sessionStorage.getItem(`authToken`)};
           $.ajax({
               method: "GET",
               url: baseUrl + "appdata/" + appId + "/products",
               headers: authorization,
               success: list,
               error: ajaxError
           })
       }

       function list(arr) {
           $(`#shopProducts tbody`).empty()
           for (let product of arr) {
               let tr = $(`<tr>`)
               tr.append($(`<td>`).text(product.name))
               tr.append($(`<td>`).text(product.description))
               tr.append($(`<td>`).text(product.price.toFixed(2)))
               tr.append($(`<td>`).append($(`<button>Purchase</button>`)))
               $(`#shopProducts tbody`).append(tr)
           }
           showView(`viewShop`)
       }

       function registerUser(event) {
           event.preventDefault();
           let data = {
               username: $(`#formRegister input[name=username]`).val(),
               password: $(`#formRegister input[name=password]`).val(),
               name: $(`#formRegister input[name=name]`).val()
           }
           $.ajax({
               method: "POST",
               url: baseUrl + "user/" + appId,
               headers: basicAuthorization,
               data: data,
               success: registrtationSuccessful,
               error: ajaxError
           })
       }

       function registrtationSuccessful(reg) {
           showInfo(`User registration successful.`)
           sessionStorage.setItem(`authToken`, reg._kmd.authtoken)
           sessionStorage.setItem(`userId`, reg._id)
           showHideMenu()
           showView(`viewUserHome`)
           $(`#spanMenuLoggedInUser`).text(`Welcome, ${reg.username}`)
           $(`#viewUserHomeHeading`).text(`Welcome, ${reg.username}`)
       }

       function loginUser(event) {
           event.preventDefault();
           let data = {
               username: $(`#formLogin input[name=username]`).val(),
               password: $(`#formLogin input[name=password]`).val(),
           }
           $.ajax({
               method: "POST",
               url: baseUrl + "user/" + appId + "/login",
               headers: basicAuthorization,
               data: data,
               success: loginSuccessful,
               error: ajaxError
           })
       }

       function loginSuccessful(arr) {
           showInfo(`Login successful.`)
           sessionStorage.setItem(`authToken`, arr._kmd.authtoken)
           sessionStorage.setItem(`userId`, arr._id)
           showHideMenu()
           showView(`viewUserHome`)
           $(`#spanMenuLoggedInUser`).text(`Welcome, ${arr.username}`)
           $(`#viewUserHomeHeading`).text(`Welcome, ${arr.username}`)
       }

       function logout() {
           let authorization = {"Authorization": "Kinvey " + sessionStorage.getItem(`authToken`)};
           $.ajax({
               method: "POST",
               url: baseUrl + "user/" + appId + "/_logout",
               headers: authorization,
               success: logoutSuccessful,
               error: ajaxError
           })
       }

       function logoutSuccessful(arr) {
           showInfo(`Logout successful.`)
           sessionStorage.clear()
           showHideMenu()
           showView(`viewAppHome`)
       }

       function ajaxError(response) {
           let errorMsg = JSON.stringify(response);
           if (response.readyState === 0)
               errorMsg = "Cannot connect due to network error.";
           if (response.responseJSON &&
               response.responseJSON.description)
               errorMsg = response.responseJSON.description;
           showError(errorMsg);
       }

       function showError(errorMsg) {
           $('#errorBox').text("Error: " + errorMsg);
           $('#errorBox').show();
           setTimeout(function () {
               $('#errorBox').fadeOut();
           }, 3000);
       }

       function showInfo(message) {
           $('#infoBox').text(message);
           $('#infoBox').show();
           setTimeout(function () {
               $('#infoBox').fadeOut();
           }, 3000);
       }


       $(`#infoBox`).hide()
       $(`#loadingBox`).hide()
       $(`#errorBox`).hide()


}
