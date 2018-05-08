(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItems);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var CtrlNarrow = this;
      CtrlNarrow.msg = "";
      CtrlNarrow.found = [];

      CtrlNarrow.getMatchedMenuItems = function(searchTerm){
        MenuSearchService.getMatchedMenuItems(searchTerm)
        .then(function(result){
          CtrlNarrow.found = result;
          if (!CtrlNarrow.found.length) {
            CtrlNarrow.msg = "Nothing found";
          }
          else {
            CtrlNarrow.msg = "";
          }
        });
      };

      CtrlNarrow.RemoveItem = function(index){
        CtrlNarrow.found.splice(index, 1);
      };
    };

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http){
      var service = this;
      // getMatchedMenuItems
      service.getMatchedMenuItems = function(searchTerm){
        return $http({
          method: "GET",
          url: "https://davids-restaurant.herokuapp.com/menu_items.json"
        }).then(function (result) {
              var foundItems = [];
              var menu_items = result.data.menu_items;
              // process result and only keep items that match
              if(searchTerm && searchTerm.trim()){
                for (var i = 0; i < menu_items.length; i++) {
                  var desc = menu_items[i].description;
                  if (desc.indexOf(searchTerm) !== -1) {
                    foundItems.push(menu_items[i]);
                  }
                }
              }
              return foundItems;
        });
      };
    };

    function FoundItems(){
      var ddo = {
        scope: {
          dirRemoveItem: '&',
          items: '<'
        },
        templateUrl: 'foundItemsDirective.html'
      };
      return ddo;
    };
})();
