const cars = []; // This is our main storage — an empty array to keep all cars the user adds

const form = document.getElementById("carForm"); // Grab the form element from the HTML using its id
const totalVehiclesEl = document.getElementById("total-vehicles-num");

function showError(message) {
  const errorEl = document.getElementById("error-msg");
  errorEl.textContent = message;
}

// User Input for Submit Button
form.addEventListener("submit", function (event) {
  //event is just parameter name
  event.preventDefault(); // Stops page refresh

  // Get the value typed into the "make" input field
  const make = document.getElementById("make").value;
  const model = document.getElementById("model").value;
  const year = document.getElementById("year").value;
  const category = document.getElementById("category").value;

  // Create a car object using the values collected above
  const car = { make, model, year, category };

  // Data Validaiton
  if (make === "") {
    showError("Please pick a make!");
    return;
  }

  if (model === "") {
    showError("Please pick a model!");
    return;
  }
  if (year === "") {
    showError("Please select a year!");
    return;
  }
  if (category === "") {
    showError("Please choose a category!");
    return;
  }

  const currentYear = new Date().getFullYear();
  if (year < 1960 || year > currentYear + 1) {
    showError("Please enter a valid year (1960–" + (currentYear + 1) + ")");
    return;
  }

  const isDuplicate = cars.some(function (c) {
    return (
      c.make.toLowerCase() === make.toLowerCase() &&
      c.model.toLowerCase() === model.toLowerCase() &&
      c.year == year
    );
  });

  if (isDuplicate) {
    showError("This car is already in your garage!");
    return;
  }

  // Add this new car object into our cars array (store it)
  cars.push(car);

  // Update the dashboard count from the array length
  totalVehiclesEl.textContent = cars.length;

  showError("");

  // Log the updated cars array to the console so we can see what's happening
  console.log(cars);

  form.reset();
});
