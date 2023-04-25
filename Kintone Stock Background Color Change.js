(function(){
	'use strict';
	
	//handler function
	var changeStockFieldColor = function(params) {
		var element = params.element;
		var value = params.value;
		var backgroundColor;
		
		
		if (value <= 1){
			backgroundColor = '#FF6969';
		}else if(value < 10){
			backgroundColor = '#ffdb69';
		}else{
			backgroundColor = '#a0ff69';
		}
		
		
		if (backgroundColor){
			element.style.backgroundColor = backgroundColor;
		}
	}
	
	//detail page
	kintone.events.on('app.record.detail.show', function(event){
		var record = event.record;
		var stock = record.stock.value;
		var stockElement = kintone.app.record.getFieldElement('stock');
		
		changeStockFieldColor({element: stockElement, value: stock});
		
		return event;
	})
	
	
	//index page
	kintone.events.on('app.record.index.show', function(event) {
		var records = event.records;
		var stockElements = kintone.app.getFieldElements('stock');
		
		for (var i = 0; i < records.length; i++){
				var record = records[i];
				var stock = record.stock.value;
				var stockElement = stockElements[i];
				
				changeStockFieldColor({element: stockElement, value: stock})
				
		}
		
		return event;
	})
	
})();