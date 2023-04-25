(function() {
	'use strict';
	
	var handler = function(event){
		console.log('event:', event);
        
        //initial variables
        var itemsID = 7;
		var record = event.record;
		var itemCode = record.item_code.value;
        var orderType = record.order_type.value;
        var orderQuantity = record.quantity.value;
        
        
        //function to update the stock value of an ithem the Items app, identified by the item code value within an Orders app record
        function updateStock(itemCode){
            var body = {'app': itemsID, 'id': itemCode};

                //api GET request to find the current stock quantity value of the item
              kintone.api(kintone.api.url('/k/v1/record', true), 'GET', body, function(resp) {
                var record = resp.record;
                var currentStock = record.stock.value;
                
                //if/else statement to either add (purchase) or subtract (sale) the item quantity of an order from the item stock
                if ((currentStock - orderQuantity) < 0 && orderType === 'Sale'){
                    window.alert('Error: Inadequate stock to fulfill order. Please delete this order record and try again with fewer ordered items.')       //Error statement for orders with higher wuantity than current stock
                }else if ((currentStock - orderQuantity) >= 0 && orderType === 'Sale'){
                    updatedStock = Number(currentStock) - Number(orderQuantity);
                }else if (orderType === 'Purchase'){
                    updatedStock = Number(currentStock) + Number(orderQuantity);
                }else{
                    window.alert('if statement error');
                }

                //api PUT request to replace the current stock value with the updated stock value
                return kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', {
                    app: itemsID,
                    updateKey: {
                        field: 'item_code',
                        value: itemCode
                    },
                    record: {
                        stock:{
                            value: updatedStock
                        }
                    }
                }).then(function(response){
                    window.alert('Success! Stock for item: ' + itemCode + 'has been updated to: ' + updatedStock)
                    console.log(response);
                    return event;
                }).catch(function(error){
                    console.log(error);
                    return event;
                })
              }, function(error) {
                window.alert('Error: There was an error getting the current stock quantity.');
              });
              
        }
        //calling on the updateStock function
        var updatedStock = updateStock(itemCode);
	};
    
    //event handler
	kintone.events.on([
		'app.record.create.submit'
	], handler);

})();