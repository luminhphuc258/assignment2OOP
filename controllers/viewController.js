class ViewController {
  constructor() {
  }

  //create dynamic view contents for ejs temaple
  async createSearchResultTable(data) {
    if (data) {
      let html = '';

      if (!Array.isArray(data)) {
        data = [data];
      }

      data.forEach(booking => {
        html += `<tr>
                    <td>${booking.booking_id}</td>
                    <td>${booking.firstName} ${booking.lastName}</td>
                    <td>${booking.email}</td>
                    <td>${booking.phone}</td>
                    <td>${booking.numberOfGuests}</td>
                    <td>${booking.date}</td>
                    <td>${booking.time}</td>
                    <td>${booking.tableType}</td>
                    <td>${booking.specialRequests}</td>
                    <td>${booking.status}</td>
                </tr>`;
      });

      return html;

    } else {
      let html = `<tr>
                    <td colspan='10' style='color:blue; font-weight:800;'>No reservations found matching your search criteria.</td>
                    </tr>`;
      return html;
    }
  }

}
module.exports = new ViewController();
