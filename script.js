var postApi =
  "https://69829d159c3efeb892a2c764.mockapi.io/sinhvien/v1/SinhVien";

fetch(postApi)
  //case lấy postApi thành công
  .then(function (response) {
    //nhờ có fetch : response.json() nhận json postApi của promise chuyển đổi dữ liệu từ json -> js
    // là 1 array gồm nhiều bản ghi về post( bài viết)
    return response.json();
  })
  .then(function (posts) {
    console.log(posts);

    let tableHtml = `
    <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
      <table class="w-full text-sm text-left rtl:text-right text-body">
        <thead class="text-sm text-body bg-neutral-secondary-medium border-b border-t border-default-medium">
          <tr>
            <th scope="col" class="px-6 py-3 font-medium">ID</th>
            <th scope="col" class="px-6 py-3 font-medium">Avatar</th>
            <th scope="col" class="px-6 py-3 font-medium">Tên</th>
            <th scope="col" class="px-6 py-3 font-medium">Hành động</th>
          </tr>
        </thead>
        <tbody>
    `;

    posts.forEach((post) => {
      tableHtml += `
          <tr class="bg-neutral-primary-soft hover:bg-neutral-secondary-medium border-b border-default">
            <td class="px-6 py-4 font-medium">${post.id}</td>
            <td class="px-6 py-4">
              <img class="w-10 h-10 rounded-full" src="${post.avatar}" alt="Avatar" />
            </td>
            <td class="px-6 py-4 font-medium text-heading">${post.name}</td>
            <td class="px-6 py-4 space-x-3">
              <a href="#" onclick="openEditForm(${post.id}, '${post.name}', '${post.avatar}'); return false;" class="text-blue-600 hover:underline" title="Chỉnh sửa">
                <i class="fa-solid fa-user-pen"></i>
              </a>
              <a href="#" onclick="deleteUserById(${post.id}); return false;" class="text-red-700 hover:underline" title="Xóa">
                <i class="fa-solid fa-trash-can"></i>
              </a>
            </td>
          </tr>
      `;
    });

    tableHtml += `
        </tbody>
      </table>
    </div>
    `;

    document.getElementById("postBlock").innerHTML = tableHtml;
  })
  //case lấy postApi thất bại
  .catch(function (err) {
    console.log(err);
  });

//Hàm xóa dựa vào ID
function deleteUserById(id) {
  const deleteApi = postApi + "/" + id;

  fetch(deleteApi, {
    method: "DELETE",
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Xóa thành công");
        // Tải lại danh sách sau khi xóa
        location.reload();
      } else {
        console.log("Lỗi xóa");
      }
    })
    .catch(function (err) {
      console.log("Lỗi:", err);
    });
}

//Hàm mở form thêm sinh viên
function openAddForm() {
  const formHtml = `
    <div id="addFormModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-96">
        <h2 class="text-2xl font-bold mb-6">Thêm sinh viên mới</h2>
        <form id="addStudentForm">
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Tên sinh viên</label>
            <input type="text" id="studentName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Nhập tên" required>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Avatar URL</label>
            <input type="text" id="studentAvatar" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Nhập đường dẫn avatar">
          </div>
          <div class="flex gap-4">
            <button type="submit" class="flex-1 bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600">Thêm</button>
            <button type="button" onclick="closeAddForm()" class="flex-1 bg-gray-400 text-white font-medium py-2 rounded-lg hover:bg-gray-500">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", formHtml);

  document
    .getElementById("addStudentForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      addStudent();
    });
}

//Hàm đóng form
function closeAddForm() {
  const modal = document.getElementById("addFormModal");
  if (modal) {
    modal.remove();
  }
}

//Hàm thêm sinh viên
function addStudent() {
  const name = document.getElementById("studentName").value;
  const avatar = document.getElementById("studentAvatar").value;

  if (!name.trim()) {
    alert("Vui lòng nhập tên sinh viên");
    return;
  }

  const newStudent = {
    name: name,
    avatar: avatar || "https://via.placeholder.com/150",
  };

  fetch(postApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newStudent),
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Thêm sinh viên thành công");
        closeAddForm();
        location.reload();
      } else {
        console.log("Lỗi thêm sinh viên");
      }
    })
    .catch(function (err) {
      console.log("Lỗi:", err);
    });
}

//Hàm mở form chỉnh sửa sinh viên
function openEditForm(id, name, avatar) {
  const formHtml = `
    <div id="editFormModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-96">
        <h2 class="text-2xl font-bold mb-6">Chỉnh sửa sinh viên</h2>
        <form id="editStudentForm">
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Tên sinh viên</label>
            <input type="text" id="editStudentName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Nhập tên" value="${name}" required>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Avatar URL</label>
            <input type="text" id="editStudentAvatar" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Nhập đường dẫn avatar" value="${avatar}">
          </div>
          <div class="flex gap-4">
            <button type="submit" class="flex-1 bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600">Lưu</button>
            <button type="button" onclick="closeEditForm()" class="flex-1 bg-gray-400 text-white font-medium py-2 rounded-lg hover:bg-gray-500">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", formHtml);

  document
    .getElementById("editStudentForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      updateStudent(id);
    });
}

//Hàm đóng form chỉnh sửa
function closeEditForm() {
  const modal = document.getElementById("editFormModal");
  if (modal) {
    modal.remove();
  }
}

//Hàm cập nhật sinh viên
function updateStudent(id) {
  const name = document.getElementById("editStudentName").value;
  const avatar = document.getElementById("editStudentAvatar").value;

  if (!name.trim()) {
    alert("Vui lòng nhập tên sinh viên");
    return;
  }

  const updateApi = postApi + "/" + id;
  const updatedStudent = {
    name: name,
    avatar: avatar,
  };

  fetch(updateApi, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedStudent),
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Cập nhật sinh viên thành công");
        closeEditForm();
        location.reload();
      } else {
        console.log("Lỗi cập nhật sinh viên");
      }
    })
    .catch(function (err) {
      console.log("Lỗi:", err);
    });
}
//hello
