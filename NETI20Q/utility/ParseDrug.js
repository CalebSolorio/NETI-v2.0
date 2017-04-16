
var ParseDrug = {
    getDrug(color, consistency, container, drugData){

     for (var drug in drugData){
        for(var ID in drugData[drug].appearances){
              if( drugData[drug].appearances[ID].color_id === color
                  && drugData[drug].appearances[ID].consistency_id === consistency
                  && drugData[drug].appearances[ID].container_id === container ){
                    return drugData[drug];
                  }
                }
            }
            return {
               name : "No drug found",
                description : "sorry"
            }
    }
};
module.exports = ParseDrug;


//method for iterating over JSON
//     for (var drug in this.state.drugData){
//        console.log(this.state.drugData[drug].name);
//        for(var ID in this.state.drugData[drug].appearances){
//            console.log(this.state.drugData[drug].appearances[ID].color_id)
//        }
//    }