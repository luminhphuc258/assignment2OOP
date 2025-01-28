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

  //create html content for user accounts
  async createUsersAccountTable(data) {
    if (data) {
      let html = '';

      if (!Array.isArray(data)) {
        data = [data];
      }

      data.forEach(usersinfo => {
        let roletext = '';
        if (usersinfo.role === '0') {
          roletext = 'Admin'
        } else {
          roletext = "Member"
        }
        html += `<tr>
                    <td>${usersinfo.username}</td>
                    <td>${usersinfo.lastname}</td>
                      <td>${usersinfo.firstname}</td>
                    <td>${usersinfo.password}</td>
                    <td>${roletext}</td>
                    <td><button class="btn_edit" userid="${usersinfo.userid}" role="${usersinfo.role}" lastname="${usersinfo.lastname}" firstname="${usersinfo.firstname}" password="${usersinfo.password}" ><i  class="fa fa-pencil-square-o" aria-hidden="true"></i></button></td>
                    <td><button class="btn_remove" userid="${usersinfo.userid}"><i  class="fa fa-times" aria-hidden="true"></i></button></td> 
                </tr>`;
      });

      return html;

    } else {
      let html = `<tr>
                    <td colspan='10' style='color:blue; font-weight:800;'>Data Not Found!</td>
                    </tr>`;
      return html;
    }
  }

}
module.exports = new ViewController();
