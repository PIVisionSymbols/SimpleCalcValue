(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = { 
		typeName: "simplecalcvalue",
		displayName: 'TESTING !! Simple Calc Value',
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		getDefaultConfig: function(){ 
			return { 
				DataShape: 'Table',
				CalculationText: '',
				UOM: '',
				Height: 150,
				Width: 150 
			} 
		},
		configOptions: function(){
			return[
				{
					title: "Format Symbol",
					mode: "format"
					
				}
			];
		}
	}

	symbolVis.prototype.init = function(scope, elem) {
		this.onDataUpdate = dataUpdate;

		function dataUpdate(data) {
			var thecalc =scope.config.CalculationText;
			
            if (data) {

                thecalc=thecalc.replace(/[a-w]/gi,''); //Remove all characters not used for variables, important to avoid injection of unintended or malicious javascript code

               //console.log(scope.symbol.DataSources);
                //loop through the Calculation Expression and replace the variables with the correct js code
                //Currently only 3 variables (x, y, and z) for 3 data sources are supported
                if (thecalc.length>0){
                    for (var j=0;j<data.Rows.length && j<=3;j++){
                        var re = new RegExp(String.fromCharCode(120+j),"g")

                        thecalc = thecalc.replace(re,"Number(data.Rows["+ j +"].Value.replace(/,/g, ''))");
                    }
                
                    //var thecalc = scope.config.CalculationText.replace(/x/g,"Number(data.Rows[0].Value)");
                   
                    scope.symValue = eval(thecalc); //data.Value;
                    
                }else{
                    scope.symValue = data.Rows[0].Value;
				}
			

				// Metadata received on first update, periodically afterward
				if (data.Rows[0].Label) {
					var cleanSources=[];
					var item;
					for (j=0;j<scope.symbol.DataSources.length && j<3;j++){
						item=scope.symbol.DataSources[j];
						item = item.substr(item.lastIndexOf('\\') + 1) || item;  
						item = item.substr(0, item.indexOf('?')) || item;  
						cleanSources.push({Var: String.fromCharCode(120+j),Source: item}); 

				}
				//console.log(cleanSources);
				scope.config.DataSources=cleanSources;
				}
			}
		}
	};

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
