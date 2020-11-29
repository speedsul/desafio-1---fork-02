var keyboardBuffer = ""   // will contain the letters as the users types in
var resultList ; // will contain the result of the fetch to the API
var filteredList; 

function addPersonToList( person) {
  const wulist = document.createElement("ul")
  wulist.id = "listofpersons"
  const divResults = document.getElementById("foundlist")
  divResults.appendChild(wulist)  
  const wperson = document.createElement("li")
  const wpicture = document.createElement("img")
  wpicture.src = person.picture
  wpicture.className="picture"
  wperson.appendChild(wpicture)
  wperson.innerText = `${person.name}, ${person.age} yo`
  wperson.appendChild(wpicture)
  const wlist = document.getElementById("listofpersons")
  wlist.appendChild(wperson)
}

function clearList() {
  const wlist = document.getElementById("listofpersons")
  if (wlist) wlist.parentNode.removeChild(wlist);
}
 
function addToBuffer() {
  clearList()
  
  keyboardBuffer = document.getElementById("searchstring").value
  filteredList = resultList.filter((person)=>{
    wfilter = new (keyboardBuffer,'i')
    return wfilter.exec(person.name)
  })
  const totals = filteredList.reduce( 
    ( previous, current)=>{
      addPersonToList(current)
      let wret = {}
      wret.countMale = previous.countMale + (current.gender == "male")
      wret.countFemale = previous.countFemale + (current.gender == "female")
      wret.totalAge = previous.totalAge + current.age
      return wret
      }, { countMale:0, countFemale:0,totalAge:0} 
  )
  const wcountMales= document.getElementById("countmales")
  wcountMales.innerText = totals.countMale
  const wcountFemales = document.getElementById("countfemales")
  wcountFemales.innerText = totals.countFemale
  const wtotalAges = document.getElementById("totalages")
  wtotalAges.innerText = totals.totalAge
  const waverageAge = document.getElementById("averageage")
  waverageAge.innerText = (totals.totalAge / (totals.countFemale+totals.countMale) || 0 ).toFixed(2)

}

async function start() {
  // needed to make it work withou "CORS" blocking
  const myHeaders = new Headers();

  const myInit = { 
      mode: 'no-cors',
      };

  const myRequest = await new  Request(
    'https://randomuser.me/api/?results=100&nat=BR&inc=name,picture,dob,gender&noinfo')
     
    // myInit);


  const response = await fetch(myRequest);

  const fullResponseList = await response.json();
  // destructuring 
  //  // name (first + last), picture, dob.age e gender.
  // global variable is loaded with the data from the API
  resultList = fullResponseList.results.map( 
    (person)=> {
      let name, picture, age, gender ;

       ( {  name , picture, age, gender  } = { 
        name : `${person.name.first} ${person.name.last}`, 
        picture : person.picture.thumbnail, 
        age : person.dob.age, 
        gender : person.gender, 
        });

      return {  name , picture, age, gender  } 
    } )

}; // creates and immediatelly calls the function
start()

