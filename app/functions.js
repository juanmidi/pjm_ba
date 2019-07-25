function ajustar(tam, num) {
  //rellena con 0 a la izquierda
  //
  if (num.toString().length <= tam-1) return ajustar(tam, "0" + num)
  else return num;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function format_fecha_d(fecha, fmt) {
  var fecha_f; 
  var f = new Date(fecha);
  
  if(fmt=="dd-mm-yyyy"){
    fecha_f = ajustar(2, (f.getDate())) + '-' + ajustar(2, (f.getMonth() + 1)) + '-' + f.getFullYear();
  }
  else{
    fecha_f = f.getFullYear() + '-' + ajustar(2, (f.getMonth() + 1)) + '-' + ajustar(2, (f.getDate()));
  }
  
  return fecha_f;
}


function format_fecha(fecha, fmt) {
  //la fecha de entrada es ISO (yyyy-mm-dd)
  if (fecha==undefined) return '';
  var fecha_f; 
  var res = fecha.split("-");
  if(fmt=="mm-dd-yyyy"){
    fecha_f = ajustar(2, res[1]) + '-' + ajustar(2, (res[2])) + '-' + res[0];
  }else{
    fecha_f = res[0] + '-' + ajustar(2, res[1]) + '-' + ajustar(2, (res[2]));
  }
  return fecha_f  
}

function fecha_en_texto(fecha) {
  var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
  var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
  var res = fecha.split("-");
  var fecha_f = res[1] + '-' + ajustar(2, res[2]) + '-' + ajustar(2, (res[0]));
  var f=new Date(fecha_f);
  return diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
}

function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};
     var pepe=["aaa","bbb"];

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
        
        // lookupObject[originalArray[i][prop]].profe = originalArray[i].user;
        
        // console.log("pijo")
        // console.log(originalArray[i])
      }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
 }

//  function contarIguales(array, findValue) {
//    var count = 0;
//    for (var i = 0; i < array.length; ++i) {
//     console.log( findValue)
//       if (array[i] === findValue)
//       console.log("sipi")
//         count++;
//       }
//    return count;
//  }

// function compressArray(original) {

//   var compressed = [];
//   // make a copy of the input array
//   var copy = original.slice(0);

//   // first loop goes over every element
//   for (var i = 0; i < original.length; i++) {

//     var myCount = 0;
//     // loop over every element in the copy and see if it's the same
//     for (var w = 0; w < copy.length; w++) {
//       if (original[i] == copy[w]) {
//         // increase amount of times duplicate is found
//         myCount++;
//         // sets item to undefined
//         delete copy[w];
//       }
//     }

//     if (myCount > 0) {
//       var a = {};
//       a.value = original[i];
//       a.count = myCount;
//       //para que detecto los votos duplicados > que 1
//       if (a.value != '0' || a.value != '1') {
//         console.log("a")
//         console.log(a)
//         if(a.count > 1){
//           compressed.push(a);
//         }
//       }
//     }
//   }

//   return compressed;
// };


function marcarEmpates(o) {
//procedimiento que agrega al objeto propiedades que identifican los
//empates
//empate: true      si hay empate (para que se active el color desde ng-class)
//grupoempate: 1    identificando con un número de grupo a los que tienen que desempatar  

  var tmp;
  var grupo = 0;

  //crea un array para comparar
  var copy = o.map(function (original) {
    return original.votos;
  })

  //levanta cada item para realizar la comparación con el array de los mismos datos
  for (var x in o) {
    count = 0;

    for (var w = 0; w < copy.length; w++) {
      if (o[x].votos === copy[w] && o[x].votos !=='0') {
        count++;
        if (count > 1) {
          o[x].empate = true;

          if (o[x].votos !== tmp) {
            grupo++;
            tmp = o[x].votos;
          }

          o[x].grupoempate = grupo;

        } else {
          o[x].empate = false;
          o[x].grupoempate = undefined;
        }
      }
    }
  }
}