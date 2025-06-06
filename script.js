let cars = [
  { id: 101, model: "Ford Mustang", brand: "Ford", year: 2021, licensePlate: "ABC-123", available: true },
  { id: 102, model: "Tesla Model S", brand: "Tesla", year: 2022, licensePlate: "XYZ-456", available: true },
  { id: 103, model: "Honda Civic", brand: "Honda", year: 2020, licensePlate: "HND-789", available: true },
  { id: 104, model: "Chevrolet Camaro", brand: "Chevrolet", year: 2021, licensePlate: "CHE-112", available: true },
  { id: 105, model: "BMW 3 Series", brand: "BMW", year: 2023, licensePlate: "BMW-334", available: true }
];

let customers = [];
let rentalFees = 50; // Fee per day in dollars

// Show available cars with Car ID
function showAvailableCars() {
  let content = `<h2>Available Cars for Rent</h2>`;
  const availableCars = cars.filter(car => car.available);

  if (availableCars.length === 0) {
    content += "<p>No cars available at the moment.</p>";
  } else {
    content += `
      <table>
        <tr><th>Car ID</th><th>Car Model</th><th>Brand</th><th>Year</th><th>License Plate</th></tr>
        ${availableCars.map(car => `
          <tr>
            <td>${car.id}</td>
            <td>${car.model}</td>
            <td>${car.brand}</td>
            <td>${car.year}</td>
            <td>${car.licensePlate}</td>
          </tr>
        `).join('')}
      </table>
    `;
  }

  document.getElementById("content").innerHTML = content;
}

// Rent car function with rental duration
function rentCar(e) {
  e.preventDefault();
  
  const name = document.getElementById("cname").value;
  const email = document.getElementById("cemail").value;
  const carId = parseInt(document.getElementById("carid").value);
  const rentalDays = parseInt(document.getElementById("rentalDays").value);
  const car = cars.find(c => c.id === carId);

  if (car && car.available) {
    const rentalFee = rentalDays * rentalFees;

    // Add customer to rental record
    customers.push({
      name, 
      email, 
      carModel: car.model, 
      carId: car.id, 
      licensePlate: car.licensePlate, 
      rentalDays,
      rentalFee,
      rentalDate: new Date(),
      returnDeadline: new Date(new Date().getTime() + (rentalDays * 24 * 60 * 60 * 1000))
    });

    // Mark car as unavailable
    car.available = false;
    alert(`Car rented successfully! Rental Fee: $${rentalFee}`);
    document.getElementById("content").innerHTML = "";
  } else {
    alert("Car is not available for rent.");
  }
}

// Return car function with overdue fee
function returnCar(carId) {
  const index = customers.findIndex(c => c.carId === carId);

  if (index !== -1) {
    const customer = customers[index];
    const overdueFee = calculateOverdueFee(customer);
    const totalFee = customer.rentalFee + overdueFee;

    // Mark car as available again
    const car = cars.find(c => c.id === customer.carId);
    car.available = true;

    customers.splice(index, 1);  // Remove the customer from rental list
    
    alert(`Car returned successfully! Total Fee (including overdue, if any): $${totalFee}`);
    displayCustomers();  // Refresh the rental records
  } else {
    alert("Car ID not found!");
  }
}

// Calculate overdue fee
function calculateOverdueFee(customer) {
  const currentDate = new Date();
  if (currentDate > customer.returnDeadline) {
    const overdueDays = Math.ceil((currentDate - customer.returnDeadline) / (24 * 60 * 60 * 1000));
    const overdueFee = overdueDays * 20;  // $20 per day
    return overdueFee;
  }
  return 0;
}

// Display customers who rented cars with rental fees and return deadline, including Car ID and Return Button
function displayCustomers() {
  let content = "<h2>Rental Records</h2>";
  if (customers.length === 0) {
    content += "<p>No rental records found.</p>";
  } else {
    content += `
      <table>
        <tr><th>Car ID</th><th>Name</th><th>Email</th><th>Car Model</th><th>Rental Fee</th><th>Rental Duration</th><th>Return Deadline</th><th>Action</th></tr>
        ${customers.map(c => `
          <tr>
            <td>${c.carId}</td>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.carModel}</td>
            <td>$${c.rentalFee}</td>
            <td>${c.rentalDays} days</td>
            <td>${c.returnDeadline.toLocaleDateString()}</td>
            <td><button onclick="returnCar(${c.carId})">Return</button></td>
          </tr>
        `).join('')}
      </table>
    `;
  }
  document.getElementById("content").innerHTML = content;
}

// Show Rent Car form
function showRentForm() {
  let content = `
    <h2>Rent Car</h2>
    <form onsubmit="rentCar(event)">
      <label>Customer Name: <input type="text" id="cname" required /></label><br>
      <label>Email: <input type="email" id="cemail" required /></label><br>
      <label>Car ID:
        <select id="carid" required>
          ${cars.filter(car => car.available).map(car => `<option value="${car.id}">${car.id} - ${car.model} (${car.brand}, ${car.year})</option>`).join("")}
        </select>
      </label><br>
      <label>Rental Duration (days): <input type="number" id="rentalDays" required min="1" /></label><br>
      <button type="submit">Rent</button>
    </form>
  `;
  document.getElementById("content").innerHTML = content;
}

// Show Return Car form (if needed)
function showReturnForm() {
  let content = `
    <h2>Return Car</h2>
    <form onsubmit="returnCar(event)">
      <label>Car ID: <input type="number" id="returnid" required /></label><br>
      <button type="submit">Return</button>
    </form>
  `;
  document.getElementById("content").innerHTML = content;
}
