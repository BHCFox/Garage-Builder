const form = document.getElementById("carForm");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Stops form from refreshing the page

  const make = document.getElementById("make").value;
  const model = document.getElementById("model").value;
  const year = document.getElementById("year").value;

  const car = { make, model, year }; // put all the values into car variable

  cars.push(car);

  console.log(cars);
});

const cars = []; //creates the storage for new inputs
