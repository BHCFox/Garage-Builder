const cars = [];

const form = document.getElementById(carForm);

form.addEventListener("submit", function (event) {
  const make = document.getElementById(make).value;
  const model = document.getElementById(model).value;
  const year = document.getElementById(year).value;

  const car = { make, model, year };

  cars.push(car);

  console.log(cars);
});
