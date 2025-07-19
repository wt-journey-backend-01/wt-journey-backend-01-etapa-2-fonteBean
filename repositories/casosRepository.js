
function findAll() {
    return casos
}

function findById(id) {
  try{
    casos.forEach(caso => {
      if (caso["id"] == id){
        return caso;
      }
    });
  }catch(error){

  }
}

module.exports = {
    findAll

}
