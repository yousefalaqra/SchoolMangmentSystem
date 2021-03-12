const $newStudentForm = document.getElementById("newStudentForm");
const $searchInput = document.getElementById("searchInput");
const $studentsList = document.getElementById("studentsList");
const $studentsCount = document.getElementById("studentsCount");

$newStudentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  utils.addStudent({
    name: this.nameInput.value,
    id: this.idInput.value,
    gpa: this.gpaInput.value,
  });

  this.nameInput.value = "";
  this.idInput.value = "";
  this.gpaInput.value = "";
  this.nameInput.focus();
});

$searchInput.addEventListener("input", function () {
  $studentsList.innerHTML = "";
  const searchValue = this.value.trim().toLowerCase();

  if (searchValue) {
    utils.loadStudents(
      students.filter(
        ({ name, id, gpa }) =>
          name.toLowerCase().includes(searchValue) ||
          id.toLowerCase().includes(searchValue) ||
          gpa.toString().includes(searchValue)
      )
    );
  } else {
    utils.loadStudents(students);
  }
});

function validateStudent(student, orginalId) {
  try {
    [
      /^[a-zA-Z ]{1,40}$/.test(student.name),
      /^\d{8}$/.test(student.id),
      orginalId === student.id
        ? true
        : students.every(({ id }) => id !== student.id),
      student.gpa >= 0,
      student.gpa <= 4,
    ].some((assertion) => {
      if (assertion === false) {
        throw new Error();
      }
    });
    return true;
  } catch {
    Swal.fire({
      icon: "error",
      title: "Student info is invalid",
    });
    return false;
  }
}

let students;

const utils = {
  loadStudents(students) {
    students.forEach(this.DOM.appendStudent);
    this.DOM.setStudentsCount(students.length);
  },
  addStudent(student) {
    student.gpa = Number(student.gpa);

    if (validateStudent(student)) {
      students.push(student);
      this.BOM.updateStorage();
      this.DOM.appendStudent(student);
      this.DOM.setStudentsCount(students.length);
    }
  },
  async removeStudent(id) {
    const response = await Swal.fire({
      title: "Sure want to delete this student?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "Nope",
    });

    if (response.isConfirmed) {
      students.splice(
        students.findIndex((student) => student.id === id),
        1
      );
      this.BOM.updateStorage();
      this.DOM.setStudentsCount(students.length);
      Swal.fire("Deleted", "", "success");
      return true;
    }
  },
  DOM: {
    appendStudent(student) {
      const $studentInfo = document.createElement("h4");
      $studentInfo.innerHTML = `${student.name}, <span class="text-secondary">${student.id}, ${student.gpa}</span>`;

      const $editStudentBtn = document.createElement("button");
      $editStudentBtn.setAttribute("class", "btn btn-sm btn-success mr-1");
      $editStudentBtn.setAttribute("data-action", "edit");
      $editStudentBtn.innerHTML = feather.icons["edit-2"].toSvg();
      $editStudentBtn.addEventListener("click", function () {
        const action = this.getAttribute("data-action");
        if (action === "edit") {
          utils.DOM.toEditMode($studentInfo, student);
          this.classList.remove("btn-success");
          this.classList.add("btn-info");
          this.setAttribute("data-action", "save");
          this.innerHTML = feather.icons["check"].toSvg();
        } else {
          const $studentInfoInput = document.getElementById(
            `studentInfoInput-${student.id}`
          );
          let [name, id, gpa] = $studentInfoInput.value.split(",");

          name = name.trim();
          id = id.trim();
          gpa = Number(gpa);

          if (validateStudent({ name, id, gpa }, student.id)) {
            student.name = name;
            student.id = id;
            student.gpa = gpa;
            utils.BOM.updateStorage();
            $studentInfo.innerHTML = `${name}, <span class="text-secondary">${id}, ${gpa}</span>`;
            this.classList.remove("btn-info");
            this.classList.add("btn-success");
            this.setAttribute("data-action", "edit");
            this.innerHTML = feather.icons["edit-2"].toSvg();
            $studentInfoInput.parentElement.replaceChild(
              $studentInfo,
              $studentInfoInput
            );
            Swal.fire({
              icon: "success",
              title: "Student info changed",
            });
          }
        }
      });

      const $deleteStudentBtn = document.createElement("button");
      $deleteStudentBtn.setAttribute("class", "btn btn-sm btn-danger");
      $deleteStudentBtn.addEventListener("click", async () => {
        if (await utils.removeStudent(student.id)) {
          $studentItem.remove();
        }
      });
      $deleteStudentBtn.innerHTML = feather.icons["trash"].toSvg();

      const $studentActionsContainer = document.createElement("div");
      $studentActionsContainer.append($editStudentBtn, $deleteStudentBtn);

      const $studentContainer = document.createElement("div");
      $studentContainer.setAttribute(
        "class",
        "row justify-content-between p-3"
      );
      $studentContainer.append($studentInfo, $studentActionsContainer);

      const $studentItem = document.createElement("li");
      $studentItem.setAttribute("class", "list-group-item");
      $studentItem.appendChild($studentContainer);

      $studentsList.appendChild($studentItem);
    },
    toEditMode($targetEl, student) {
      const $editInput = document.createElement("input");
      $editInput.setAttribute("id", `studentInfoInput-${student.id}`);
      $editInput.setAttribute("class", "form-control w-50");
      $editInput.setAttribute(
        "value",
        `${student.name}, ${student.id}, ${student.gpa}`
      );
      $editInput.setAttribute("placeholder", "Student name, id, gpa");
      $targetEl.parentElement.replaceChild($editInput, $targetEl);
    },
    setStudentsCount(count) {
      $studentsCount.textContent = count;
    },
  },
  BOM: {
    readStorage() {
      try {
        students = JSON.parse(localStorage.getItem("students")) || [];
      } catch {
        students = [];
      }
      utils.loadStudents(students);
    },
    updateStorage() {
      localStorage.setItem("students", JSON.stringify(students));
    },
  },
};

utils.BOM.readStorage();
feather.replace();
