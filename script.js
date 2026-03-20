const cars = []; // This is our main storage — an empty array to keep all cars the user adds

const form = document.getElementById("carForm"); // Grab the form element from the HTML using its id

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

  if (category === "") {
    alert("Please select a Category");
    return;
  }

  if (make === "" || model === "") {
    alert("Please fill in all fields..");
    return;
  }

  // Add this new car object into our cars array (store it)
  cars.push(car);

  // Log the updated cars array to the console so we can see what's happening
  console.log(cars);

  form.reset();
});
