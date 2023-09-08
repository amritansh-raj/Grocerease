var myApp = angular.module("grocerease", ["ui.router"]);
var apiUrl = "https://10.21.83.43:8000/groceryapp/";

myApp.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/home");

  $stateProvider
    .state("home", {
      url: "/home",
      templateUrl: "index.html",
      controller: "indexController",
    })
    .state("register", {
      url: "/register",
      templateUrl: "/template/register.html",
      controller: "registerController",
    })
    .state("cart", {
      url: "/yourcart",
      templateUrl: "/template/cart.html",
      controller: "cartController",
    })
    .state("manager", {
      url: "/manager",
      templateUrl: "template/manager.html",
      controller: "managerController",
    })
    .state("productPage", {
      url: "/products",
      templateUrl: "template/products.html",
      controller: "productController",
    });
});

myApp.controller("indexController", [
  "$scope",
  "$http",
  "$state",
  "$window",
  function ($scope, $http, $state, $window) {
    $scope.userLoggedIn = false;

    $http({
      method: "GET",
      url: apiUrl + "homeproduct/",
      withCredentials: true,
    })
      .then(function (response) {
        products = response.data;

        if (products) {
          $scope.products = products;
        }

        console.log($scope.products);
      })
      .catch(function (error) {
        console.log(error);
      });

    $scope.selectedProduct = {};
    $scope.selectedProductQuantity = 1;

    $scope.updateTotalPrice = function (selectedProductQuantity) {
      console.log(selectedProductQuantity);
      $scope.totalPrice =
        $scope.selectedProduct.Price * selectedProductQuantity; 
      console.log($scope.totalPrice)
    };

    $scope.openProductModal = function (index, selectedProduct) {
      $("#productModal" + index).modal("show");
      $scope.totalPrice = selectedProduct.Price;
      $scope.selectedProduct = selectedProduct;
    };

    $scope.buyProduct = function (selectedProduct, selectedProductQuantity) {
      $http({
        method: "POST",
        url: apiUrl + "buyitem/",
        withCredentials: true,
        data: {
          productid: selectedProduct.id,
          buy_quantity: selectedProductQuantity,

        },
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.closeProductModal = function (index) {
      console.log("kjad");
      $("#productModal" + index).modal("hide");
    };

    $scope.addtocart = function (product) {
      $http({
        method: "POST",
        url: apiUrl + "addtocart/",
        withCredentials: true,
        data: { productid: product.id },
      })
        .then(function (response) {
          console.log(response);
          $window.alert(response.data.message);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.submitLoginForm = function () {
      var userLogin = {
        username: $scope.loginData.username,
        password: $scope.loginData.password,
      };

      console.log(userLogin);

      $scope.loginData = {};

      $http({
        method: "POST",
        url: apiUrl + "login/",
        data: userLogin,
        withCredentials: true,
      })
        .then(function (response) {
          console.log(response);

          $scope.userLoggedIn = true;

          var superuser = response.data.superuser;

          if (superuser) {
            $state.go("manager");
          } else {
            console.log("home");
            $(".modal-backdrop").remove();
            // $('#exampleModal').on('shown.bs.modal', function () {
            //   $('#exampleModal').modal('hide');
            // });
            $state.go("home");
          }
        })
        .catch(function (error) {
          if (error.data && error.data.message) {
            $window.alert(error.data.message);
          } else {
            $window.alert("An error occured. Please try again");
          }
        });
    };

    $scope.logout = function () {
      $scope.userLoggedIn = false;

      $http({
        method: "GET",
        url: apiUrl + "logout/",
        withCredentials: true,
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      $state.go("Home");
    };
  },
]);

myApp.controller("registerController", [
  "$scope",
  "$http",
  "$state",
  "$window",
  function ($scope, $http, $state, $window) {
    $scope.formData = {};

    $scope.submitForm = function () {
      var pass = $scope.formData.pass;
      var confirmPass = $scope.formData.cnfrmPass;

      var userData = {
        firstname: $scope.formData.fName,
        lastname: $scope.formData.lName,
        email: $scope.formData.email,
        username: $scope.formData.username,
        password: $scope.formData.pass,
        confirmPassword: $scope.formData.cnfrmPass,
      };

      console.log(userData);

      if (pass === confirmPass) {
        $scope.formData = {};

        $http({
          method: "POST",
          url: apiUrl + "register/",
          data: userData,
        })
          .then(function (response) {
            var register = response.data;
            console.log(register);
            $state.go("login");
          })
          .catch(function (error) {
            if (error.data && error.data.message) {
              $window.alert(error.data.message);
            } else {
              $window.alert("An error occured. Please try again");
            }
          });
      } else {
      }
    };
  },
]);

myApp.controller("managerController", [
  "$scope",
  "$http",
  "$state",
  "$rootScope",
  function ($scope, $http, $state, $rootScope) {
    $scope.categories = [];

    function display() {
      $http({
        method: "GET",
        url: apiUrl + "product/",
        withCredentials: true,
      })
        .then(function (response) {
          console.log(response);
          var categories = response.data;

          if (categories) {
            $scope.categories = categories;
          }

          console.log($scope.categories);
        })
        .catch(function (error) {
          if (error.data && error.data.message) {
            // $window.alert(error.data.message);
          } else {
            // $window.alert("An error occurred. Please try again");
          }
        });
    }

    display();

    $scope.showProducts = function (category) {
      $rootScope.categoryProductId = category.id;

      $http({
        method: "GET",
        url: apiUrl + "addproduct/",
        withCredentials: true,
        params: { categoryid: category.id },
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.logout = function () {
      $http({
        method: "GET",
        url: apiUrl + "logout/",
        withCredentials: true,
      })
        .then(function (response) {
          console.log("Logout response:", response);
          $scope.userLoggedIn = false;
          $state.go("home");
        })
        .catch(function (error) {
          console.log("Logout error:", error);
        });
    };

    $scope.addCategory = function () {
      var categoryName = $scope.sectionName;
      var categoryImage = document.getElementById("sectionImage").files[0];

      var formData = new FormData();
      formData.append("category_name", categoryName);
      formData.append("catog_image", categoryImage);

      console.log(formData);

      $http({
        method: "POST",
        url: apiUrl + "product/",
        withCredentials: true,
        data: formData,
        headers: { "Content-Type": undefined },
      })
        .then(function (response) {
          console.log(response);
          display();
          if (response.data.authenticate_id) {
            // console.log("User is authenticated");
          } else {
            // console.log("User is not authenticated");
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    $scope.delCategory = function (category) {
      console.log("delete clicked");

      $http({
        method: "DELETE",
        url: apiUrl + "product/",
        withCredentials: true,
        data: { categoryid: category.id },
      })
        .then(function (response) {
          console.log("deleted");
          display();
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.editCategory = function (category) {
      if ($scope.editingCategory) {
        $scope.cancelEdit($scope.editingCategory);
      }

      category.editMode = true;
      $scope.editingCategory = category;
      category.updateName = category.Category_name;
      category.updateImage = category.catog_image;
    };

    $scope.cancelEdit = function (category) {
      category.editMode = false;
      category.updateName = category.Category_name;
      category.updateImage = category.catog_image;
    };

    $scope.saveEdit = function (category) {
      if (category.updateName) {
        category.category_name = category.updateName;
        category.category_image = category.updateImage;
      }

      var testImage = document.getElementById("updatedImage").files[0];

      var formData = new FormData();
      formData.append("edt_category_name", category.updateName);
      formData.append("edt_catog_image", testImage);
      formData.append("categoryid", category.id);

      console.log(formData);

      $http({
        method: "POST",
        url: apiUrl + "edtcategory/",
        withCredentials: true,
        data: formData,
        headers: { "Content-Type": undefined },
      })
        .then(function (response) {
          console.log(response);
          display();
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  },
]);

myApp.controller("productController", [
  "$scope",
  "$http",
  "$state",
  "$rootScope",
  "$stateParams",
  function ($scope, $http, $state, $rootScope, $stateParams) {
    $scope.openModal = function () {
      $("#productModal").modal("show");
    };

    $scope.closeModal = function () {
      $("#productModal").modal("hide");
    };

    function display() {
      category_ID = $rootScope.categoryProductId;

      $http({
        method: "GET",
        url: apiUrl + "addproduct/",
        withCredentials: true,
        params: { categoryid: category_ID },
      })
        .then(function (response) {
          products = response.data;

          if (products) {
            $scope.products = products;
          }

          console.log($scope.products);
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    display();

    $scope.addProduct = function (category) {
      var productImage = document.getElementById("productImage").files[0];
      var productData = new FormData();

      productData.append("categoryid", $rootScope.categoryProductId);
      productData.append("product_name", $scope.product.name);
      productData.append("description", $scope.product.description);
      productData.append("price", $scope.product.price);
      productData.append("quantity", $scope.product.quantity);
      productData.append("unit", $scope.product.unit);
      productData.append("image", productImage);

      console.log(productData);

      $http({
        method: "POST",
        url: apiUrl + "addproduct/",
        withCredentials: true,
        data: productData,
        headers: { "Content-Type": undefined },
      })
        .then(function (response) {
          console.log(response);
          display();
        })
        .catch(function (error) {
          console.error(error);
        });

      $scope.product = {};
    };

    $scope.editProduct = function (product) {
      if ($scope.editingProduct) {
        $scope.cancelEdit($scope.editingProduct);
      }

      product.editMode = true;
      $scope.editingProduct = product;
      $scope.editingProduct.updateName = product.Product_name;
      $scope.editingProduct.updateImage = product.Image;
      $scope.editingProduct.updateDescription = product.Description;
      $scope.editingProduct.updatePrice = product.Price;
      $scope.editingProduct.updateQuantity = product.Quantity;
      $scope.editingProduct.updateUnit = product.Unit;
    };

    $scope.cancelEdit = function (editingProduct) {
      editingProduct.editMode = false;

      $scope.editingProduct = editingProduct;
      $scope.editingProduct.updateName = editingProduct.Product_name;
      $scope.editingProduct.updateImage = editingProduct.Image;
      $scope.editingProduct.updateDescription = editingProduct.Description;
      $scope.editingProduct.updatePrice = editingProduct.Price;
      $scope.editingProduct.updateQuantity = editingProduct.Quantity;
      $scope.editingProduct.updateUnit = editingProduct.Unit;
    };

    $scope.saveEdit = function (product, index) {
      console.log(index);

      if (product.updateName) {
        product.product_name = product.updateName;
        product.image = product.updateImage;
        product.description = product.updateDescription;
        product.price = product.updatePrice;
        product.product_quantity = product.updateQuantity;
        product.unit = product.updateUnit;
        product.product_manufacture_date = product.updateMfgDate;
        product.product_expiry_date = product.updateExpDate;
      }

      console.log("productImage" + index);

      var testImage = document.getElementById("productImage" + index).files[0];

      var updatedProductData = new FormData();
      updatedProductData.append("edt_product_name", product.updateName);
      updatedProductData.append("edt_product_image", testImage);
      updatedProductData.append(
        "edt_product_description",
        product.updateDescription
      );
      updatedProductData.append("edt_product_price", product.updatePrice);
      updatedProductData.append("edt_product_quantity", product.updateQuantity);
      updatedProductData.append("edt_product_unit", product.updateUnit);
      updatedProductData.append("productid", product.id);

      console.log(updatedProductData);

      $http({
        method: "POST",
        url: apiUrl + "edtproduct/",
        withCredentials: true,
        data: updatedProductData,
        headers: { "Content-Type": undefined },
      })
        .then(function (response) {
          console.log(response);
          display();
        })
        .catch(function (error) {
          console.log(error);
        });

      console.log("save product completed");
    };

    $scope.delProduct = function (product) {
      $http({
        method: "DELETE",
        url: apiUrl + "addproduct/",
        withCredentials: true,
        data: { productid: product.id },
      })
        .then(function (response) {
          console.log("deleted");
          display();
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  },
]);

myApp.controller("cartController", [
  "$scope",
  "$http",
  "$state",
  function ($scope, $http, $state) {
    $scope.cartItems = [];
    $scope.totalPrice = 0;

    $scope.cartItems.forEach(function (cartItem) {
      cartItem.quantity = 1;
    });

    function display() {
      $http({
        method: "GET",
        url: apiUrl + "addtocart/",
        withCredentials: true,
      })
        .then(function (response) {
          var cartItems = response.data;

          if (cartItems) {
            $scope.cartItems = cartItems;

            $scope.totalItem = cartItems.length;
            console.log($scope.totalItem);

            if (userId) var userId = cartItems[0].User_id;

            $scope.totalPrice = cartItems.reduce(function (total, item) {
              return total + item.Product__Price;
            }, 0);
          }

          if (userId) {
            $scope.userId = userId;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    display();

    $scope.updateQuantity = function (cartItem) {
      changeQuantity(cartItem);
      updateTotalPrice();
    };

    function changeQuantity(cartItem) {
      $http({
        method: "PUT",
        url: apiUrl + "edtaddtocart/",
        withCredentials: true,
        data: {
          edit_cart: cartItem.Add_to_cart_no,
          productId: cartItem.Product__id,
        },
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    function updateTotalPrice() {
      $scope.totalPrice = $scope.cartItems.reduce(function (total, item) {
        return total + item.Product__Price * item.Add_to_cart_no;
      }, 0);
      console.log($scope.totalPrice);
    }

    $scope.removefromcart = function (cartItem) {
      $http({
        method: "DELETE",
        url: apiUrl + "addtocart/",
        withCredentials: true,
        data: { productid: cartItem.Product__id },
      })
        .then(function (response) {
          console.log(response);
          display();
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.placeOrder = function (userId, totalPrice) {
      $http({
        method: "POST",
        url: apiUrl + "buy_cart/",
        withCredentials: true,
        data: {
          customerId: userId,
          totalPrice: totalPrice,
        },
      })
        .then(function (response) {
          console.log(response);
          display();
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  },
]);
